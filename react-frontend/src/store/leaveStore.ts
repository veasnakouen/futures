import { create } from "zustand";
import api from "../services/api";

export interface LeaveRequest {
  id: number;
  employee: any;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  managerApprovalStatus: string;
  chairmanApprovalStatus: string;
  duration: string;
  attachmentUrl?: string;
  createdAt: string;
  adminComment?: string;
}

export interface LeaveBalance {
  id?: number;
  year: number;
  totalAnnualLeave: number;
  usedAnnualLeave: number;
  totalSickLeave: number;
  usedSickLeave: number;
  totalSpecialLeave: number;
  usedSpecialLeave: number;
}

interface LeaveState {
  myLeaves: LeaveRequest[];
  myBalance: LeaveBalance | null;
  pendingManager: LeaveRequest[];
  pendingChairman: LeaveRequest[];
  loading: boolean;
  error: string | null;
  fetchMyLeaves: (employeeId: number) => Promise<void>;
  fetchMyBalance: (employeeId: number, year: number) => Promise<void>;
  fetchPendingManager: (managerId: number) => Promise<void>;
  fetchPendingChairman: (chairmanId: number) => Promise<void>;
  submitLeave: (data: any) => Promise<void>;
  managerApprove: (
    id: number,
    managerId: number,
    approved: boolean,
    comment?: string,
  ) => Promise<void>;
  chairmanApprove: (
    id: number,
    chairmanId: number,
    approved: boolean,
    comment?: string,
  ) => Promise<void>;
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  myLeaves: [],
  myBalance: null,
  pendingManager: [],
  pendingChairman: [],
  loading: false,
  error: null,

  fetchMyLeaves: async (employeeId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/hr/leaves/employee/${employeeId}`);
      set({ myLeaves: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchMyBalance: async (employeeId, year) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(
        `/hr/leaves/employee/${employeeId}/balance/${year}`,
      );
      set({ myBalance: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendingManager: async (managerId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/hr/leaves/pending/manager/${managerId}`);
      set({ pendingManager: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendingChairman: async (chairmanId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/hr/leaves/pending/chairman/${chairmanId}`);
      set({ pendingChairman: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  submitLeave: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post("/hr/leaves", data);
      // refetch
      if (data.employee?.id) {
        get().fetchMyLeaves(data.employee.id);
      }
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  managerApprove: async (id, managerId, approved, comment) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/hr/leaves/${id}/manager-approve`, null, {
        params: { managerId, approved, comment },
      });
      get().fetchPendingManager(managerId);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  chairmanApprove: async (id, chairmanId, approved, comment) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/hr/leaves/${id}/chairman-approve`, null, {
        params: { chairmanId, approved, comment },
      });
      get().fetchPendingChairman(chairmanId);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
