"use client"

import type { VM, VMStatus } from "@/types/vm"
import { Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type VMTableProps = {
    vms: VM[]
    isLoading: boolean
    onEdit: (vm: VM) => void
    onDelete: (vm: VM) => void
}

export default function VMTable({ vms, isLoading, onEdit, onDelete }: VMTableProps) {
    const { user } = useAuth()
    const isAdmin = user?.role === "ADMIN"

    const getStatusColor = (status: VMStatus) => {
        switch (status) {
            case "RUNNING":
                return "bg-green-100 text-green-800"
            case "STOPPED":
                return "bg-gray-100 text-gray-800"
            case "ERROR":
                return "bg-red-100 text-red-800"
            case "PENDING":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (vms.length === 0) {
        return <div className="text-center py-8 text-gray-500">No virtual machines found</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cores
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RAM (GB)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Disk (GB)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            OS
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        {isAdmin && (
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {vms.map((vm) => (
                        <tr key={vm.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vm.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vm.cores}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vm.ram}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vm.disk}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vm.os}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vm.status)}`}
                                >
                                    {vm.status}
                                </span>
                            </td>
                            {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(vm)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                        <Edit size={18} />
                                        <span className="sr-only">Edit</span>
                                    </button>
                                    <button onClick={() => onDelete(vm)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={18} />
                                        <span className="sr-only">Delete</span>
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
