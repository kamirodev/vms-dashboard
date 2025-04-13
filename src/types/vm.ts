export type VMStatus = "RUNNING" | "STOPPED" | "ERROR" | "PENDING"

export type VM = {
    id: string
    name: string
    cores: number
    ram: number
    disk: number
    os: string
    status: VMStatus
    created_at: string
    updated_at: string
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
