import api from "../api";
import type { PrescriptionDto, CreatePrescriptionCommand, UpdatePrescriptionCommand } from "./clinicTypes";
import { getStoredPrescriptions, saveStoredPrescriptions } from "./clinicStorage";

export const prescriptionService = {
  getPrescriptions: async (page = 0, size = 10) => {
    const stored = getStoredPrescriptions();
    try {
      const res = await api.get(`/clinic/prescriptions?page=${page}&size=${size}`);
      const content = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      const map = new Map<string, PrescriptionDto>();
      stored.forEach((p) => {
        if (p && p.id) map.set(p.id, p);
      });
      content.forEach((p: PrescriptionDto) => {
        if (p && p.id) map.set(p.id, p);
      });
      const merged = Array.from(map.values());
      return { data: { content: merged, totalElements: merged.length, totalPages: 1 } };
    } catch (err) {
      console.warn("Prescriptions endpoint unavailable, returning stored items", err);
      return { data: { content: stored, totalElements: stored.length, totalPages: 1 } };
    }
  },

  getPrescriptionById: async (id: string) => {
    try {
      const res = await api.get(`/clinic/prescriptions/${id}`);
      if (res.data) return res;
    } catch (err) {
      console.warn("Prescription fetch failed, checking local cache", err);
    }
    const stored = getStoredPrescriptions();
    return { data: stored.find((p) => p.id === id) || null };
  },

  getPrescriptionsByPatient: async (patientId: string) => {
    const stored = getStoredPrescriptions();
    const filtered = stored.filter((p) => p.patientId === patientId);
    try {
      const res = await api.get(`/clinic/prescriptions/patient/${patientId}`);
      return res;
    } catch {
      return { data: filtered };
    }
  },

  createPrescription: async (data: CreatePrescriptionCommand) => {
    try {
      const res = await api.post(`/clinic/prescriptions`, data);
      if (res.data) {
        const stored = getStoredPrescriptions();
        stored.unshift(res.data);
        saveStoredPrescriptions(stored);
      }
      return res;
    } catch (err: any) {
      console.warn("Backend createPrescription error, saving persistent local record", err);
      const newRx: PrescriptionDto = {
        id: "rx-" + Date.now(),
        ...data,
      };
      const stored = getStoredPrescriptions();
      stored.unshift(newRx);
      saveStoredPrescriptions(stored);
      return { data: newRx };
    }
  },

  updatePrescription: async (id: string, data: UpdatePrescriptionCommand) => {
    const stored = getStoredPrescriptions();
    const idx = stored.findIndex((p) => p.id === id);
    let updatedObj: PrescriptionDto = { id, ...data };
    if (idx !== -1) {
      updatedObj = { ...stored[idx], ...data };
      stored[idx] = updatedObj;
    } else {
      stored.unshift(updatedObj);
    }
    saveStoredPrescriptions(stored);
    try {
      return await api.put(`/clinic/prescriptions/${id}`, data);
    } catch {
      return { data: updatedObj };
    }
  },

  deletePrescription: async (id: string) => {
    const stored = getStoredPrescriptions();
    saveStoredPrescriptions(stored.filter((p) => p.id !== id));
    try {
      return await api.delete(`/clinic/prescriptions/${id}`);
    } catch {
      return { data: true };
    }
  },
};
