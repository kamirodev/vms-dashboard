"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

type WebSocketContextType = {
    socket: Socket | null
    isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (!user) return

        const token = localStorage.getItem("token")
        if (!token) return

        const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || "", {
            auth: {
                token,
            },
        })

        socketInstance.on("connect", () => {
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [user])

    return <WebSocketContext.Provider value={{ socket, isConnected }}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
}
