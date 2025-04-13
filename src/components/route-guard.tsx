"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/router"
import { useEffect, ReactNode } from "react"

type RouteGuardProps = {
    children: ReactNode
    requiredRole?: "Administrator" | "Client"
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // No hacer nada durante la carga
        if (isLoading) return

        // Redirigir a login si no hay seison
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        // Verifica rol
        if (requiredRole && user?.role !== requiredRole) {
            router.push("/dashboard")
            return
        }
    }, [isLoading, isAuthenticated, router, user, requiredRole])

    // Spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    // No mostrar nada hasta que verificar
    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
        return null
    }

    return <>{children}</>
}