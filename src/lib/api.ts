import type { CreateVMDto, UpdateVMDto } from "@/types/vm"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Función segura para acceder a localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token") || ''
    }
    return ''
}

async function getAuthHeader() {
    const token = getToken()
    return {
        Authorization: `Bearer ${token}`,
    }
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Login failed")
    }

    const data = await response.json()
    if (data.access_token) {
        localStorage.setItem("token", data.access_token)
    }

    return data
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("token")
    }
}

export async function getVMs(page = 1, search = "") {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    if (search) {
        params.append("search", search)
    }

    const response = await fetch(`${API_URL}/vms?${params.toString()}`, {
        headers: {
            ...(await getAuthHeader()),
        },
    })

    console.log("Response:", response)
    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to fetch VMs")
    }

    const data = await response.json()
    console.log("Datos recibidos:", data)
    return data
}

export async function createVM(data: CreateVMDto) {
    const response = await fetch(`${API_URL}/vms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to create VM")
    }

    return response.json()
}

export async function updateVM(id: string, data: UpdateVMDto) {
    const response = await fetch(`${API_URL}/vms/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to update VM")
    }

    return response.json()
}

export async function deleteVM(id: string) {
    const response = await fetch(`${API_URL}/vms/${id}`, {
        method: "DELETE",
        headers: {
            ...(await getAuthHeader()),
        },
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to delete VM")
    }

    return response.json()
}

// Función para verificar si un usuario está autenticado
export function isAuthenticated() {
    return !!getToken()
}