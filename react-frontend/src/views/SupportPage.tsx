import React from "react";
import { Button, Badge, Select, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  FileText,
  Trash2,
  Edit3,
  MoreVertical,
  EyeIcon,
} from "lucide-react";
import { format } from "date-fns";
import ConfirmModal from "@/components/common/ConfirmModal";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import ModernPagination from "@/components/common/ModernPagination";
import SearchInput from "@/components/common/SearchInput";
import { useSupportPageState } from "@/features/hr/hooks/useSupportPageState";
import SupportTicketFormModal from "@/features/hr/components/support/SupportTicketFormModal";
interface SupportPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const SupportPage: React.FC<SupportPageProps> = () => {
  const {
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
  } = useSupportPageState();

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
          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
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
              <DropdownItem onClick={() => handleUpdateStatus(ticket.id, "Resolved")}>
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
          onClick={openNewTicketModal}
          className="rounded-md shadow-xl shadow-blue-500/20 px-4"
        >
          <Plus size={20} className="mr-2" /> New Ticket
        </Button>
      </header>

      {/* Filters Toolbar */}
      <div className="bg-white border-none shadow-sm dark:bg-gray-800 rounded-sm p-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by title or ticket ID..."
              value={search}
              onChange={setSearch}
              containerClassName="w-full"
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
        emptyIcon={<LifeBuoy size={64} className="mx-auto text-gray-200 mb-4" />}
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

      {/* Create / Edit / View Ticket Modal */}
      <SupportTicketFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isViewMode={isViewMode}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      {/*  */}
      <ConfirmModal
        show={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this support ticket? This action cannot be undone."
      />
    </div>
  );
};

export default SupportPage;
