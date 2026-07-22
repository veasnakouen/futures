import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export interface AnnualLeavePlanDto {
  id?: number;
  employeeId: string;
  employeeName?: string;
  planYear: number;
  janDays: number;
  febDays: number;
  marDays: number;
  aprDays: number;
  mayDays: number;
  junDays: number;
  julDays: number;
  augDays: number;
  sepDays: number;
  octDays: number;
  novDays: number;
  decDays: number;
  dateRanges?: {
    id?: number;
    startDate: string;
    endDate: string;
    calculatedDays: number;
  }[];
  updatedAt?: string;
}


export const useMyLeaves = (employeeId: number | null) => {
  return useQuery({
    queryKey: ["myLeaves", employeeId],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leaves/employee/${employeeId}`);
      return data as LeaveRequest[];
    },
    enabled: !!employeeId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useLeaveBalance = (employeeId: number | null, year: number) => {
  return useQuery({
    queryKey: ["leaveBalance", employeeId, year],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leaves/employee/${employeeId}/balance/${year}`);
      return data as LeaveBalance;
    },
    enabled: !!employeeId && !!year,
    retry: 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAnnualLeavePlan = (employeeIdNo: string | null, year: number) => {
  return useQuery({
    queryKey: ["annualLeavePlan", employeeIdNo, year],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leave-plans/${employeeIdNo}/${year}`);
      return data as AnnualLeavePlanDto;
    },
    enabled: !!employeeIdNo && !!year,
    retry: 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAllAnnualLeavePlans = (year: number) => {
  return useQuery({
    queryKey: ["allAnnualLeavePlans", year],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leave-plans/year/${year}`);
      return data as AnnualLeavePlanDto[];
    },
    enabled: !!year,
  });
};

export const useAllLeaves = () => {
  return useQuery({
    queryKey: ["allLeaves"],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leaves`);
      return data as LeaveRequest[];
    },
  });
};

export const usePendingManagerLeaves = (managerId: number | null) => {
  return useQuery({
    queryKey: ["pendingManagerLeaves", managerId],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leaves/pending/manager/${managerId}`);
      return data as LeaveRequest[];
    },
    enabled: !!managerId,
  });
};

export const usePendingChairmanLeaves = (chairmanId: number | null) => {
  return useQuery({
    queryKey: ["pendingChairmanLeaves", chairmanId],
    queryFn: async () => {
      const { data } = await api.get(`/hr/leaves/pending/chairman/${chairmanId}`);
      return data as LeaveRequest[];
    },
    enabled: !!chairmanId,
  });
};

export const useSubmitLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/hr/leaves", payload);
      return data;
    },
    onSuccess: (data, variables) => {
      if (variables?.employee?.id) {
        queryClient.invalidateQueries({ queryKey: ["myLeaves", variables.employee.id] });
      }
    },
  });
};

export const useSaveAnnualLeavePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AnnualLeavePlanDto) => {
      const { data } = await api.post("/hr/leave-plans", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["annualLeavePlan", data.employeeId, data.planYear] });
    },
  });
};

export const useManagerApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, managerId, approved, comment }: { id: number; managerId: number; approved: boolean; comment?: string }) => {
      await api.put(`/hr/leaves/${id}/manager-approve`, null, {
        params: { managerId, approved, comment },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pendingManagerLeaves", variables.managerId] });
    },
  });
};

export const useChairmanApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, chairmanId, approved, comment }: { id: number; chairmanId: number; approved: boolean; comment?: string }) => {
      await api.put(`/hr/leaves/${id}/chairman-approve`, null, {
        params: { chairmanId, approved, comment },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pendingChairmanLeaves", variables.chairmanId] });
    },
  });
};
