import api from "./api";

export interface InventoryItemDto {
  id: string;
  itemName: string;
  sku: string;
  quantityInStock: number;
  reorderLevel: number;
  unitPrice: number;
  categoryId: string;
}

export interface StockBatchDto {
  id: string;
  itemId: string;
  batchNumber: string;
  receivedDate: string;
  expiryDate: string;
  quantity: number;
  supplierId: string;
}

export const stockService = {
  // --- Inventory Items ---
  getInventoryItems: (page = 0, size = 10) =>
    api.get(`/stock/items?page=${page}&size=${size}`),
  getInventoryItemById: (id: string) => api.get(`/stock/items/${id}`),
  createInventoryItem: (data: Omit<InventoryItemDto, "id">) =>
    api.post(`/stock/items`, data),
  updateInventoryItem: (id: string, data: Omit<InventoryItemDto, "id">) =>
    api.put(`/stock/items/${id}`, data),
  deleteInventoryItem: (id: string) => api.delete(`/stock/items/${id}`),

  // --- Stock Batches ---
  getStockBatches: (page = 0, size = 10) =>
    api.get(`/stock/batches?page=${page}&size=${size}`),
  getStockBatchById: (id: string) => api.get(`/stock/batches/${id}`),
  createStockBatch: (data: Omit<StockBatchDto, "id">) =>
    api.post(`/stock/batches`, data),
  updateStockBatch: (id: string, data: Omit<StockBatchDto, "id">) =>
    api.put(`/stock/batches/${id}`, data),
};
