const DB_NAME = 'mtp_pos_db';
const DB_VERSION = 1;
const STORE_PRODUCTS = 'products';
const STORE_SALES_QUEUE = 'sales_queue';

export interface IndexedDbSaleItem {
    id: string;
    idempotencyKey: string;
    saleData: any;
    timestamp: string;
    retryCount: number;
}

const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject('IndexedDB is not supported in this environment');
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject('Failed to open IndexedDB');

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
                db.createObjectStore(STORE_PRODUCTS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(STORE_SALES_QUEUE)) {
                db.createObjectStore(STORE_SALES_QUEUE, { keyPath: 'id' });
            }
        };
    });
};

export const indexedDbService = {
    // Save Product Catalog to IndexedDB
    saveProducts: async (products: any[]): Promise<void> => {
        try {
            const db = await openDatabase();
            const tx = db.transaction(STORE_PRODUCTS, 'readwrite');
            const store = tx.objectStore(STORE_PRODUCTS);
            await store.clear();
            for (const item of products) {
                if (item.id) store.put(item);
            }
        } catch (e) {
            console.error('[indexedDbService] Error saving products', e);
        }
    },

    // Get Product Catalog from IndexedDB
    getProducts: async (): Promise<any[]> => {
        try {
            const db = await openDatabase();
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_PRODUCTS, 'readonly');
                const store = tx.objectStore(STORE_PRODUCTS);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
            });
        } catch {
            return [];
        }
    },

    // Queue Offline Sale with Idempotency Key
    queueSale: async (saleData: any, idempotencyKey: string): Promise<IndexedDbSaleItem> => {
        const item: IndexedDbSaleItem = {
            id: idempotencyKey || `pos-${Date.now()}-${Math.random()}`,
            idempotencyKey,
            saleData,
            timestamp: new Date().toISOString(),
            retryCount: 0,
        };

        try {
            const db = await openDatabase();
            const tx = db.transaction(STORE_SALES_QUEUE, 'readwrite');
            const store = tx.objectStore(STORE_SALES_QUEUE);
            store.put(item);
        } catch (e) {
            console.error('[indexedDbService] Error queueing sale', e);
        }
        return item;
    },

    // Get Pending Sales Queue from IndexedDB
    getPendingQueue: async (): Promise<IndexedDbSaleItem[]> => {
        try {
            const db = await openDatabase();
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_SALES_QUEUE, 'readonly');
                const store = tx.objectStore(STORE_SALES_QUEUE);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
            });
        } catch {
            return [];
        }
    },

    // Remove Synced Sale from IndexedDB Queue
    removeSale: async (id: string): Promise<void> => {
        try {
            const db = await openDatabase();
            const tx = db.transaction(STORE_SALES_QUEUE, 'readwrite');
            const store = tx.objectStore(STORE_SALES_QUEUE);
            store.delete(id);
        } catch (e) {
            console.error('[indexedDbService] Error removing sale', e);
        }
    },
};
