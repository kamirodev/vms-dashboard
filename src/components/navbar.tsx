"use client"

import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/hooks/use-websocket"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
    const { user, logout } = useAuth()
    const { isConnected } = useWebSocket()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900">VMS</span>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {user && (
                            <>
                                <div className="flex items-center space-x-2">
                                    <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="text-sm text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="ml-1 px-2 py-1 text-xs rounded-full bg-gray-100">{user.role}</span>
                                </div>

                                <button onClick={logout} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {user && (
                            <div className="px-4 py-2 space-y-3">
                                <div className="flex items-center space-x-2">
                                    <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="text-sm text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="ml-1 px-2 py-1 text-xs rounded-full bg-gray-100">{user.role}</span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
