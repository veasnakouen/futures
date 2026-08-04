import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";

export function useVacanciesPageState() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [applyForm, setApplyForm] = useState({
    clientId: "",
    placementDate: new Date().toISOString().split("T")[0],
  });
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [isJobPositionModalOpen, setIsJobPositionModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("vacanciesViewMode")
        : null;
    return saved === "list" || saved === "grid" ? saved : "grid";
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "salary",
    "deadline",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    }`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vacanciesViewMode", viewMode);
    }
  }, [viewMode]);

  const [quickEmployerData, setQuickEmployerData] = useState({
    name: "",
    contactPerson: "",
  });

  const [quickJobPositionData, setQuickJobPositionData] = useState({
    name: "",
  });

  const [formData, setFormData] = useState({
    employerId: "" as any,
    jobPositionId: "" as any,
    jobCategoryId: "" as any,
    salary: "",
    positionAvailable: 1,
    contractType: "",
    closingDate: new Date().toISOString().split("T")[0],
    status: "Open",
    location: "",
    imageUrl: "",
  });

  const { data, isLoading: loading } = useQuery({
    queryKey: ["vacancies", debouncedSearchTerm, currentPage, pageSize],
    queryFn: async () => {
      const res = await api.get(`/vacancies`, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: debouncedSearchTerm,
        },
      });
      return res.data?.data || res.data;
    },
  });

  const vacancies = data?.content || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data: employersData } = useQuery({
    queryKey: ["employers"],
    queryFn: async () => {
      const res = await api.get("/employers");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const employers = employersData || [];

  const { data: clientsData } = useQuery({
    queryKey: ["clients-brief"],
    queryFn: async () => {
      const res = await api.get("/clients");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const clients = clientsData || [];

  const { data: jobPositionsData } = useQuery({
    queryKey: ["job-positions"],
    queryFn: async () => {
      const res = await api.get("/job-positions");
      const paged = res.data?.data || res.data;
      return Array.isArray(paged?.content) ? paged.content : Array.isArray(paged) ? paged : [];
    },
  });
  const jobPositions = jobPositionsData || [];

  const createMutation = useMutation({
    mutationFn: (newVacancy: any) => api.post("/vacancies", newVacancy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("New job vacancy posted");
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/vacancies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Job vacancy updated");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/vacancies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Vacancy removed");
    },
  });

  const applyMutation = useMutation({
    mutationFn: (placementData: any) => {
      const formattedData = {
        ...placementData,
        placementDate: placementData.placementDate
          ? placementData.placementDate.includes(" ")
            ? placementData.placementDate
            : `${placementData.placementDate} 00:00:00`
          : null,
      };
      return api.post("/placements", formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      setIsApplyModalOpen(false);
      setApplyForm({
        clientId: "",
        placementDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Application successful! Client has been placed.");
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

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy || !applyForm.clientId) return;

    const placementData = {
      clientId: parseInt(applyForm.clientId),
      companyName: selectedVacancy.employerName,
      salary: selectedVacancy.salary,
      placementDate: applyForm.placementDate,
      placementType: "Employment",
      status: "Active",
      jobPositionId: selectedVacancy.jobPositionId,
    };
    applyMutation.mutate(placementData);
  };

  const handleQuickEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/employers", quickEmployerData);
      const newEmployer = response.data;
      queryClient.invalidateQueries({ queryKey: ["employers"] });
      setFormData({ ...formData, employerId: newEmployer.id });
      setIsEmployerModalOpen(false);
      setQuickEmployerData({ name: "", contactPerson: "" });
      toast.success("Employer added and selected");
    } catch {
      toast.error("Failed to save quick employer");
    }
  };

  const handleQuickJobPositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/job-positions", quickJobPositionData);
      const newPosition = response.data;
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
      setFormData({ ...formData, jobPositionId: newPosition.id });
      setIsJobPositionModalOpen(false);
      setQuickJobPositionData({ name: "" });
      toast.success("Job Position added and selected");
    } catch {
      toast.error("Failed to save job position");
    }
  };

  const handleEdit = (vacancy: any) => {
    setFormData({
      employerId: vacancy.employerId || "",
      jobPositionId: vacancy.jobPositionId || "",
      jobCategoryId: vacancy.jobCategoryId || "",
      salary: vacancy.salary || "",
      positionAvailable: vacancy.positionAvailable || 1,
      contractType: vacancy.contractType || "",
      closingDate:
        vacancy.closingDate || new Date().toISOString().split("T")[0],
      status: vacancy.status || "Open",
      location: vacancy.location || "",
      imageUrl: vacancy.imageUrl || "",
    });
    setEditingId(vacancy.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (vacancy: any) => {
    setFormData({
      employerId: vacancy.employerId || "",
      jobPositionId: vacancy.jobPositionId || "",
      jobCategoryId: vacancy.jobCategoryId || "",
      salary: vacancy.salary || "",
      positionAvailable: vacancy.positionAvailable || 1,
      contractType: vacancy.contractType || "",
      closingDate:
        vacancy.closingDate || new Date().toISOString().split("T")[0],
      status: vacancy.status || "Open",
      location: vacancy.location || "",
      imageUrl: vacancy.imageUrl || "",
    });
    setEditingId(vacancy.id);
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

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

  const resetForm = () => {
    setFormData({
      employerId: "",
      jobPositionId: "",
      jobCategoryId: "",
      salary: "",
      positionAvailable: 1,
      contractType: "",
      closingDate: new Date().toISOString().split("T")[0],
      status: "Open",
      location: "",
      imageUrl: "",
    });
    setEditingId(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    setIsEditMode,
    isViewMode,
    setIsViewMode,
    editingId,
    setEditingId,
    isApplyModalOpen,
    setIsApplyModalOpen,
    selectedVacancy,
    setSelectedVacancy,
    applyForm,
    setApplyForm,
    isEmployerModalOpen,
    setIsEmployerModalOpen,
    isJobPositionModalOpen,
    setIsJobPositionModalOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    setItemToDelete,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    getGridClass,
    quickEmployerData,
    setQuickEmployerData,
    quickJobPositionData,
    setQuickJobPositionData,
    formData,
    setFormData,
    vacancies,
    totalPages,
    totalElements,
    loading,
    employers,
    clients,
    jobPositions,
    handleSubmit,
    handleApplySubmit,
    handleQuickEmployerSubmit,
    handleQuickJobPositionSubmit,
    handleEdit,
    handleView,
    handleDelete,
    confirmDelete,
    resetForm,
  };
}
