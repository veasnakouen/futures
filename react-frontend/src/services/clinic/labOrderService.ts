import api from "../api";
import type { LabOrderDto, CreateLabOrderCommand, UpdateLabOrderCommand } from "./clinicTypes";
import { getStoredLabOrders, saveStoredLabOrders } from "./clinicStorage";

export const labOrderService = {
  getLabOrders: async (page = 0, size = 10) => {
    const stored = getStoredLabOrders();
    try {
      const res = await api.get(`/clinic/lab-orders?page=${page}&size=${size}`);
      const content = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      const map = new Map<string, LabOrderDto>();
      stored.forEach((l) => {
        if (l && l.id) map.set(l.id, l);
      });
      content.forEach((l: LabOrderDto) => {
        if (l && l.id) map.set(l.id, l);
      });
      const merged = Array.from(map.values());
      return { data: { content: merged, totalElements: merged.length, totalPages: 1 } };
    } catch (err) {
      console.warn("Lab orders endpoint unavailable, returning stored items", err);
      return { data: { content: stored, totalElements: stored.length, totalPages: 1 } };
    }
  },

  getLabOrderById: async (id: string) => {
    try {
      const res = await api.get(`/clinic/lab-orders/${id}`);
      if (res.data) return res;
    } catch (err) {
      console.warn("Lab order fetch failed, checking local cache", err);
    }
    const stored = getStoredLabOrders();
    return { data: stored.find((l) => l.id === id) || null };
  },

  createLabOrder: async (data: CreateLabOrderCommand) => {
    try {
      const res = await api.post(`/clinic/lab-orders`, data);
      if (res.data) {
        const stored = getStoredLabOrders();
        stored.unshift(res.data);
        saveStoredLabOrders(stored);
      }
      return res;
    } catch (err: any) {
      console.warn("Backend createLabOrder error, saving persistent local record", err);
      const newLab: LabOrderDto = {
        id: "lab-" + Date.now(),
        ...data,
      };
      const stored = getStoredLabOrders();
      stored.unshift(newLab);
      saveStoredLabOrders(stored);
      return { data: newLab };
    }
  },

  updateLabOrder: async (id: string, data: UpdateLabOrderCommand) => {
    const stored = getStoredLabOrders();
    const idx = stored.findIndex((l) => l.id === id);
    let updatedObj: LabOrderDto = { id, ...data };
    if (idx !== -1) {
      updatedObj = { ...stored[idx], ...data };
      stored[idx] = updatedObj;
    } else {
      stored.unshift(updatedObj);
    }
    saveStoredLabOrders(stored);
    try {
      return await api.put(`/clinic/lab-orders/${id}`, data);
    } catch {
      return { data: updatedObj };
    }
  },

  deleteLabOrder: async (id: string) => {
    const stored = getStoredLabOrders();
    saveStoredLabOrders(stored.filter((l) => l.id !== id));
    try {
      return await api.delete(`/clinic/lab-orders/${id}`);
    } catch {
      return { data: true };
    }
  },
};
