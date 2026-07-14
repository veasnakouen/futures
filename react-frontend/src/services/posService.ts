import api from './api';

export interface PosCategoryDto {
    id?: string;
    name: string;
    description?: string;
    colorCode?: string;
    icon?: string;
}

export interface PosBrandDto {
    id?: string;
    name: string;
    description?: string;
    logoUrl?: string;
}

export interface PosProductDto {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    stockQuantity: number;
    category: string;
    barcode?: string;
    costPrice?: number;
    taxRate?: number;
    status?: string;
    imageUrl?: string;
    unit?: string;
    brand?: string;
}

export interface PosSaleItemDto {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount: number;
}

export interface PosSaleDto {
    id: string;
    cashierId: string;
    paymentMethod: string;
    totalAmount: number;
    receiptNumber: string;
    transactionDate: string;
    items: PosSaleItemDto[];
}

export const posService = {
    getAllProducts: async (): Promise<PosProductDto[]> => {
        const response = await api.get('/pos/products');
        return response.data?.value || response.data || [];
    },

    createProduct: async (data: PosProductDto): Promise<PosProductDto> => {
        const response = await api.post('/pos/products', data);
        return response.data;
    },

    generateSku: async (): Promise<{sku: string}> => {
        const response = await api.get('/pos/products/generate-sku');
        return response.data;
    },

    updateProduct: async (id: string, data: PosProductDto): Promise<PosProductDto> => {
        const response = await api.put(`/pos/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/pos/products/${id}`);
    },

    getAllSales: async (): Promise<PosSaleDto[]> => {
        const response = await api.get('/pos/sales');
        return response.data?.value || response.data || [];
    },

    createSale: async (data: PosSaleDto): Promise<PosSaleDto> => {
        const response = await api.post('/pos/sales', data);
        return response.data;
    },

    getAllCategories: async (): Promise<PosCategoryDto[]> => {
        const response = await api.get('/pos/categories');
        return response.data?.value || response.data || [];
    },

    createCategory: async (data: PosCategoryDto): Promise<PosCategoryDto> => {
        const response = await api.post('/pos/categories', data);
        return response.data;
    },

    getAllBrands: async (): Promise<PosBrandDto[]> => {
        const response = await api.get('/pos/brands');
        return response.data?.value || response.data || [];
    },

    createBrand: async (data: PosBrandDto): Promise<PosBrandDto> => {
        const response = await api.post('/pos/brands', data);
        return response.data;
    }
};
