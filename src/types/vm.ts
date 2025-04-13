export type VMStatus = "RUNNING" | "STOPPED" | "ERROR" | "PENDING"

export type VM = {
    id: string
    name: string
    cores: number
    ram: number
    disk: number
    os: string
    status: VMStatus
    createdAt: string
    updatedAt: string
}

export type CreateVMDto = {
    name: string
    cores: number
    ram: number
    disk: number
    os: string
    status: VMStatus
}

export type UpdateVMDto = Partial<CreateVMDto>
