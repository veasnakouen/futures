import api from './api';
import { PosSaleDto } from './posService';
import { indexedDbService, IndexedDbSaleItem } from './indexedDbService';
import { toast } from 'react-hot-toast';

export const offlineSyncService = {
    // Check if browser is online
    isOnline: (): boolean => {
        return typeof navigator !== 'undefined' ? navigator.onLine : true;
    },

    // Get all pending offline sales queued in IndexedDB
    getPendingQueue: async (): Promise<IndexedDbSaleItem[]> => {
        return await indexedDbService.getPendingQueue();
    },

    // Save sale locally when offline
    queueSaleLocally: async (saleData: PosSaleDto, idempotencyKey: string): Promise<IndexedDbSaleItem> => {
        const item = await indexedDbService.queueSale(saleData, idempotencyKey);
        console.warn(`[offlineSyncService] Sale #${saleData.receiptNumber} queued in IndexedDB with Idempotency Key ${idempotencyKey}`);
        return item;
    },

    // Flush and push pending offline transactions to server with Idempotency Key header
    syncPendingQueue: async (): Promise<{ successCount: number; failCount: number }> => {
        const queue = await indexedDbService.getPendingQueue();
        if (queue.length === 0) return { successCount: 0, failCount: 0 };

        let successCount = 0;
        let failCount = 0;

        for (const item of queue) {
            try {
                await api.post('/pos/sales', item.saleData, {
                    headers: {
                        'X-Idempotency-Key': item.idempotencyKey || item.id,
                    },
                });
                await indexedDbService.removeSale(item.id);
                successCount++;
                console.log(`[offlineSyncService] Synced offline sale #${item.saleData.receiptNumber} with key ${item.idempotencyKey}`);
            } catch (error) {
                failCount++;
                item.retryCount = (item.retryCount || 0) + 1;
                if (item.retryCount > 5) {
                    await indexedDbService.removeSale(item.id);
                    console.error(`[offlineSyncService] Sale #${item.saleData.receiptNumber} exceeded max retries. Removed from queue.`);
                }
            }
        }

        if (successCount > 0) {
            toast.success(`Synced ${successCount} offline POS sale(s) to server!`);
        }

        return { successCount, failCount };
    },
};
