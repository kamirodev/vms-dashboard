"use client"

import { Trash2, AlertCircle } from 'lucide-react'
import type { VM } from '@/types/vm'

interface DeleteDialogProps {
    vm: VM | null
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export default function DeleteDialog({
    vm,
    onConfirm,
    onCancel,
    isLoading
}: DeleteDialogProps) {
    if (!vm) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center mb-4 text-red-600">
                    <AlertCircle className="mr-3 w-6 h-6" />
                    <h2 className="text-xl font-bold">Eliminar Máquina Virtual</h2>
                </div>

                <p className="mb-6 text-gray-600">
                    ¿Estás seguro de que deseas eliminar la máquina virtual
                    <span className="font-semibold ml-1">{vm.name}</span>?
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="animate-spin">○</span>
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}