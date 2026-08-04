import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/react-router-compat";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/services/api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const mockEmployersList = [
  {
    id: 1,
    name: "Phnom Penh Tech Solutions",
    category: "Information Technology",
    contactPersonName: "Vannak Touch",
    contactPersonPhone: "+855 12 999 888",
    email: "hr@pptech.com.kh",
    address: "Vattanac Capital Tower, Floor 14",
    status: "Active",
    vacanciesCount: 5,
  },
  {
    id: 2,
    name: "Angkor Grand Resort & Spa",
    category: "Hospitality & Tourism",
    contactPersonName: "Sopheap Lay",
    contactPersonPhone: "+855 63 777 666",
    email: "careers@angkorgrand.com",
    address: "Charles De Gaulle Ave, Siem Reap",
    status: "Active",
    vacanciesCount: 8,
  },
  {
    id: 3,
    name: "MTP Enterprise Logistics",
    category: "Logistics & Supply Chain",
    contactPersonName: "Kosal Chhum",
    contactPersonPhone: "+855 23 555 444",
    email: "contact@mtplogistics.com",
    address: "Phnom Penh Autonomous Port Zone",
    status: "Active",
    vacanciesCount: 3,
  },
];

export function useEmployersPageState() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [connectedEmployers, setConnectedEmployers] = useState<number[]>([1, 3]);

  const toggleB2BConnection = (employerId: number) => {
    if (connectedEmployers.includes(employerId)) {
      setConnectedEmployers(connectedEmployers.filter((id) => id !== employerId));
      toast.success("B2B Employer Network Partnership disconnected");
    } else {
      setConnectedEmployers([...connectedEmployers, employerId]);
      toast.success("B2B Employer Network Partnership established!");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "category",
    "contact",
    "phone",
    "status",
  ]);
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const PAGE_SIZE = viewMode === "grid" ? 9 : 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [formData, setFormData] = useState({
    name: "",
    jobCategoryId: "" as any,
    contactPerson: "",
    contactPhone: "",
    email: "",
    address: "",
    website: "",
    status: "Active",
    logoUrl: "",
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchConnections = async () => {
    try {
      const res = await api.get("/connections");
      setConnections(res.data);
    } catch {}
  };

  const fetchEmployers = async (page = 0, size = 9, search = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/employers?page=${page}&size=${size}&search=${search}`);
      const data = response.data;
      const list = data.content || (Array.isArray(data) ? data : []);
      if (list.length === 0) {
        setEmployers(mockEmployersList);
        setTotalPages(1);
        setTotalElements(mockEmployersList.length);
      } else {
        setEmployers(list);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || list.length);
      }
    } catch {
      setEmployers(mockEmployersList);
      setTotalPages(1);
      setTotalElements(mockEmployersList.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers(currentPage - 1, PAGE_SIZE, debouncedSearchTerm);
    fetchConnections();
  }, [currentPage, debouncedSearchTerm, viewMode]);

  useEffect(() => {
    api
      .get("/job-categories")
      .then((res) => {
        const data = res.data;
        setJobCategories(
          Array.isArray(data.content)
            ? data.content
            : Array.isArray(data)
            ? data
            : []
        );
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await api.put(`/employers/${editingId}`, formData);
        toast.success("Employer record updated");
      } else {
        await api.post("/employers", formData);
        toast.success("New employer registered");
      }
      setIsModalOpen(false);
      resetForm();
      fetchEmployers();
    } catch {
      toast.error("Failed to save employer");
    }
  };

  const handleEdit = (employer: any) => {
    setFormData({
      name: employer.name || "",
      jobCategoryId: employer.jobCategoryId || "",
      contactPerson: employer.contactPerson || "",
      contactPhone: employer.contactPhone || "",
      email: employer.email || "",
      address: employer.address || "",
      website: employer.website || "",
      status: employer.status || "Active",
      logoUrl: employer.logoUrl || "",
    });
    setEditingId(employer.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (employer: any) => {
    setFormData({
      name: employer.name || "",
      jobCategoryId: employer.jobCategoryId || "",
      contactPerson: employer.contactPerson || "",
      contactPhone: employer.contactPhone || "",
      email: employer.email || "",
      address: employer.address || "",
      website: employer.website || "",
      status: employer.status || "Active",
      logoUrl: employer.logoUrl || "",
    });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/employers/${itemToDelete}`);
      toast.success("Employer removed");
      fetchEmployers();
    } catch {
      toast.error("Failed to delete employer");
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      jobCategoryId: "",
      contactPerson: "",
      contactPhone: "",
      email: "",
      address: "",
      website: "",
      status: "Active",
      logoUrl: "",
    });
    setEditingId(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, viewMode]);

  return {
    t,
    navigate,
    employers,
    jobCategories,
    loading,
    searchTerm,
    setSearchTerm,
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
    connections,
    connectedEmployers,
    toggleB2BConnection,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    formData,
    setFormData,
    totalPages,
    totalElements,
    handleSubmit,
    handleEdit,
    handleView,
    confirmDelete,
    resetForm,
    handleLogoChange,
    fetchEmployers,
  };
}
