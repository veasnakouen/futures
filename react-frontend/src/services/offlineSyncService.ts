import api from './api';
import { PosSaleDto } from './posService';
import { toast } from 'react-hot-toast';

const OFFLINE_QUEUE_KEY = 'mtp_pos_offline_sales_queue';

export interface PendingSaleItem {
    id: string;
    saleData: PosSaleDto;
    timestamp: string;
    retryCount: number;
}

export const offlineSyncService = {
    // Check if browser is currently online
    isOnline: (): boolean => {
        return typeof navigator !== 'undefined' ? navigator.onLine : true;
    },

    // Get all pending offline sales queued in browser storage
    getPendingQueue: (): PendingSaleItem[] => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("[offlineSyncService] Error parsing offline queue", e);
            return [];
        }
    },

    // Save sale locally when offline
    queueSaleLocally: (saleData: PosSaleDto): PendingSaleItem => {
        const queue = offlineSyncService.getPendingQueue();
        const pendingItem: PendingSaleItem = {
            id: saleData.id || `pending-${Date.now()}-${Math.random()}`,
            saleData,
            timestamp: new Date().toISOString(),
            retryCount: 0,
        };
        queue.push(pendingItem);
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        console.warn(`[offlineSyncService] Sale #${saleData.receiptNumber} queued offline in browser storage.`);
        return pendingItem;
    },

    // Flush and push all pending offline transactions to the server when internet returns
    syncPendingQueue: async (): Promise<{ successCount: number; failCount: number }> => {
        const queue = offlineSyncService.getPendingQueue();
        if (queue.length === 0) return { successCount: 0, failCount: 0 };

        let successCount = 0;
        let failCount = 0;
        const remainingQueue: PendingSaleItem[] = [];

        for (const item of queue) {
            try {
                await api.post('/pos/sales', item.saleData);
                successCount++;
                console.log(`[offlineSyncService] Synced offline sale #${item.saleData.receiptNumber} to server.`);
            } catch (error) {
                failCount++;
                item.retryCount = (item.retryCount || 0) + 1;
                if (item.retryCount < 5) {
                    remainingQueue.push(item);
                } else {
                    console.error(`[offlineSyncService] Sale #${item.saleData.receiptNumber} exceeded max retries. Keeping for manual inspection.`);
                    remainingQueue.push(item);
                }
            }
        }

        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));

        if (successCount > 0) {
            toast.success(`Successfully synced ${successCount} offline sale(s) to cloud!`);
        }

        return { successCount, failCount };
    },

    // Clear queue manually if needed
    clearQueue: () => {
        localStorage.removeItem(OFFLINE_QUEUE_KEY);
    }
};
