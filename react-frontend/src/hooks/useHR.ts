import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useAttendance = () => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data } = await api.get("/hr/attendance");
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};
export const useClients = (page = 0, size = 100) => {
  return useQuery({
    queryKey: ["clients", page, size],
    queryFn: async () => {
      const { data } = await api.get(`/clients?page=${page}&size=${size}`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const usePayroll = () => {
  return useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const { data } = await api.get("/hr/payroll");
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ["analyticsStats"],
    queryFn: async () => {
      const { data } = await api.get("/hr/analytics/stats");
      return data?.data || data;
    },
  });
};

export const useAnalyticsDemographics = () => {
  return useQuery({
    queryKey: ["analyticsDemographics"],
    queryFn: async () => {
      const { data } = await api.get("/hr/analytics/demographics");
      return data?.data || data;
    },
  });
};

export const useAnalyticsDeptDist = () => {
  return useQuery({
    queryKey: ["analyticsDeptDist"],
    queryFn: async () => {
      const { data } = await api.get("/hr/analytics/department-distribution");
      return data?.data || data;
    },
  });
};

export const useHRAssets = () => {
  return useQuery({
    queryKey: ["hrAssets"],
    queryFn: async () => {
      const { data } = await api.get(`/stock/hr/assets?page=0&size=1000&t=${Date.now()}`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useAllEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await api.get(`/employees?page=0&size=1000`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get(`/users`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useLookups = (type: string) => {
  return useQuery({
    queryKey: ["lookups", type],
    queryFn: async () => {
      if (type === "clients" || type === "users") return [];
      const { data } = await api.get(`/lookups/${type}`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useVacancies = () => {
  return useQuery({
    queryKey: ["vacancies"],
    queryFn: async () => {
      const { data } = await api.get(`/vacancies?page=0&size=100`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useRecruitmentStats = () => {
  return useQuery({
    queryKey: ["recruitmentStats"],
    queryFn: async () => {
      const { data } = await api.get(`/placements/stats`);
      return data?.data || data;
    },
  });
};

export const usePlacements = () => {
  return useQuery({
    queryKey: ["placements"],
    queryFn: async () => {
      const { data } = await api.get(`/placements?page=0&size=100`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useEmployers = () => {
  return useQuery({
    queryKey: ["employers"],
    queryFn: async () => {
      const { data } = await api.get(`/employers?page=0&size=100`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await api.get(`/tickets`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useAssessments = () => {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data } = await api.get(`/assessments`);
      const list = data?.data?.content || data?.content || data?.data || data || [];
      return Array.isArray(list) ? list : [];
    },
  });
};

// Mutations
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.post("/lookups/departments", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lookups", "departments"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.delete(`/lookups/departments/name/${encodeURIComponent(name)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lookups", "departments"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-departments"] });
    },
  });
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.post("/lookups/positions", { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "positions"] }),
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.delete(`/lookups/positions/name/${encodeURIComponent(name)}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "positions"] }),
  });
};

export const useCreateTicketType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.post("/lookups/ticket-types", { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "ticket-types"] }),
  });
};

export const useDeleteTicketType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/lookups/ticket-types/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "ticket-types"] }),
  });
};

export const useCreateExpectedSupport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.post("/lookups/expected-supports", { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "expected-supports"] }),
  });
};

export const useDeleteExpectedSupport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => api.delete(`/lookups/expected-supports/name/${encodeURIComponent(name)}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "expected-supports"] }),
  });
};

// HR Asset Mutations
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/stock/hr/assets/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hrAssets"] }),
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/stock/hr/assets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hrAssets"] }),
  });
};

export const useReturnAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.post(`/stock/hr/assets/${id}/return`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hrAssets"] }),
  });
};

export const useAssignAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, employeeId }: { id: number; employeeId: number }) => api.post(`/stock/hr/assets/${id}/assign/${employeeId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hrAssets"] }),
  });
};

// Ticket Mutations
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/tickets", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/tickets/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/tickets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => api.patch(`/tickets/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => api.patch(`/tickets/${id}/assign`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUnassignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assigneeId }: { id: number; assigneeId?: string }) => api.patch(`/tickets/${id}/unassign`, { assigneeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

// Assessment Mutations
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/assessments", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments"] }),
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/assessments/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments"] }),
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/assessments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments"] }),
  });
};

// Vacancy Mutations
export const useCreateVacancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/vacancies", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
};

export const useUpdateVacancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/vacancies/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
};

export const useDeleteVacancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/vacancies/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });
};

// Candidate Mutations
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/clients", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "clients"] }),
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/clients/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "clients"] }),
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/clients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lookups", "clients"] }),
  });
};

// Placement Mutations
export const useCreatePlacement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/placements", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["placements"] }),
  });
};
