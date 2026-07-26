import { useState, useEffect } from "react";
import {Button, Badge, Spinner, Modal, Label, TextInput, Select, Textarea, ModalBody} from '@/lib/flowbite-compat';
import {
  X,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  Briefcase,
  FileText,
  User,
  Calendar,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import ModernPagination from "@/components/common/ModernPagination";
import { format } from "date-fns";

const CasesPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "close";
    id: number;
  } | null>(null);

  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    clientId: "",
    subject: "",
    description: "",
    priority: "Normal",
    serviceType: "Job Placement",
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [metrics, setMetrics] = useState({
    total: 0,
    highPriority: 0,
    closed: 0,
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
          page: page + 1, // 1-based page number for PaginationRequest
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

      setCases(fetchedCases);

      if (fetchedCases.length > 0) {
        setSelectedCase((prev: any) => {
          if (!prev || !fetchedCases.find((c: any) => c.id === prev.id)) {
            return fetchedCases[0];
          }
          return prev;
        });
      } else {
        setSelectedCase(null);
      }

      setTotalPages(paged.totalPages || 0);
    } catch (err: any) {
      console.warn("Could not fetch cases:", err?.message);
      setCases([]);
      setSelectedCase(null);
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
      setMetrics({
        total: allCases.length,
        highPriority: allCases.filter(
          (c: any) => c.priority === "High" && c.status !== "Closed",
        ).length,
        closed: allCases.filter((c: any) => c.status === "Closed").length,
      });
    } catch (e) {}
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  return (
    <>
      <div className="animate-fade-in pb-10 space-y-6">
        {/* Modern Analytics Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  {t("totalActiveCases")}
                </p>
                <h3 className="text-4xl font-black mt-1">
                  {metrics.total - metrics.closed}
                </h3>
              </div>
              <div className="p-3 bg-white/10 rounded-md">
                <Briefcase size={24} />
              </div>
            </div>
          </div>
          <div className="shadow-xl bg-white dark:bg-gray-800 rounded-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {t("highPriorityAlerts")}
                </p>
                <h3 className="text-4xl font-black mt-1 text-rose-500">
                  {metrics.highPriority}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-md">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
          <div className="shadow-xl bg-white dark:bg-gray-800 rounded-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {t("resolvedCases")}
                </p>
                <h3 className="text-4xl font-black mt-1 dark:text-white">
                  {metrics.closed}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-md">
                <FileText size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Master-Detail Split Pane */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
          {/* Cases List Area */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">{t("cases")}</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsEditMode(false);
                    setIsModalOpen(true);
                  }}
                  className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                >
                  <Plus size={16} className="mr-1" /> {t("new")}
                </Button>
              </div>

              {/* Pill Filters */}
              <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-md">
                {["All", "Open", "Closed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setStatusFilter(f);
                      setPage(0);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${statusFilter === f ?"bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400":"text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                  >
                    {t(f.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : cases.length === 0 ? (
                <div className="py-20 text-center">
                  <Search
                    className="mx-auto text-gray-200 dark:text-gray-700 mb-3"
                    size={48}
                  />
                  <p className="text-sm font-bold text-gray-400">
                    No cases found
                  </p>
                </div>
              ) : (
                cases.map((kase) => (
                  <div
                    key={kase.id}
                    onClick={() => setSelectedCase(kase)}
                    className={`p-4 rounded-md cursor-pointer transition-all ${selectedCase?.id === kase.id ?"bg-blue-50/50 dark:bg-blue-900/20 shadow-sm ring-2 ring-blue-500/50":"bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold dark:text-white leading-tight truncate pr-2">
                        {kase.subject}
                      </h3>
                      <Badge
                        color={kase.priority === "High" ? "failure" : "info"}
                        size="xs"
                        className="shrink-0 font-black tracking-wider uppercase text-[9px]"
                      >
                        {kase.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                      {kase.client?.firstName} {kase.client?.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <span className="truncate">{kase.serviceType}</span>
                      <span>•</span>
                      <span
                        className={
                          kase.status === "Closed"
                            ? "text-gray-400"
                            : "text-emerald-500"
                        }
                      >
                        {kase.status}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {totalPages > 0 && (
                <div className="pt-2 pb-4 flex justify-center">
                  <ModernPagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p - 1)}
                    showInfo={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Detail View */}
          <div className="w-full lg:w-2/3 h-full bg-white dark:bg-gray-800 rounded-md shadow-sm flex flex-col overflow-hidden relative">
            {selectedCase ? (
              <div className="flex flex-col h-full animate-fade-in">
                <div className="p-6 md:p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        color={
                          selectedCase.status === "Closed" ? "gray" : "success"
                        }
                        size="sm"
                        className="font-black uppercase tracking-widest"
                      >
                        {selectedCase.status}
                      </Badge>
                      <Badge
                        color={
                          selectedCase.priority === "High" ? "failure" : "info"
                        }
                        size="sm"
                        className="font-black uppercase tracking-widest"
                      >
                        {selectedCase.priority} Priority
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-black dark:text-white">
                      {selectedCase.subject}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <Calendar size={14} /> Created{" "}
                      {selectedCase.createdAt
                        ? format(
                            new Date(selectedCase.createdAt),
                            "MMM dd, yyyy",
                          )
                        : "Recently"}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {selectedCase.status !== "Closed" && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleCloseTrigger(selectedCase.id)}
                        className="rounded-md flex-1 md:flex-none shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={16} className="mr-2" /> Resolve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="light"
                      onClick={() => handleEdit(selectedCase)}
                      className="rounded-md flex-1 md:flex-none"
                    >
                      <Edit3 size={16} className="mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      outline
                      onClick={() => handleDeleteTrigger(selectedCase.id)}
                      className="rounded-md border-none hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Description */}
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                          Case Description
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                          {selectedCase.description ||
                            "No detailed description provided for this case."}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                          Intervention Protocol
                        </h4>
                        <div className="flex items-center gap-4 p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-black dark:text-white text-base">
                              {selectedCase.serviceType}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              Assigned service track for this intervention.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                          Client Profile
                        </h4>
                        <div className="p-6 rounded-md bg-white dark:bg-gray-800 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto flex items-center justify-center text-gray-400 mb-4 shadow-inner">
                            <User size={32} />
                          </div>
                          <p className="font-black dark:text-white text-base truncate">
                            {selectedCase.client?.firstName}{" "}
                            {selectedCase.client?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-1 font-bold">
                            ID: {selectedCase.client?.clientCode || "N/A"}
                          </p>
                          <Button
                            size="sm"
                            color="light"
                            className="w-full mt-6 rounded-md text-xs font-bold uppercase tracking-widest text-gray-500"
                          >
                            Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-gray-900/20">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5 shadow-inner">
                  <Briefcase
                    size={40}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
                <h3 className="text-xl font-black dark:text-gray-300">
                  No Case Selected
                </h3>
                <p className="text-sm mt-2 max-w-sm text-center font-medium">
                  Select a case from the list on the left to view its full
                  details, client information, and intervention history.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Creating/Editing Cases */}
        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              {isEditMode ? "Edit Case Detail" : "Open New Case"}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={20} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1 block">Client</Label>
                <Select
                  required
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                >
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label className="mb-1 block">Subject</Label>
                <TextInput
                  required
                  placeholder="Case subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Priority</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Low</option>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Service</Label>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                  >
                    <option>Job Placement</option>
                    <option>Social Support</option>
                    <option>Education</option>
                    <option>Medical</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-1 block">Description</Label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <Button
                  outline
                  color="gray"
                  size="sm"
                  className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="blue"
                  size="sm"
                  type="submit"
                  className="rounded-md font-black uppercase text-[10px] tracking-widest px-4 shadow-lg shadow-blue-500/20"
                >
                  {isEditMode ? "Update" : "Open Case"}
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            confirmAction?.type === "delete" ? "Delete Case?" : "Close Case?"
          }
          type={confirmAction?.type === "delete" ? "danger" : "info"}
          message={
            confirmAction?.type === "delete"
              ? "Are you sure you want to delete this case? All history will be lost."
              : "Marking this case as closed indicates that the intervention is complete."
          }
        />
      </div>
    </>
  );
};

export default CasesPage;
