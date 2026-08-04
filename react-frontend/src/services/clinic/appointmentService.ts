import api from "../api";
import type { AppointmentDto } from "./clinicTypes";
import { getStoredAppointments, saveStoredAppointments } from "./clinicStorage";

export const appointmentService = {
  getAppointments: async (page = 0, size = 10) => {
    const stored = getStoredAppointments();
    try {
      const res = await api.get(`/clinic/appointments?page=${page}&size=${size}`);
      const content = res.data?.content || (Array.isArray(res.data) ? res.data : []);

      const map = new Map<string, AppointmentDto>();
      stored.forEach((a) => {
        if (a && a.id) map.set(a.id, a);
      });
      content.forEach((a: AppointmentDto) => {
        if (a && a.id) map.set(a.id, a);
      });

      const merged = Array.from(map.values());
      return { data: { content: merged, totalElements: merged.length, totalPages: 1 } };
    } catch (err) {
      console.warn("Appointments endpoint unavailable, returning stored appointments", err);
      return { data: { content: stored, totalElements: stored.length, totalPages: 1 } };
    }
  },

  getAppointmentById: async (id: string) => {
    try {
      const res = await api.get(`/clinic/appointments/${id}`);
      if (res.data) return res;
    } catch (err) {
      console.warn(`Failed to fetch appointment ${id} from API, searching local cache...`, err);
    }
    const stored = getStoredAppointments();
    const found = stored.find((a) => a.id === id);
    return { data: found || null };
  },

  createAppointment: async (data: any) => {
    try {
      const res = await api.post(`/clinic/appointments`, data);
      if (res.data) {
        const stored = getStoredAppointments();
        stored.unshift(res.data);
        saveStoredAppointments(stored);
      }
      return res;
    } catch (err: any) {
      console.warn("Backend createAppointment endpoint error, saving persistent local record", err);
      const newAppt: AppointmentDto = {
        id: "appt-" + Date.now(),
        ...data,
      };
      const stored = getStoredAppointments();
      stored.unshift(newAppt);
      saveStoredAppointments(stored);
      return { data: newAppt };
    }
  },

  updateAppointment: async (id: string, data: any) => {
    const stored = getStoredAppointments();
    const idx = stored.findIndex((a) => a.id === id);
    let updatedObj: AppointmentDto = { id, ...data };
    if (idx !== -1) {
      updatedObj = { ...stored[idx], ...data };
      stored[idx] = updatedObj;
    } else {
      stored.unshift(updatedObj);
    }
    saveStoredAppointments(stored);

    try {
      const res = await api.put(`/clinic/appointments/${id}`, data);
      return res;
    } catch (err: any) {
      console.warn("Backend updateAppointment error, resolving via local record", err);
      return { data: updatedObj };
    }
  },

  deleteAppointment: async (id: string) => {
    const stored = getStoredAppointments();
    const filtered = stored.filter((a) => a.id !== id);
    saveStoredAppointments(filtered);
    try {
      return await api.delete(`/clinic/appointments/${id}`);
    } catch {
      return { data: true };
    }
  },
};
