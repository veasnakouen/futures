import { useState, useEffect } from "react";
import {Button, Badge, Spinner, TextInput, Select, Modal, Label, Textarea, Dropdown, DropdownItem, DropdownDivider} from '@/lib/flowbite-compat';
import {
  X,
  LifeBuoy,
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  FileText,
  Trash2,
  Edit3,
  MoreVertical,
  View,
  Eye,
  EyeIcon,
} from "lucide-react";
import Layout from "@/components/common/Layout";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import api from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import ModernPagination from "@/components/common/ModernPagination";

const SupportPage = ({ isDark, setIsDark }: any) => {
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
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tickets");
      setTickets(response.data || []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

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
      });
    } catch (err) {
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
    } catch (err) {
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
      fetchTickets();
    } catch (err) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "failure";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "info";
      case "in progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "gray";
      default:
        return "info";
    }
  };

  const columns: DataTableColumn<any>[] = [
    {
      key: "ticket",
      label: "Ticket",
      render: (ticket) => (
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0`}
          >
            <MessageSquare size={18} className="text-gray-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                #{ticket.id}
              </span>
              <h3 className="text-sm font-black dark:text-white truncate max-w-[200px]">
                {ticket.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Clock size={10} />{" "}
                {ticket.createdAt
                  ? format(new Date(ticket.createdAt), "MMM dd, HH:mm")
                  : "N/A"}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <FileText size={10} /> {ticket.category}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (ticket) => (
        <Badge
          color={getPriorityColor(ticket.priority)}
          className="rounded-full px-3 py-1 text-[9px] font-bold uppercase inline-flex"
        >
          {ticket.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (ticket) => (
        <Badge
          color={getStatusColor(ticket.status)}
          className="rounded-full px-3 py-1 text-[9px] font-bold uppercase inline-flex"
        >
          {ticket.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (ticket) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all">
                <MoreVertical size={16} />
              </button>
            }
          >
            {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
              <DropdownItem
                onClick={() => handleUpdateStatus(ticket.id, "Resolved")}
              >
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                  <CheckCircle2 size={14} />
                  <span>Resolve</span>
                </div>
              </DropdownItem>
            )}
            <DropdownItem onClick={() => handleView(ticket)}>
              <div className="flex items-center gap-2 text-xs">
                <EyeIcon size={14} className="dark:text-white" />
                <span>View</span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => handleEdit(ticket)}>
              <div className="flex items-center gap-2 text-xs">
                <Edit3 size={14} className="text-blue-500" />
                <span>Edit</span>
              </div>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={() => handleDelete(ticket.id)}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium text-xs">
                <Trash2 size={14} />
                <span>Delete</span>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Support Center">
      <div className="space-y-3 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">
              Support Tickets
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Internal Tickets System and issue tracking
            </p>
          </div>
          <Button
            color="blue"
            onClick={() => {
              setIsEditMode(false);
              setIsViewMode(false);
              setFormData({
                title: "",
                description: "",
                priority: "Medium",
                category: "IT",
              });
              setIsModalOpen(true);
            }}
            className="rounded-md shadow-xl shadow-blue-500/20 px-4"
          >
            <Plus size={20} className="mr-2" /> New Ticket
          </Button>
        </header>

        {/* Filters */}
        <div className="bg-white border-none shadow-sm dark:bg-gray-800 rounded-sm p-3">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <TextInput
                icon={Search}
                type="text"
                placeholder="Search by title or ticket ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
                sizing="md"
              />
            </div>
            <div className="w-1/3">
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <DataTable
          columns={columns}
          data={filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          loading={loading}
          keyExtractor={(ticket) => ticket.id}
          emptyMessage="No Tickets Found"
          emptySubMessage="All caught up! No active support requests match your criteria."
          emptyIcon={
            <LifeBuoy size={64} className="mx-auto text-gray-200 mb-4" />
          }
        />
        
        {!loading && filteredTickets.length > 0 && (
          <div className="mt-4">
            <ModernPagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredTickets.length / pageSize)}
              onPageChange={setCurrentPage}
              totalItems={filteredTickets.length}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showInfo={true}
            />
          </div>
        )}

        {/* Create Ticket Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CustomModalHeader
            title={
              isViewMode
                ? "Ticket Details"
                : isEditMode
                  ? "Edit Support Ticket"
                  : "New Support Ticket"
            }
            subtitle="Support Center"
            onClose={() => setIsModalOpen(false)}
          />
          <div className="p-6 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1 block">Issue Title</Label>
                <TextInput
                  required
                  placeholder="e.g. Cannot access email"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  disabled={isViewMode}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={isViewMode}
                  >
                    <option>IT</option>
                    <option>Facilities</option>
                    <option>Human Resources</option>
                    <option>General</option>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Priority</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    disabled={isViewMode}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Description</Label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Provide more details..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isViewMode}
                />
              </div>
              <div className="pt-4">
                <CustomModalFooter
                  onClose={() => setIsModalOpen(false)}
                  isEditMode={isEditMode}
                  submitText={isEditMode ? "Update Ticket" : "Create Ticket"}
                  cancelText={isViewMode ? "Close" : "Cancel"}
                  hideSubmit={isViewMode}
                />
              </div>
            </form>
          </div>
        </Modal>

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this support ticket? This action cannot be undone."
        />
      </div>
    </Layout>
  );
};

export default SupportPage;
