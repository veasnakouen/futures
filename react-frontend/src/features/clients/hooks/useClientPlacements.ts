import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export function useClientPlacements(clientId: string | string[] | undefined, fetchProfile: () => void) {
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: placementCategories = [] } = useQuery({
    queryKey: ["placementCategories"],
    queryFn: async () => {
      try {
        const res = await api.get("/placement-categories");
        const data = res.data?.value || res.data || [];
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    },
  });
  const placementTypes = placementCategories.map((c: any) => c.name);

  const [isManagePlacementTypesOpen, setIsManagePlacementTypesOpen] = useState(false);
  const [newPlacementTypeName, setNewPlacementTypeName] = useState("");
  const [editingPlacementTypeIndex, setEditingPlacementTypeIndex] = useState<number | null>(null);
  const [editingPlacementTypeValue, setEditingPlacementTypeValue] = useState("");

  const [placementForm, setPlacementForm] = useState({
    clientId,
    companyName: "",
    salary: "",
    placementDate: new Date().toISOString().split("T")[0],
    status: "Active",
    placementType: placementTypes[0] || "Employment",
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      setPlacementForm({ ...placementForm, placementDate: dateString });
    }
  };

  const handleAddPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...placementForm,
        placementDate: placementForm.placementDate
          ? placementForm.placementDate.split(" ")[0] + " 00:00:00"
          : null,
      };
      if (isEditMode && editingId) {
        await api.put(`/placements/${editingId}`, formattedData);
      } else {
        await api.post("/placements", formattedData);
      }
      setIsPlacementModalOpen(false);
      fetchProfile();
    } catch {
      toast.error("Failed to save placement");
    }
  };

  const createPlacementCategoryMutation = useMutation({
    mutationFn: async (name: string) => await api.post("/placement-categories", { name }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type "${res.data.name}" added`);
      setNewPlacementTypeName("");
    },
    onError: () => toast.error("Failed to add placement type. It may already exist."),
  });

  const handleAddPlacementType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlacementTypeName.trim();
    if (!trimmed) {
      toast.error("Placement type cannot be empty");
      return;
    }
    createPlacementCategoryMutation.mutate(trimmed);
  };

  const deletePlacementCategoryMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/placement-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type deleted`);
    },
  });

  const handleDeletePlacementType = (id: number, typeName: string) => {
    if (!window.confirm(`Are you sure you want to delete the type "${typeName}"?`)) return;
    deletePlacementCategoryMutation.mutate(id, {
      onSuccess: () => {
        if (placementForm.placementType === typeName) {
          setPlacementForm((prev) => ({
            ...prev,
            placementType: placementTypes.find((t: string) => t !== typeName) || "",
          }));
        }
      },
    });
  };

  const updatePlacementCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) =>
      await api.put(`/placement-categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type updated`);
      setEditingPlacementTypeIndex(null);
    },
    onError: () => toast.error("Failed to update placement type. Name may already exist."),
  });

  const handleEditPlacementType = (id: number, index: number) => {
    const trimmed = editingPlacementTypeValue.trim();
    if (!trimmed) {
      toast.error("Placement type name cannot be empty");
      return;
    }
    const oldName = placementCategories[index].name;
    updatePlacementCategoryMutation.mutate(
      { id, name: trimmed },
      {
        onSuccess: () => {
          if (placementForm.placementType === oldName) {
            setPlacementForm((prev) => ({ ...prev, placementType: trimmed }));
          }
        },
      }
    );
  };

  return {
    isPlacementModalOpen,
    setIsPlacementModalOpen,
    editingId,
    setEditingId,
    isEditMode,
    setIsEditMode,
    placementCategories,
    placementTypes,
    isManagePlacementTypesOpen,
    setIsManagePlacementTypesOpen,
    newPlacementTypeName,
    setNewPlacementTypeName,
    editingPlacementTypeIndex,
    setEditingPlacementTypeIndex,
    editingPlacementTypeValue,
    setEditingPlacementTypeValue,
    placementForm,
    setPlacementForm,
    handleDateChange,
    handleAddPlacement,
    handleAddPlacementType,
    handleDeletePlacementType,
    handleEditPlacementType,
  };
}
