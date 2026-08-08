import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

// --- SUPPLIERS ---
export const useSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/stock/partners/suppliers");
      return res.data || [];
    },
  });
};

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/stock/partners/suppliers", data),
    onSuccess: () => {
      toast.success("Supplier added successfully");
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => toast.error("Failed to add supplier"),
  });
};

export const useUpdateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/stock/partners/suppliers/${id}`, data),
    onSuccess: () => {
      toast.success("Supplier updated");
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => toast.error("Failed to update supplier"),
  });
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/stock/partners/suppliers/${id}`),
    onSuccess: () => {
      toast.success("Supplier removed");
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => toast.error("Failed to remove supplier"),
  });
};

// --- RETAILERS / VENDORS ---
export const useRetailers = () => {
  return useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      const res = await api.get("/stock/partners/retailers");
      return res.data || [];
    },
  });
};

export const useCreateRetailer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/stock/partners/retailers", data),
    onSuccess: () => {
      toast.success("Retailer added successfully");
      qc.invalidateQueries({ queryKey: ["retailers"] });
    },
    onError: () => toast.error("Failed to add retailer"),
  });
};

export const useUpdateRetailer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/stock/partners/retailers/${id}`, data),
    onSuccess: () => {
      toast.success("Retailer updated");
      qc.invalidateQueries({ queryKey: ["retailers"] });
    },
    onError: () => toast.error("Failed to update retailer"),
  });
};

export const useDeleteRetailer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/stock/partners/retailers/${id}`),
    onSuccess: () => {
      toast.success("Retailer removed");
      qc.invalidateQueries({ queryKey: ["retailers"] });
    },
    onError: () => toast.error("Failed to remove retailer"),
  });
};

// --- CUSTOMERS ---
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await api.get("/stock/partners/customers");
      return res.data || [];
    },
  });
};

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/stock/partners/customers", data),
    onSuccess: () => {
      toast.success("Customer added successfully");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => toast.error("Failed to add customer"),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/stock/partners/customers/${id}`, data),
    onSuccess: () => {
      toast.success("Customer updated");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => toast.error("Failed to update customer"),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/stock/partners/customers/${id}`),
    onSuccess: () => {
      toast.success("Customer removed");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => toast.error("Failed to remove customer"),
  });
};
