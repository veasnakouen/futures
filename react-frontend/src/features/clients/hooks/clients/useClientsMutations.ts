import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

interface MutationProps {
  isEditMode: boolean;
  editingId: number | null;
  formData: any;
  setIsEditMode: (val: boolean) => void;
  setEditingId: (val: number | null) => void;
  setIsModalOpen: (val: boolean) => void;
}

export function useClientsMutations({
  isEditMode,
  editingId,
  formData,
  setIsEditMode,
  setEditingId,
  setIsModalOpen,
}: MutationProps) {
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const createMutation = useMutation({
    mutationFn: (newClient: any) => api.post("/clients", newClient),
    onSuccess: (response) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: [response.data, ...oldData.content],
          totalElements: (oldData.totalElements || 0) + 1,
        };
      });
      toast.success("Client created! Now add advanced details.");
      if (response.data && response.data.id) {
        setEditingId(response.data.id);
        setIsEditMode(true);
      } else {
        setIsModalOpen(false);
      }
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataMsg = error.response?.data?.message || error.response?.data || error.message;
      toast.error(
        `Failed to register client (${status || "Network Error"}): ${
          typeof dataMsg === "object" ? JSON.stringify(dataMsg) : dataMsg
        }`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: any }) => {
      const formattedData = { ...data };
      if (formattedData.dateOfBirth && formattedData.dateOfBirth.length === 10) {
        formattedData.dateOfBirth = `${formattedData.dateOfBirth}T00:00:00`;
      }
      if (formattedData.idpoorValiddate && formattedData.idpoorValiddate.length === 10) {
        formattedData.idpoorValiddate = `${formattedData.idpoorValiddate}T00:00:00`;
      }
      try {
        const response = await api.put(`/clients/${id}`, formattedData);
        return response.data;
      } catch {
        return { id, ...data };
      }
    },
    onSuccess: (updatedClient, variables) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map((client: any) =>
            String(client.id) === String(variables.id)
              ? { ...client, ...updatedClient }
              : client
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client profile updated successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update client");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/clients/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ["clients"] }, (oldData: any) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.filter((client: any) => client.id !== id),
          totalElements: Math.max(0, (oldData.totalElements || 1) - 1),
        };
      });
      toast.success("Client removed successfully");
    },
  });

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...formData };
    if (payload.dateOfBirth && payload.dateOfBirth.length === 10) {
      payload.dateOfBirth = `${payload.dateOfBirth}T00:00:00`;
    } else if (!payload.dateOfBirth) {
      payload.dateOfBirth = null;
    }

    if (payload.idpoorValiddate && payload.idpoorValiddate.length === 10) {
      payload.idpoorValiddate = `${payload.idpoorValiddate}T00:00:00`;
    } else if (!payload.idpoorValiddate) {
      payload.idpoorValiddate = null;
    }

    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    setItemToDelete,
    createMutation,
    updateMutation,
    deleteMutation,
    handleDelete,
    confirmDelete,
    handleSubmit,
  };
}
