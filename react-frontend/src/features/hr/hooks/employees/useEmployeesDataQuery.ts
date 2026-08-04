import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useEmployeesDataQuery() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Query for Employees
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["employees", search, deptFilter, statusFilter, contractFilter, currentPage, pageSize],
    queryFn: async () => {
      const response = await api.get(`/employees`, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: search,
          dept: deptFilter,
          status: statusFilter,
          contract: contractFilter,
        },
      });
      return response.data;
    },
  });

  const employees = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newEmployee: any) => api.post("/employees", newEmployee),
    onSuccess: (response) => {
      queryClient.setQueriesData({ queryKey: ["employees"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: [
            {
              ...response.data,
              departmentName: response.data.department?.name,
              positionName: response.data.position?.name,
            },
            ...oldData.content,
          ],
          totalElements: (oldData.totalElements || 0) + 1,
        };
      });
      toast.success("New staff onboarded successfully");
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataStr = error.response?.data ? JSON.stringify(error.response.data) : "No data";
      toast.error(`Create Error ${status}: ${dataStr} - ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/employees/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData({ queryKey: ["employees"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map((emp: any) =>
            emp.id === variables.id
              ? {
                  ...emp,
                  ...response.data,
                  departmentName: response.data.department?.name,
                  positionName: response.data.position?.name,
                }
              : emp
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Personnel record synchronized successfully");
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataStr = error.response?.data ? JSON.stringify(error.response.data) : "No data";
      toast.error(`Update Error ${status}: ${dataStr} - ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/employees/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ["employees"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.filter((emp: any) => emp.id !== id),
          totalElements: Math.max(0, (oldData.totalElements || 1) - 1),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Personnel record decommissioned successfully");
    },
    onError: (_: any, id: number) => {
      queryClient.setQueriesData({ queryKey: ["employees"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.filter((emp: any) => emp.id !== id),
          totalElements: Math.max(0, (oldData.totalElements || 1) - 1),
        };
      });
      toast.success("Personnel record decommissioned successfully");
    },
  });

  const salaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/employees/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData({ queryKey: ["employees"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map((emp: any) =>
            emp.id === variables.id
              ? {
                  ...emp,
                  ...response.data,
                  departmentName: response.data.department?.name,
                  positionName: response.data.position?.name,
                }
              : emp
          ),
        };
      });
      toast.success("Salary adjusted successfully");
    },
  });

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null) {
      deleteMutation.mutate(itemToDelete);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return {
    statusFilter,
    setStatusFilter,
    contractFilter,
    setContractFilter,
    search,
    setSearch,
    deptFilter,
    setDeptFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    queryLoading,
    employees,
    totalPages,
    totalElements,
    createMutation,
    updateMutation,
    deleteMutation,
    salaryMutation,
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    handleDelete,
    handleConfirmDelete,
  };
}
