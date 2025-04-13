import React from 'react';
import { VM } from '@/types/vm';
import {
    ServerIcon,
    CpuIcon,
    MemoryStickIcon,
    HardDriveIcon,
    ClockIcon,
    CalendarIcon,
    Laptop2Icon
} from 'lucide-react';

interface VMDetailProps {
    vm: VM;
    onClose: () => void;
}

// Utility function to format date
const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    } catch {
        return dateString;
    }
};

export const VMDetailModal: React.FC<VMDetailProps> = ({ vm, onClose }) => {
    const getStatusVariant = (status: string) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                    ✕
                </button>

                <div className="flex items-center mb-4">
                    <ServerIcon className="mr-3 text-blue-500" />
                    <h2 className="text-2xl font-bold">{vm.name}</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusVariant(vm.status)}`}
                        >
                            {vm.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <CpuIcon className="mr-2 text-gray-500" size={20} />
                            <span>{vm.cores} vCPU</span>
                        </div>

                        <div className="flex items-center">
                            <MemoryStickIcon className="mr-2 text-gray-500" size={20} />
                            <span>{vm.ram} GB RAM</span>
                        </div>

                        <div className="flex items-center">
                            <HardDriveIcon className="mr-2 text-gray-500" size={20} />
                            <span>{vm.disk} GB Storage</span>
                        </div>

                        <div className="flex items-center">
                            <Laptop2Icon className="mr-2 text-gray-500" size={20} />
                            <span>{vm.os}</span>
                        </div>

                        {/* New section for dates */}
                        <div className="col-span-2 border-t pt-4 mt-2">
                            <div className="flex items-center mb-2">
                                <CalendarIcon className="mr-2 text-gray-500" size={20} />
                                <span className="font-semibold">Fecha de Creación:</span>
                            </div>
                            <p className="text-gray-700 pl-6">{formatDate(vm.created_at)}</p>

                            {vm.updated_at && (
                                <>
                                    <div className="flex items-center mt-2 mb-2">
                                        <CalendarIcon className="mr-2 text-gray-500" size={20} />
                                        <span className="font-semibold">Última Actualización:</span>
                                    </div>
                                    <p className="text-gray-700 pl-6">{formatDate(vm.updated_at)}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};