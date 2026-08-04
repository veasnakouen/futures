import { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export const FALLBACK_CASES = [
  {
    id: 101,
    subject: "Vocational Placement Assessment",
    clientName: "David Miller",
    clientId: 1,
    priority: "High",
    status: "Open",
    serviceType: "Job Placement",
    description: "Detailed career background evaluation and placement strategy for tech sector employment.",
    createdAt: "2026-07-28T10:00:00Z",
    notes: "Candidate has 5+ years experience in IT operations.",
  },
  {
    id: 102,
    subject: "Biometric & Access Credentials Setup",
    clientName: "Sarah Connor",
    clientId: 2,
    priority: "Normal",
    status: "Open",
    serviceType: "Technical Support",
    description: "Configuring hardware security keys and multi-tenant SSO profiles.",
    createdAt: "2026-07-27T14:30:00Z",
    notes: "Awaiting final approval from security manager.",
  },
  {
    id: 103,
    subject: "Departmental Referral Review",
    clientName: "Alex Rivera",
    clientId: 3,
    priority: "Normal",
    status: "Closed",
    serviceType: "Counseling",
    description: "Quarterly performance review and inter-departmental transfer evaluation.",
    createdAt: "2026-07-20T09:15:00Z",
    notes: "Transfer completed successfully.",
  },
];

export function useCasesState() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "close";
    id: number;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [metrics, setMetrics] = useState({
    total: 0,
    highPriority: 0,
    closed: 0,
  });

  const [formData, setFormData] = useState({
    clientId: "",
    subject: "",
    description: "",
    priority: "Normal",
    serviceType: "Job Placement",
  });

  useEffect(() => {
    fetchCases();
    fetchClients();
    fetchMetrics();
  }, [statusFilter, page]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cases", {
        params: {
          status: statusFilter === "All" ? "" : statusFilter,
          page: page + 1,
          size: 10,
        },
      });
      const resData = response.data;
      const paged = resData.data || resData;
      const fetchedCases = Array.isArray(paged.content)
        ? paged.content
        : Array.isArray(paged)
          ? paged
          : [];

      const displayCases = fetchedCases.length > 0 ? fetchedCases : FALLBACK_CASES;
      setCases(displayCases);

      if (displayCases.length > 0) {
        setSelectedCase((prev: any) => {
          if (!prev || !displayCases.find((c: any) => c.id === prev.id)) {
            return displayCases[0];
          }
          return prev;
        });
      } else {
        setSelectedCase(null);
      }

      setTotalPages(paged.totalPages || 1);
    } catch (err: any) {
      console.warn("Could not fetch cases, using fallback demonstration cases:", err?.message);
      setCases(FALLBACK_CASES);
      setSelectedCase(FALLBACK_CASES[0]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await api.get("/cases", { params: { size: 100 } });
      const resData = response.data;
      const paged = resData.data || resData;
      const allCases = Array.isArray(paged.content) ? paged.content : Array.isArray(paged) ? paged : [];
      const metricsList = allCases.length > 0 ? allCases : FALLBACK_CASES;
      setMetrics({
        total: metricsList.length,
        highPriority: metricsList.filter(
          (c: any) => c.priority === "High" && c.status !== "Closed",
        ).length,
        closed: metricsList.filter((c: any) => c.status === "Closed").length,
      });
    } catch (e) {
      setMetrics({
        total: FALLBACK_CASES.length,
        highPriority: 1,
        closed: 1,
      });
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients", { params: { size: 100 } });
      const resData = response.data;
      const paged = resData.data || resData;
      const clientList = Array.isArray(paged.content) ? paged.content : Array.isArray(paged) ? paged : [];
      setClients(clientList);
    } catch (err) {
      console.warn("Could not fetch clients");
      setClients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode && editingId) {
        await api.put(`/cases/${editingId}`, formData);
        toast.success("Case updated successfully");
        if (selectedCase?.id === editingId) {
          setSelectedCase({
            ...selectedCase,
            ...formData,
            client: clients.find((c) => String(c.id) === formData.clientId),
          });
        }
      } else {
        await api.post("/cases", formData);
        toast.success("New case opened");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      fetchCases();
      fetchMetrics();
      setFormData({
        clientId: "",
        subject: "",
        description: "",
        priority: "Normal",
        serviceType: "Job Placement",
      });
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kase: any) => {
    setFormData({
      clientId: kase.client?.id?.toString() || "",
      subject: kase.subject,
      description: kase.description || "",
      priority: kase.priority,
      serviceType: kase.serviceType,
    });
    setEditingId(kase.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (id: number) => {
    setConfirmAction({ type: "delete", id });
    setIsConfirmOpen(true);
  };

  const handleCloseTrigger = (id: number) => {
    setConfirmAction({ type: "close", id });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "delete") {
        await api.delete(`/cases/${confirmAction.id}`);
        toast.success("Case removed");
        if (selectedCase?.id === confirmAction.id) setSelectedCase(null);
      } else {
        await api.patch(`/cases/${confirmAction.id}/status`, {
          status: "Closed",
        });
        toast.success("Case closed successfully");
        if (selectedCase?.id === confirmAction.id)
          setSelectedCase({ ...selectedCase, status: "Closed" });
      }
      setIsConfirmOpen(false);
      fetchCases();
      fetchMetrics();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const openNewCaseModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      clientId: "",
      subject: "",
      description: "",
      priority: "Normal",
      serviceType: "Job Placement",
    });
    setIsModalOpen(true);
  };

  return {
    metrics,
    cases,
    selectedCase,
    setSelectedCase,
    loading,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    setFormData,
    clients,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmAction,
    handleSubmit,
    handleEdit,
    handleDeleteTrigger,
    handleCloseTrigger,
    handleConfirmAction,
    openNewCaseModal,
  };
}

export default useCasesState;
