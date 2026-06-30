import api from './api';

export interface TenantDto {
    id: string;
    name: string;
    managerEmail: string | null;
    isActive: boolean;
    subscriptionEndDate: string | null;
    maxDevices: number;
    allowedModules: string[];
    createdAt: string;
}

export interface CreateTenantCommand {
    id: string;
    name: string;
    managerEmail: string | null;
    isActive: boolean;
    subscriptionEndDate: string | null;
    maxDevices: number;
    allowedModules: string[];
}

export const tenantService = {
    getAllTenants: async (): Promise<TenantDto[]> => {
        const response = await api.get('/auth/tenants');
        return response.data;
    },

    getTenantById: async (id: string): Promise<TenantDto> => {
        const response = await api.get(`/auth/tenants/${id}`);
        return response.data;
    },

    createTenant: async (command: CreateTenantCommand): Promise<TenantDto> => {
        const response = await api.post('/auth/tenants', command);
        return response.data;
    },

    updateTenant: async (id: string, command: CreateTenantCommand): Promise<TenantDto> => {
        const response = await api.put(`/auth/tenants/${id}`, command);
        return response.data;
    },

    deleteTenant: async (id: string): Promise<void> => {
        await api.delete(`/auth/tenants/${id}`);
    }
};
