import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useLogbookPageState() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    gender: "Male",
    phone: "",
    note: "",
    jobinformation: false,
    library: false,
    usingComputer: false,
    futureService: false,
    interviewTechic: false,
    shortTraining: false,
    user: "Super Admin",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/logbooks", {
        params: { page, size: 10, search },
      });
      setLogs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch {
      toast.error("Failed to load logbook entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await api.put(`/logbooks/${editingId}`, formData);
        toast.success("Logbook entry updated");
      } else {
        await api.post("/logbooks", formData);
        toast.success("Logbook entry saved");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setIsViewMode(false);
      setEditingId(null);
      fetchLogs();
      setFormData({
        gender: "Male",
        phone: "",
        note: "",
        jobinformation: false,
        library: false,
        usingComputer: false,
        futureService: false,
        interviewTechic: false,
        shortTraining: false,
        user: "Super Admin",
      });
    } catch {
      toast.error("Failed to save log entry");
    }
  };

  const handleEdit = (log: any) => {
    setFormData({
      gender: log.gender || "Male",
      phone: log.phone || "",
      note: log.note || "",
      jobinformation: log.jobinformation || false,
      library: log.library || false,
      usingComputer: log.usingComputer || false,
      futureService: log.futureService || false,
      interviewTechic: log.interviewTechic || false,
      shortTraining: log.shortTraining || false,
      user: log.user || "Super Admin",
    });
    setEditingId(log.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (log: any) => {
    setFormData({
      gender: log.gender || "Male",
      phone: log.phone || "",
      note: log.note || "",
      jobinformation: log.jobinformation || false,
      library: log.library || false,
      usingComputer: log.usingComputer || false,
      futureService: log.futureService || false,
      interviewTechic: log.interviewTechic || false,
      shortTraining: log.shortTraining || false,
      user: log.user || "Super Admin",
    });
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
    try {
      await api.delete(`/logbooks/${itemToDelete}`);
      toast.success("Log entry removed");
      fetchLogs();
    } catch {
      toast.error("Failed to delete log entry");
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    setFormData({
      gender: "Male",
      phone: "",
      note: "",
      jobinformation: false,
      library: false,
      usingComputer: false,
      futureService: false,
      interviewTechic: false,
      shortTraining: false,
      user: "Super Admin",
    });
    setIsModalOpen(true);
  };

  return {
    t,
    logs,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    setItemToDelete,
    isEditMode,
    isViewMode,
    editingId,
    formData,
    setFormData,
    fetchLogs,
    handleSubmit,
    handleEdit,
    handleView,
    handleDelete,
    confirmDelete,
    resetForm,
  };
}
