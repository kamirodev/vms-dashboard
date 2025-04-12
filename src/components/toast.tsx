"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"

type ToastType = "success" | "error" | "info"

type Toast = {
    id: string
    message: string
    type: ToastType
}

type ToastContextType = {
    showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { id, message, type }

        setToasts((prev) => [...prev, newToast])

        // Auto-remove toast after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 5000)
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case "success":
                return "bg-green-50 text-green-800 border-green-200"
            case "error":
                return "bg-red-50 text-red-800 border-red-200"
            case "info":
                return "bg-blue-50 text-blue-800 border-blue-200"
            default:
                return "bg-gray-50 text-gray-800 border-gray-200"
        }
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`max-w-xs p-4 rounded-md shadow-md border ${getToastStyles(toast.type)} flex items-center justify-between`}
                    >
                        <p>{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-500 hover:text-gray-700">
                            <X size={16} />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
