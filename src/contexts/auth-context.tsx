"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"


type User = {
    id: string
    email: string
    name?: string
    role: "Administrator" | "Client"
}

type AuthContextType = {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decoded = jwtDecode<any>(token)

                // Comprobar si el token ha expirado
                const currentTime = Date.now() / 1000
                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expirado
                    localStorage.removeItem("token")
                    setIsLoading(false)
                    return
                }

                const userData: User = {
                    id: decoded.sub || decoded.id,
                    email: decoded.email,
                    role: decoded.role
                }

                setUser(userData)
            } catch (error) {
                console.error("Invalid token:", error)
                localStorage.removeItem("token")
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                throw new Error("Invalid credentials")
            }

            const data = await response.json()
            localStorage.setItem("token", data.access_token)

            try {
                const decoded = jwtDecode<any>(data.access_token)

                const userData: User = {
                    id: decoded.sub || decoded.id,
                    email: decoded.email,
                    role: decoded.role
                }

                setUser(userData)
                router.push("/dashboard")
            } catch (error) {
                console.error("Failed to decode token:", error)
                throw new Error("Invalid token format")
            }
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}