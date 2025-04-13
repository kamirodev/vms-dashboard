import axios from 'axios';
import type { CreateVMDto, UpdateVMDto } from "@/types/vm";
import { LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función auxiliar para obtener el token
const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

// Función auxiliar para obtener los headers de autenticación
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function getVMs() {
    try {
        const response = await axios.get(`${API_URL}/vms`, {
            headers: {
                ...getAuthHeaders(),
            }
        });

        console.log("Respuesta completa:", response);
        return response.data;
    } catch (error) {
        console.error('Error fetching VMs:', error);
        throw error;
    }
}

export async function createVM(data: CreateVMDto) {
    try {
        const response = await axios.post(`${API_URL}/vms`, data, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating VM:', error);
        throw error;
    }
}

export async function updateVM(id: string, data: UpdateVMDto) {
    try {
        const response = await axios.patch(`${API_URL}/vms/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating VM:', error);
        throw error;
    }
}

export async function deleteVM(id: string) {
    try {
        const response = await axios.delete(`${API_URL}/vms/${id}`, {
            headers: {
                ...getAuthHeaders(),
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting VM:', error);
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${API_URL}/auth/login`,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = response.data as LoginResponse;

        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export async function logout() {
    localStorage.removeItem('token');
}