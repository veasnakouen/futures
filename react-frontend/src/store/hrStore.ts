import { create } from "zustand";
import api from "../services/api";

interface HRState {
  globalAttendance: any[];
  globalLeaves: any[];
  globalAssets: any[];
  globalStock: any[];
  globalPayroll: any[];
  analyticsData: {
    stats: any;
    demographics: any;
    deptDist: any[];
  };
  globalVacancies: any[];
  recruitmentStats: any;
  globalClients: any[];
  globalEmployers: any[];
  globalPositions: any[];
  globalDepartments: any[];
  globalPlacements: any[];
  globalTickets: any[];
  globalTicketTypes: any[];
  globalExpectedSupports: any[];
  globalAssessments: any[];
  globalEmployees: any[];
  globalUsers: any[];
  loading: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  fetchGlobalData: () => Promise<void>;
  updateAsset: (id: number, data: any) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  returnAsset: (id: number) => Promise<void>;
  assignAsset: (id: number, employeeId: number) => Promise<void>;
  createTicket: (data: any) => Promise<void>;
  updateTicketStatus: (id: number, status: string) => Promise<void>;
  assignTicket: (
    id: number,
    payload: { assigneeId: string; assignNote: string; assignedById: string },
  ) => Promise<void>;
  unassignTicket: (id: number, assigneeId?: string) => Promise<void>;
  createDepartment: (name: string) => Promise<void>;
  deleteDepartment: (name: string) => Promise<void>;
  createPosition: (name: string) => Promise<void>;
  deletePosition: (name: string) => Promise<void>;
  createTicketType: (name: string) => Promise<void>;
  deleteTicketType: (id: number) => Promise<void>;
  createExpectedSupport: (name: string) => Promise<void>;
  deleteExpectedSupport: (name: string) => Promise<void>;
  createAssessment: (data: any) => Promise<void>;
  updateAssessment: (id: number, data: any) => Promise<void>;
  deleteAssessment: (id: number) => Promise<void>;
  updateTicket: (id: number, data: any) => Promise<void>;
  deleteTicket: (id: number) => Promise<void>;
}

export const useHRStore = create<HRState>((set, get) => ({
  globalAttendance: [],
  globalLeaves: [],
  globalAssets: [],
  globalStock: [],
  globalPayroll: [],
  analyticsData: { stats: {}, demographics: {}, deptDist: [] },
  globalVacancies: [],
  recruitmentStats: {},
  globalClients: [],
  globalEmployers: [],
  globalPositions: [],
  globalDepartments: [],
  globalPlacements: [],
  globalTickets: [],
  globalTicketTypes: [],
  globalExpectedSupports: [],
  globalAssessments: [],
  globalEmployees: [],
  globalUsers: [],
  loading: false,

  setLoading: (loading) => set({ loading }),

  fetchGlobalData: async () => {
    set({ loading: true });
    const safeFetch = async (url: string, process?: (data: any) => any) => {
      try {
        const res = await api.get(url);
        return process ? process(res.data) : res.data;
      } catch (err) {
        console.error(`Store Sync Failure [${url}]:`, err);
        return null;
      }
    };

    const data1 = await Promise.all([
      safeFetch("/hr/attendance"),
      safeFetch("/hr/leaves"),
      safeFetch("/hr/payroll"),
      safeFetch(
        `/stock/hr/assets?page=0&size=100&t=${Date.now()}`,
        (data) => data.content || [],
      ),
      safeFetch(
        `/stock/inventory?page=0&size=100&t=${Date.now()}`,
        (data) => data.content || [],
      )
    ]);
    
    const data2 = await Promise.all([
      safeFetch("/hr/analytics/stats"),
      safeFetch("/hr/analytics/demographics"),
      safeFetch("/hr/analytics/department-distribution"),
      safeFetch("/vacancies?page=0&size=100", (data) => data.content || []),
      safeFetch("/placements/stats")
    ]);
    
    const data3 = await Promise.all([
      safeFetch("/clients?page=0&size=100", (data) => data.content || []),
      safeFetch("/placements?page=0&size=100", (data) => data.content || []),
      safeFetch("/employers?page=0&size=100", (data) => data.content || []),
      safeFetch("/lookups/positions"),
      safeFetch("/lookups/departments")
    ]);
    
    const data4 = await Promise.all([
      safeFetch("/tickets"),
      safeFetch("/lookups/ticket-types"),
      safeFetch("/lookups/expected-supports"),
      safeFetch("/assessments"),
      safeFetch("/users"),
      safeFetch("/employees?page=0&size=1000", (data) => data.content || [])
    ]);

    const [attendance, leaves, payroll, assets, stock] = data1;
    const [stats, demographics, deptDist, vacancies, recruitmentStats] = data2;
    const [clients, placements, employers, positions, departments] = data3;
    const [tickets, ticketTypes, expectedSupports, assessments, allUsers, allEmployees] = data4;

    set({
      globalAttendance: attendance || [],
      globalLeaves: leaves || [],
      globalPayroll: payroll || [],
      globalAssets: assets || [],
      globalStock: stock || [],
      analyticsData: {
        stats: stats || {},
        demographics: demographics || {},
        deptDist: deptDist || [],
      },
      globalVacancies: vacancies || [],
      recruitmentStats: recruitmentStats || {},
      globalClients: clients || [],
      globalPlacements: placements || [],
      globalEmployers: employers || [],
      globalPositions: positions || [],
      globalDepartments: departments || [],
      globalTickets: tickets || [],
      globalTicketTypes: ticketTypes || [],
      globalExpectedSupports: expectedSupports || [],
      globalAssessments: assessments || [],
      globalUsers: allUsers || [],
      globalEmployees: allEmployees || [],
      loading: false,
    });
  },

  updateAsset: async (id, data) => {
    await api.put(`/stock/hr/assets/${id}`, data);
    await get().fetchGlobalData();
  },

  deleteAsset: async (id) => {
    await api.delete(`/stock/hr/assets/${id}`);
    await get().fetchGlobalData();
  },

  returnAsset: async (id) => {
    await api.post(`/stock/hr/assets/${id}/return`);
    await get().fetchGlobalData();
  },

  assignAsset: async (id, employeeId) => {
    await api.post(`/stock/hr/assets/${id}/assign/${employeeId}`);
    await get().fetchGlobalData();
  },

  createDepartment: async (name) => {
    await api.post("/lookups/departments", { name });
    await get().fetchGlobalData();
  },

  deleteDepartment: async (name) => {
    await api.delete(`/lookups/departments/name/${encodeURIComponent(name)}`);
    await get().fetchGlobalData();
  },

  createPosition: async (name) => {
    await api.post("/lookups/positions", { name });
    await get().fetchGlobalData();
  },

  deletePosition: async (name) => {
    await api.delete(`/lookups/positions/name/${encodeURIComponent(name)}`);
    await get().fetchGlobalData();
  },

  createTicket: async (data) => {
    await api.post("/tickets", data);
    await get().fetchGlobalData();
  },

  updateTicketStatus: async (id, status) => {
    await api.patch(`/tickets/${id}/status`, { status });
    await get().fetchGlobalData();
  },

  assignTicket: async (id, payload) => {
    await api.patch(`/tickets/${id}/assign`, payload);
    await get().fetchGlobalData();
  },

  unassignTicket: async (id, assigneeId) => {
    await api.patch(`/tickets/${id}/unassign`, { assigneeId });
    await get().fetchGlobalData();
  },

  createTicketType: async (name) => {
    await api.post("/lookups/ticket-types", { name });
    await get().fetchGlobalData();
  },

  deleteTicketType: async (id) => {
    await api.delete(`/lookups/ticket-types/${id}`);
    await get().fetchGlobalData();
  },

  createExpectedSupport: async (name) => {
    await api.post("/lookups/expected-supports", { name });
    await get().fetchGlobalData();
  },

  deleteExpectedSupport: async (name) => {
    await api.delete(
      `/lookups/expected-supports/name/${encodeURIComponent(name)}`,
    );
    await get().fetchGlobalData();
  },

  createAssessment: async (data) => {
    await api.post("/assessments", data);
    await get().fetchGlobalData();
  },

  updateAssessment: async (id, data) => {
    await api.put(`/assessments/${id}`, data);
    await get().fetchGlobalData();
  },

  deleteAssessment: async (id) => {
    await api.delete(`/assessments/${id}`);
    await get().fetchGlobalData();
  },

  updateTicket: async (id, data) => {
    await api.put(`/tickets/${id}`, data);
    await get().fetchGlobalData();
  },

  deleteTicket: async (id) => {
    await api.delete(`/tickets/${id}`);
    await get().fetchGlobalData();
  },
}));
