import { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useSupportPageState() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "IT",
    status: "Open",
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tickets");
      const fetched = response.data?.data || response.data;
      setTickets(Array.isArray(fetched) ? fetched : []);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode && editingId) {
        await api.put(`/tickets/${editingId}`, formData);
        toast.success("Support ticket updated");
      } else {
        await api.post("/tickets", formData);
        toast.success("Support ticket created");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setIsViewMode(false);
      setEditingId(null);
      fetchTickets();
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        category: "IT",
        status: "Open",
      });
    } catch {
      toast.error("Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket: any) => {
    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority || "Medium",
      category: ticket.category || "IT",
      status: ticket.status || "Open",
    });
    setEditingId(ticket.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (ticket: any) => {
    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority || "Medium",
      category: ticket.category || "IT",
      status: ticket.status || "Open",
    });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/tickets/${itemToDelete}`);
      toast.success("Ticket removed");
      setIsConfirmOpen(false);
      setItemToDelete(null);
      fetchTickets();
    } catch {
      toast.error("Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id?.toString().includes(search);
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openNewTicketModal = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      category: "IT",
      status: "Open",
    });
    setIsModalOpen(true);
  };

  return {
    tickets,
    loading,
    isModalOpen,
    setIsModalOpen,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isConfirmOpen,
    setIsConfirmOpen,
    isEditMode,
    isViewMode,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleView,
    handleUpdateStatus,
    handleDelete,
    confirmDelete,
    filteredTickets,
    openNewTicketModal,
  };
}
