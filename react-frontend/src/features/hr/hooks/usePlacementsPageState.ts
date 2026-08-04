import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { useDebounce } from "@/hooks/useDebounce";

export function usePlacementsPageState() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [salaryError, setSalaryError] = useState<string | null>(null);

  const { data: placementCategories = [] } = useQuery({
    queryKey: ["placementCategories"],
    queryFn: async () => {
      const res = await api.get("/placement-categories");
      return res.data;
    },
  });
  const placementTypes = placementCategories.map((c: any) => c.name);

  const [formData, setFormData] = useState({
    clientId: "",
    companyName: "",
    salary: "",
    placementDate: new Date().toISOString().split("T")[0],
    status: "Active",
    placementType: "Employment",
    imageUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const executeUpload = async (fileToUpload: File) => {
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(fileToUpload);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "commencement",
    "compensatory",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      "placements",
      debouncedSearchQuery,
      statusFilter,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const response = await api.get("/placements", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: debouncedSearchQuery,
          status: statusFilter === "All Status" || statusFilter === "All" ? "" : statusFilter,
        },
      });
      return response.data;
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  const { data: stats } = useQuery({
    queryKey: ["placement-stats"],
    queryFn: async () => {
      const response = await api.get("/placements/stats");
      return response.data;
    },
  });

  const placements = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const createMutation = useMutation({
    mutationFn: (newPlacement: any) => {
      const formattedData = {
        ...newPlacement,
        placementDate: newPlacement.placementDate
          ? newPlacement.placementDate.includes(" ")
            ? newPlacement.placementDate
            : `${newPlacement.placementDate} 00:00:00`
          : null,
      };
      return api.post("/placements", formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement recorded");
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      const formattedData = {
        ...data,
        placementDate: data.placementDate
          ? data.placementDate.includes(" ")
            ? data.placementDate
            : `${data.placementDate} 00:00:00`
          : null,
      };
      return api.put(`/placements/${id}`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement updated");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/placements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["placement-stats"] });
      toast.success("Placement removed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenModal = (placement?: any) => {
    if (placement) {
      setFormData({
        clientId: placement.clientId?.toString() || "",
        companyName: placement.companyName || "",
        salary: placement.salary?.toString() || "",
        placementDate:
          placement.placementDate || new Date().toISOString().split("T")[0],
        status: placement.status || "Active",
        placementType: placement.placementType || "Employment",
        imageUrl: placement.imageUrl || "",
      });
      setEditingId(placement.id);
      setIsEditMode(true);
    } else {
      setFormData({
        clientId: "",
        companyName: "",
        salary: "",
        placementDate: new Date().toISOString().split("T")[0],
        status: "Active",
        placementType: "Employment",
        imageUrl: "",
      });
      setIsEditMode(false);
      setEditingId(null);
    }
    setSalaryError(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewModal = (placement: any) => {
    setFormData({
      clientId: placement.clientId?.toString() || "",
      companyName: placement.companyName || "",
      salary: placement.salary?.toString() || "",
      placementDate:
        placement.placementDate || new Date().toISOString().split("T")[0],
      status: placement.status || "Active",
      placementType: placement.placementType || "Employment",
      imageUrl: placement.imageUrl || "",
    });
    setEditingId(placement.id);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    setIsEditMode,
    isViewMode,
    setIsViewMode,
    editingId,
    setEditingId,
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    setItemToDelete,
    salaryError,
    setSalaryError,
    placementCategories,
    placementTypes,
    formData,
    setFormData,
    isUploading,
    cropImageSrc,
    setCropImageSrc,
    isCropModalOpen,
    setIsCropModalOpen,
    selectedFile,
    handleImageUpload,
    executeUpload,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    loading,
    refetch,
    stats,
    placements,
    totalPages,
    totalElements,
    handleSubmit,
    handleOpenModal,
    handleViewModal,
    handleDeleteClick,
    confirmDelete,
  };
}
