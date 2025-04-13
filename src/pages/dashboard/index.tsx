"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useWebSocket } from "@/hooks/use-websocket"
import { useToast } from "@/components/toast"
import { createVM, deleteVM, getVMs, updateVM } from "@/lib/api"
import type { CreateVMDto, VM } from "@/types/vm"
import VMTable from "@/components/vm/vm-table"
import VMForm from "@/components/vm/vm-form"
import DeleteDialog from "@/components/delete-dialog"
import { Plus } from "lucide-react"
import { getClientLayout } from "@/layouts/client-layout"

export default function DashboardPage() {
    const { user } = useAuth()
    const { socket } = useWebSocket()
    const { showToast } = useToast()
    const queryClient = useQueryClient()
    const isAdmin = user?.role === "Administrator"

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingVM, setEditingVM] = useState<VM | null>(null)
    const [deletingVM, setDeletingVM] = useState<VM | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch VMs
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["vms", page, search],
        queryFn: () => getVMs(page, search),
    })

    const vms = data|| []
    const totalPages = data?.meta?.totalPages || 1

    useEffect(() => {
        if (!socket) return

        const handleVMCreated = (vm: VM) => {
            queryClient.invalidateQueries({ queryKey: ["vms"] })
            showToast(`VM "${vm.name}" Se creó correctamente`, "success")
        }

        const handleVMUpdated = (vm: VM) => {
            queryClient.invalidateQueries({ queryKey: ["vms"] })
            showToast(`VM "${vm.name}" Se actualizó correctmante`, "info")
        }

        const handleVMDeleted = (vm: VM) => {
            queryClient.invalidateQueries({ queryKey: ["vms"] })
            showToast(`VM "${vm.name}" Se eliminó`, "success")
        }

        socket.on("vm:created", handleVMCreated)
        socket.on("vm:updated", handleVMUpdated)
        socket.on("vm:deleted", handleVMDeleted)

        return () => {
            socket.off("vm:created", handleVMCreated)
            socket.off("vm:updated", handleVMUpdated)
            socket.off("vm:deleted", handleVMDeleted)
        }
    }, [socket, queryClient, showToast])

    const handleCreateVM = async (data: CreateVMDto) => {
        setIsSubmitting(true)
        try {
            await createVM(data)
            setShowCreateForm(false)
            refetch()
        } catch (error) {
            console.error("Failed to create VM:", error)
            showToast("Hubo un error al crear la VM", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditVM = async (data: CreateVMDto) => {
        if (!editingVM) return

        setIsSubmitting(true)
        try {
            await updateVM(editingVM.id, data)
            setEditingVM(null)
            refetch()
        } catch (error) {
            console.error("Failed to update VM:", error)
            showToast("Hubo un error al actualizar la VM", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteVM = async () => {
        if (!deletingVM) return

        setIsSubmitting(true)
        try {
            await deleteVM(deletingVM.id)
            showToast(`VM "${deletingVM.name}" Se eliminó correctamente`, "success")
            setDeletingVM(null)
            refetch()
        } catch (error) {
            console.error("Failed to delete VM:", error)
            showToast("Hubo un error al eliminar la VM", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="sm:flex sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Maquinas Virtuales</h1>

                {isAdmin && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear VM
                    </button>
                )}
            </div>

            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <VMTable
                    vms={vms}
                    isLoading={isLoading}
                    onEdit={(vm) => setEditingVM(vm)}
                    onDelete={(vm) => setDeletingVM(vm)}
                />

                {!isLoading && vms.length > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{page}</span> of{" "}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCreateForm && (
                <VMForm onSubmit={handleCreateVM} onCancel={() => setShowCreateForm(false)} isLoading={isSubmitting} />
            )}

            {editingVM && (
                <VMForm vm={editingVM} onSubmit={handleEditVM} onCancel={() => setEditingVM(null)} isLoading={isSubmitting} />
            )}

            {deletingVM && (
                <DeleteDialog
                    vm={deletingVM}
                    onConfirm={handleDeleteVM}
                    onCancel={() => setDeletingVM(null)}
                    isLoading={isSubmitting}
                />
            )}
        </>
    )
}

DashboardPage.getLayout = getClientLayout
