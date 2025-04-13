"use client"

import type { CreateVMDto, VM, VMStatus } from "@/types/vm"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"

type VMFormProps = {
    vm?: VM
    onSubmit: (data: CreateVMDto) => void
    onCancel: () => void
    isLoading: boolean
}

const OS_OPTIONS = [
    "Ubuntu 20.04",
    "Ubuntu 22.04",
    "CentOS 7",
    "CentOS 8",
    "Debian 10",
    "Debian 11",
    "Windows Server 2019",
    "Windows Server 2022",
]

const STATUS_OPTIONS: VMStatus[] = ["RUNNING", "STOPPED", "PENDING", "ERROR"]

export default function VMForm({ vm, onSubmit, onCancel, isLoading }: VMFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateVMDto>({
        defaultValues: vm
            ? {
                name: vm.name,
                cores: vm.cores,
                ram: vm.ram,
                disk: vm.disk,
                os: vm.os,
                status: vm.status,
            }
            : {
                cores: 1,
                ram: 1,
                disk: 10,
                status: "STOPPED",
            },
    })

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium">{vm ? "Edit Virtual Machine" : "Create Virtual Machine"}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="cores" className="block text-sm font-medium text-gray-700">
                            CPU Cores
                        </label>
                        <input
                            id="cores"
                            type="number"
                            min="1"
                            max="32"
                            {...register("cores", {
                                required: "Cores is required",
                                min: { value: 1, message: "Minimum 1 core" },
                                max: { value: 32, message: "Maximum 32 cores" },
                                valueAsNumber: true,
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.cores && <p className="mt-1 text-sm text-red-500">{errors.cores.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="ram" className="block text-sm font-medium text-gray-700">
                            RAM (GB)
                        </label>
                        <input
                            id="ram"
                            type="number"
                            min="1"
                            max="128"
                            {...register("ram", {
                                required: "RAM is required",
                                min: { value: 1, message: "Minimum 1 GB" },
                                max: { value: 128, message: "Maximum 128 GB" },
                                valueAsNumber: true,
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.ram && <p className="mt-1 text-sm text-red-500">{errors.ram.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="disk" className="block text-sm font-medium text-gray-700">
                            Disk (GB)
                        </label>
                        <input
                            id="disk"
                            type="number"
                            min="10"
                            max="1000"
                            {...register("disk", {
                                required: "Disk is required",
                                min: { value: 10, message: "Minimum 10 GB" },
                                max: { value: 1000, message: "Maximum 1000 GB" },
                                valueAsNumber: true,
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.disk && <p className="mt-1 text-sm text-red-500">{errors.disk.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="os" className="block text-sm font-medium text-gray-700">
                            Operating System
                        </label>
                        <select
                            id="os"
                            {...register("os", { required: "OS is required" })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select OS</option>
                            {OS_OPTIONS.map((os) => (
                                <option key={os} value={os}>
                                    {os}
                                </option>
                            ))}
                        </select>
                        {errors.os && <p className="mt-1 text-sm text-red-500">{errors.os.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register("status", { required: "Status is required" })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
