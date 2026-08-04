import api from './api';
import { offlineSyncService } from './offlineSyncService';
import { indexedDbService } from './indexedDbService';

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
    domain?: 'ALL' | 'RETAIL' | 'CLINIC' | 'HOTEL' | 'SCHOOL' | 'CUSTOM';
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
    discountType?: 'FIXED' | 'PERCENT';
}

export interface PosSaleDto {
    id?: string;
    cashierId?: string;
    cashierName?: string;
    customerId?: string;
    customerName?: string;
    customerType?: 'WALK_IN' | 'PATIENT' | 'GUEST' | 'STUDENT' | 'CLIENT';
    paymentMethod: 'CASH' | 'QR_CODE' | 'CARD' | 'SPLIT' | 'ON_ACCOUNT';
    tenderedAmount?: number;
    changeAmount?: number;
    splitDetails?: { cashAmount: number; qrAmount: number; cardAmount: number };
    totalAmount: number;
    subtotalAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    receiptNumber: string;
    transactionDate: string;
    idempotencyKey?: string;
    domainType?: string;
    notes?: string;
    items: PosSaleItemDto[];
}

const MOCK_UNIVERSAL_PRODUCTS: PosProductDto[] = [
    // Retail & Goods
    { id: 'p-1', name: 'Espresso Arabica Coffee (250g)', sku: 'RET-001', barcode: '885012345678', price: 12.50, stockQuantity: 45, category: 'Retail', domain: 'RETAIL', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80' },
    { id: 'p-2', name: 'Organic Matcha Green Tea', sku: 'RET-002', barcode: '885012345679', price: 18.00, stockQuantity: 30, category: 'Retail', domain: 'RETAIL', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80' },
    { id: 'p-3', name: 'Wireless Ergonomic Mouse', sku: 'RET-003', barcode: '885012345680', price: 29.99, stockQuantity: 15, category: 'Electronics', domain: 'RETAIL', imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80' },
    { id: 'p-4', name: 'Stainless Steel Water Bottle', sku: 'RET-004', barcode: '885012345681', price: 15.00, stockQuantity: 50, category: 'Retail', domain: 'RETAIL', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80' },

    // Clinic & Medical
    { id: 'p-10', name: 'General Medical Consultation', sku: 'CLI-001', price: 25.00, stockQuantity: 999, category: 'Medical Services', domain: 'CLINIC', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80' },
    { id: 'p-11', name: 'Complete Blood Count (CBC) Test', sku: 'CLI-002', price: 35.00, stockQuantity: 999, category: 'Lab Testing', domain: 'CLINIC', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80' },
    { id: 'p-12', name: 'Paracetamol 500mg (Box 100s)', sku: 'CLI-003', price: 8.50, stockQuantity: 120, category: 'Pharmacy', domain: 'CLINIC', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
    { id: 'p-13', name: 'Dental Cleaning & Polishing', sku: 'CLI-004', price: 45.00, stockQuantity: 999, category: 'Dental', domain: 'CLINIC', imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80' },

    // Hotel & Hospitality
    { id: 'p-20', name: 'Deluxe Suite (Nightly)', sku: 'HTL-001', price: 85.00, stockQuantity: 999, category: 'Rooms', domain: 'HOTEL', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80' },
    { id: 'p-21', name: 'Airport Transfer Shuttle', sku: 'HTL-002', price: 20.00, stockQuantity: 999, category: 'Transport', domain: 'HOTEL', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80' },
    { id: 'p-22', name: 'Premium Minibar Refreshment', sku: 'HTL-003', price: 16.00, stockQuantity: 40, category: 'Minibar', domain: 'HOTEL', imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80' },
    { id: 'p-23', name: 'Spa & Wellness Day Pass', sku: 'HTL-004', price: 30.00, stockQuantity: 999, category: 'Amenities', domain: 'HOTEL', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },

    // School & Education
    { id: 'p-30', name: 'Semester Tuition Fee (High School)', sku: 'SCH-001', price: 450.00, stockQuantity: 999, category: 'Tuition', domain: 'SCHOOL', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80' },
    { id: 'p-31', name: 'Student Blazer & Uniform Set', sku: 'SCH-002', price: 35.00, stockQuantity: 80, category: 'Uniforms', domain: 'SCHOOL', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80' },
    { id: 'p-32', name: 'Advanced STEM Textbook Pack', sku: 'SCH-003', price: 24.50, stockQuantity: 65, category: 'Books', domain: 'SCHOOL', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80' },
    { id: 'p-33', name: 'Robotics Lab Club Registration', sku: 'SCH-004', price: 75.00, stockQuantity: 999, category: 'Clubs', domain: 'SCHOOL', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80' },
];

export const posService = {
    getAllProducts: async (): Promise<PosProductDto[]> => {
        try {
            const response = await api.get('/pos/products');
            const data = response.data?.value || response.data || [];
            if (Array.isArray(data)) {
                indexedDbService.saveProducts(data);
                return data;
            }
        } catch (error) {
            console.warn("[posService] Backend POS microservice unavailable. Attempting IndexedDB offline fallback.");
            const offlineProducts = await indexedDbService.getProducts();
            if (offlineProducts && offlineProducts.length > 0) {
                return offlineProducts;
            }
        }
        return MOCK_UNIVERSAL_PRODUCTS;
    },

    createProduct: async (data: PosProductDto): Promise<PosProductDto> => {
        try {
            const response = await api.post('/pos/products', data);
            return response.data;
        } catch (e) {
            return { ...data, id: `p-custom-${Date.now()}` };
        }
    },

    generateSku: async (): Promise<{ sku: string }> => {
        try {
            const response = await api.get('/pos/products/generate-sku');
            return response.data;
        } catch (error) {
            return { sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}` };
        }
    },

    updateProduct: async (id: string, data: PosProductDto): Promise<PosProductDto> => {
        try {
            const response = await api.put(`/pos/products/${id}`, data);
            return response.data;
        } catch (e) {
            return data;
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        try {
            await api.delete(`/pos/products/${id}`);
        } catch (e) {
            // Silently ignore fallback delete
        }
    },

    getAllSales: async (): Promise<PosSaleDto[]> => {
        try {
            const response = await api.get('/pos/sales');
            return response.data?.value || response.data || [];
        } catch (error) {
            return [];
        }
    },

    createSale: async (data: PosSaleDto): Promise<PosSaleDto> => {
        const idempotencyKey = data.idempotencyKey || `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const payload = { ...data, idempotencyKey };

        try {
            if (!offlineSyncService.isOnline()) {
                await offlineSyncService.queueSaleLocally(payload, idempotencyKey);
                return payload;
            }
            const response = await api.post('/pos/sales', payload, {
                headers: { 'X-Idempotency-Key': idempotencyKey }
            });
            return response.data;
        } catch (error) {
            console.warn("[posService] Backend server unreachable. Queuing sale in IndexedDB for sync:", payload);
            await offlineSyncService.queueSaleLocally(payload, idempotencyKey);
            return payload;
        }
    },

    getAllCategories: async (): Promise<PosCategoryDto[]> => {
        try {
            const response = await api.get('/pos/categories');
            const data = response.data?.value || response.data || [];
            if (Array.isArray(data) && data.length > 0) return data;
        } catch (error) {
            // Ignore
        }
        return [
            { id: 'cat-1', name: 'Retail', colorCode: '#3b82f6' },
            { id: 'cat-2', name: 'Medical Services', colorCode: '#10b981' },
            { id: 'cat-3', name: 'Rooms & Lodging', colorCode: '#f59e0b' },
            { id: 'cat-4', name: 'Tuition & Fees', colorCode: '#8b5cf6' },
        ];
    },

    createCategory: async (data: PosCategoryDto): Promise<PosCategoryDto> => {
        try {
            const response = await api.post('/pos/categories', data);
            return response.data;
        } catch (e) {
            return data;
        }
    },

    getAllBrands: async (): Promise<PosBrandDto[]> => {
        try {
            const response = await api.get('/pos/brands');
            return response.data?.value || response.data || [];
        } catch (error) {
            return [];
        }
    },

    createBrand: async (data: PosBrandDto): Promise<PosBrandDto> => {
        try {
            const response = await api.post('/pos/brands', data);
            return response.data;
        } catch (e) {
            return data;
        }
    }
};
