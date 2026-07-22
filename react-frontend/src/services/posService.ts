import api from './api';

export interface PosProductDto {
    id?: string;
    name: string;
    sku: string;
    barcode?: string;
    price: number;
    costPrice?: number;
    stockQuantity: number;
    minStockLevel?: number;
    categoryId?: string;
    categoryName?: string;
    category?: string;
    brandId?: string;
    brandName?: string;
    brand?: string;
    taxRate?: number;
    status?: string;
    unit?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
}

export interface PosCategoryDto {
    id?: string;
    name: string;
    description?: string;
    colorCode?: string;
}

export interface PosBrandDto {
    id?: string;
    name: string;
    description?: string;
    logoUrl?: string;
}

export interface PosSaleItemDto {
    id?: string;
    productId: string;
    productName: string;
    productSku?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount?: number;
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
        try {
            const response = await api.get('/pos/products');
            return response.data?.value || response.data || [];
        } catch (error) {
            console.warn("[posService] Unable to reach /api/pos/products endpoint. Returning fallback empty array.");
            return [];
        }
    },

    createProduct: async (data: PosProductDto): Promise<PosProductDto> => {
        const response = await api.post('/pos/products', data);
        return response.data;
    },

    generateSku: async (): Promise<{sku: string}> => {
        try {
            const response = await api.get('/pos/products/generate-sku');
            return response.data;
        } catch (error) {
            return { sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}` };
        }
    },

    updateProduct: async (id: string, data: PosProductDto): Promise<PosProductDto> => {
        const response = await api.put(`/pos/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/pos/products/${id}`);
    },

    getAllSales: async (): Promise<PosSaleDto[]> => {
        try {
            const response = await api.get('/pos/sales');
            return response.data?.value || response.data || [];
        } catch (error) {
            console.warn("[posService] Unable to reach /api/pos/sales endpoint. Returning fallback empty array.");
            return [];
        }
    },

    createSale: async (data: PosSaleDto): Promise<PosSaleDto> => {
        const response = await api.post('/pos/sales', data);
        return response.data;
    },

    getAllCategories: async (): Promise<PosCategoryDto[]> => {
        try {
            const response = await api.get('/pos/categories');
            return response.data?.value || response.data || [];
        } catch (error) {
            console.warn("[posService] Unable to reach /api/pos/categories endpoint. Returning fallback empty array.");
            return [];
        }
    },

    createCategory: async (data: PosCategoryDto): Promise<PosCategoryDto> => {
        const response = await api.post('/pos/categories', data);
        return response.data;
    },

    getAllBrands: async (): Promise<PosBrandDto[]> => {
        try {
            const response = await api.get('/pos/brands');
            return response.data?.value || response.data || [];
        } catch (error) {
            console.warn("[posService] Unable to reach /api/pos/brands endpoint. Returning fallback empty array.");
            return [];
        }
    },

    createBrand: async (data: PosBrandDto): Promise<PosBrandDto> => {
        const response = await api.post('/pos/brands', data);
        return response.data;
    }
};
