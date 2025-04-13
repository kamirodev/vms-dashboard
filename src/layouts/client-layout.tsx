// layouts/client-layout.tsx
"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import { RouteGuard } from "@/components/route-guard"

type ClientLayoutProps = {
    children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    {children}
                </div>
            </main>
        </div>
    )
}

export const getClientLayout = (page: React.ReactNode) => {
    return (
        <RouteGuard>
            <ClientLayout>{page}</ClientLayout>
        </RouteGuard>
    )
}