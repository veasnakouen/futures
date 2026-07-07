import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { outreachService, referralCaseService, departmentService, OutreachVisitDto, ReferralCaseDto, ReferralDto, DepartmentDto } from "../services/schoolService";
import toast from "react-hot-toast";

// --- Outreach Visits ---

export const useOutreachVisits = () => {
  return useQuery({
    queryKey: ["outreachVisits"],
    queryFn: async () => {
      const response = await outreachService.getVisits();
      return response.data;
    },
  });
};

export const useStudentOutreachVisits = (studentId: string) => {
  return useQuery({
    queryKey: ["outreachVisits", studentId],
    queryFn: async () => {
      const response = await outreachService.getVisitsByStudent(studentId);
      return response.data;
    },
    enabled: !!studentId,
  });
};

export const useCreateOutreachVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OutreachVisitDto) => outreachService.createVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreachVisits"] });
      toast.success("Outreach visit logged successfully");
    },
    onError: () => {
      toast.error("Failed to log outreach visit");
    },
  });
};

// --- Referral Cases ---

export const useReferralCases = () => {
  return useQuery({
    queryKey: ["referralCases"],
    queryFn: async () => {
      const response = await referralCaseService.getCases();
      return response.data;
    },
  });
};

export const useStudentReferralCases = (studentId: string) => {
  return useQuery({
    queryKey: ["referralCases", studentId],
    queryFn: async () => {
      const response = await referralCaseService.getCasesByStudent(studentId);
      return response.data;
    },
    enabled: !!studentId,
  });
};

export const useCreateReferralCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReferralCaseDto) => referralCaseService.createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralCases"] });
      toast.success("Referral case opened successfully");
    },
  });
};

export const useUpdateReferralCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReferralCaseDto }) => referralCaseService.updateCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralCases"] });
      toast.success("Case updated");
    },
  });
};

export const useAddReferral = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, data }: { caseId: string; data: ReferralDto }) => referralCaseService.addReferral(caseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralCases"] });
      toast.success("Department referral assigned");
    },
  });
};

export const useUpdateReferral = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ referralId, data }: { referralId: string; data: ReferralDto }) => referralCaseService.updateReferral(referralId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralCases"] });
      toast.success("Referral updated");
    },
  });
};

export const useReferralsByDepartments = (departmentIds: number[]) => {
  return useQuery({
    queryKey: ["referrals", "byDepartments", departmentIds],
    queryFn: async () => {
      if (departmentIds.length === 0) return [];
      const response = await referralCaseService.getReferralsByDepartments(departmentIds);
      return response.data;
    },
    enabled: departmentIds.length > 0,
  });
};

// --- Departments ---

export const useDepartments = () => {
  return useQuery({
    queryKey: ["schoolDepartments"],
    queryFn: async () => {
      const response = await departmentService.getDepartments();
      return response.data;
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentDto) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolDepartments"] });
      toast.success("Department created successfully");
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentDto }) => departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolDepartments"] });
      toast.success("Department updated successfully");
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolDepartments"] });
      toast.success("Department deleted successfully");
    },
  });
};
