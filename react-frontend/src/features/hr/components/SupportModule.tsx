import React, { useState, useEffect } from "react";
import { Button } from "@/lib/flowbite-compat";
import { LifeBuoy, Plus, Tag } from "lucide-react";
import toast from "react-hot-toast";
import TicketCreationModal from "./TicketCreationModal";
import ManageTicketTypeModal from "./ManageTicketTypeModal";
import AssessmentFormModal from "./AssessmentFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import AssignTicketModal from "./AssignTicketModal";
import ModernTabs from "@/components/common/ModernTabs";
import SearchInput from "@/components/common/SearchInput";

import SupportTicketTable from "./support/SupportTicketTable";
import SupportAnalyticsView from "./support/SupportAnalyticsView";
import SupportKnowledgeBaseView from "./support/SupportKnowledgeBaseView";

interface SupportModuleProps {
  tickets?: any[];
  ticketTypes?: any[];
  assessments?: any[];
  users?: any[];
  employees?: any[];
  onCreateTicket?: (data: any) => Promise<any>;
  onUpdateTicket?: (id: number, data: any) => Promise<any>;
  onDeleteTicket?: (id: number) => Promise<any>;
  onUpdateTicketStatus?: (id: number, status: string) => Promise<any>;
  onAssignTicket?: (
    id: number,
    payload: { assigneeId: string; assignNote: string; assignedById: string }
  ) => Promise<any>;
  onUnassignTicket?: (id: number, assigneeId?: string) => Promise<any>;
  onCreateTicketType?: (name: string) => Promise<any>;
  onUpdateTicketType?: (id: number, name: string) => Promise<any>;
  onDeleteTicketType?: (id: number) => Promise<any>;
  onCreateAssessment?: (data: any) => Promise<any>;
  onUpdateAssessment?: (id: number, data: any) => Promise<any>;
  onDeleteAssessment?: (id: number) => Promise<any>;
}

const mockDefaultTickets = [
  {
    id: 101,
    subject: "VPN Gateway Authentication Failure",
    description: "Unable to authenticate via OpenVPN SSL certificate on remote node.",
    category: "Network Infrastructure",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assigneeId: "admin",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    subject: "Hardware Workstation RAM Upgrade Request",
    description: "Requesting additional 32GB DDR5 RAM for high-throughput Docker container build testing.",
    category: "Hardware",
    priority: "MEDIUM",
    status: "OPEN",
    assigneeId: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 103,
    subject: "Database Read-Replica Connection Timeout",
    description: "PostgreSQL read-replica latency spikes during peak reporting hours.",
    category: "Database",
    priority: "URGENT",
    status: "IN_PROGRESS",
    assigneeId: "admin",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 104,
    subject: "SSO OAuth Token Expiration Bug",
    description: "JWT access token fails auto-refresh when idle for 60 minutes.",
    category: "Security",
    priority: "HIGH",
    status: "RESOLVED",
    assigneeId: "admin",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 105,
    subject: "Payroll Service Export PDF Alignment Fix",
    description: "Tax breakdown summary table header misalignment on Khmer PDF report.",
    category: "Software Application",
    priority: "LOW",
    status: "CLOSED",
    assigneeId: "admin",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockDefaultUsers = [
  { id: "1", userName: "admin", firstName: "System", lastName: "Admin", email: "admin@mtp.com" },
  { id: "2", userName: "support_lead", firstName: "Sarah", lastName: "Conner", email: "sarah@mtp.com" },
  { id: "3", userName: "dev_lead", firstName: "Michael", lastName: "Jordan", email: "mjordan@mtp.com" },
];

const mockDefaultTicketTypes = [
  { id: 1, name: "Network Infrastructure" },
  { id: 2, name: "Hardware" },
  { id: 3, name: "Database" },
  { id: 4, name: "Security" },
  { id: 5, name: "Software Application" },
];

const SupportModule: React.FC<SupportModuleProps> = ({
  tickets: propTickets,
  ticketTypes: propTicketTypes,
  assessments: propAssessments,
  users: propUsers,
  employees: propEmployees,
  onCreateTicket,
  onUpdateTicket,
  onDeleteTicket,
  onUpdateTicketStatus,
  onAssignTicket,
  onUnassignTicket,
  onCreateTicketType,
  onUpdateTicketType,
  onDeleteTicketType,
  onCreateAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
}) => {
  const [localTickets, setLocalTickets] = useState<any[]>(
    propTickets && propTickets.length > 0 ? propTickets : mockDefaultTickets
  );
  const [localTicketTypes, setLocalTicketTypes] = useState<any[]>(
    propTicketTypes && propTicketTypes.length > 0 ? propTicketTypes : mockDefaultTicketTypes
  );
  const [localUsers, setLocalUsers] = useState<any[]>(
    propUsers && propUsers.length > 0 ? propUsers : mockDefaultUsers
  );

  useEffect(() => {
    if (propTickets && propTickets.length > 0) {
      setLocalTickets(propTickets);
    }
  }, [propTickets]);

  useEffect(() => {
    if (propTicketTypes && propTicketTypes.length > 0) {
      setLocalTicketTypes(propTicketTypes);
    }
  }, [propTicketTypes]);

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setLocalUsers(propUsers);
    }
  }, [propUsers]);

  const [activeTab, setActiveTab] = useState("TICKETS");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Modal States
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentTicketId, setAssessmentTicketId] = useState<number | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<any>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    show: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: () => { },
  });

  const filteredTickets = localTickets.filter((t) => {
    const matchesSearch =
      (t.subject || t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateOrUpdateTicket = async (data: any) => {
    try {
      if (editingTicket) {
        if (onUpdateTicket) {
          await onUpdateTicket(editingTicket.id, data);
        }
        setLocalTickets((prev) =>
          prev.map((t) => (t.id === editingTicket.id ? { ...t, ...data } : t))
        );
        toast.success("Support ticket updated successfully");
      } else {
        if (onCreateTicket) {
          await onCreateTicket(data);
        }
        const newTicket = {
          id: Date.now(),
          ...data,
          status: data.status || "OPEN",
          createdAt: new Date().toISOString(),
        };
        setLocalTickets((prev) => [newTicket, ...prev]);
        toast.success("Support ticket created successfully");
      }
    } catch (err) {
      toast.error("Error saving support ticket");
    } finally {
      setIsTicketModalOpen(false);
    }
  };

  const handleDeleteTicketConfirm = (id: number) => {
    setConfirmModal({
      show: true,
      title: "Delete Support Ticket",
      message: `Are you sure you want to delete ticket #TICK-${id}?`,
      confirmText: "Delete Ticket",
      type: "danger",
      onConfirm: async () => {
        try {
          if (onDeleteTicket) {
            await onDeleteTicket(id);
          }
          setLocalTickets((prev) => prev.filter((t) => t.id !== id));
          toast.success("Support ticket deleted successfully");
        } catch (err) {
          toast.error("Failed to delete support ticket");
        }
      },
    });
  };

  const handleAssignTicket = async (id: number, payload: any) => {
    try {
      if (onAssignTicket) {
        await onAssignTicket(id, payload);
      }
      setLocalTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, assigneeId: payload.assigneeId, status: "IN_PROGRESS" } : t
        )
      );
      toast.success("Ticket assigned successfully");
    } catch (err) {
      toast.error("Failed to assign ticket");
    } finally {
      setIsAssignModalOpen(false);
    }
  };

  const handleUnassignTicket = async (id: number, assigneeId?: string) => {
    try {
      if (onUnassignTicket) {
        await onUnassignTicket(id, assigneeId);
      }
      setLocalTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, assigneeId: null } : t))
      );
      toast.success("Ticket unassigned successfully");
    } catch (err) {
      toast.error("Failed to unassign ticket");
    }
  };

  const handleCreateTicketType = async (name: string) => {
    try {
      if (onCreateTicketType) {
        await onCreateTicketType(name);
      }
      setLocalTicketTypes((prev) => [...prev, { id: Date.now(), name }]);
      toast.success("Category added successfully");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteTicketType = async (id: number) => {
    try {
      if (onDeleteTicketType) {
        await onDeleteTicketType(id);
      }
      setLocalTicketTypes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Category removed");
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const tabs = [
    { id: "TICKETS", label: "Helpdesk Tickets" },
    { id: "ANALYTICS", label: "Service SLA Analytics" },
    { id: "KNOWLEDGE_BASE", label: "Knowledge Base SOPs" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">
              Enterprise IT Support & Helpdesk Hub
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Service requests, SLA tracking, technical assessments, and SOPs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="light"
            onClick={() => setIsManageTypesOpen(true)}
            className="h-11 font-bold text-xs cursor-pointer"
          >
            <Tag size={16} className="mr-1.5 text-blue-600" /> Categories
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setEditingTicket(null);
              setIsTicketModalOpen(true);
            }}
            className="h-11 font-black uppercase text-[10px] tracking-widest cursor-pointer"
          >
            <Plus size={16} className="mr-1.5" /> New Ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <ModernTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "TICKETS" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <SearchInput
              placeholder="Search by ticket subject or description..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              containerClassName="w-full sm:w-80"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-xs h-11 px-3 font-bold flex-1 sm:flex-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-xs h-11 px-3 font-bold flex-1 sm:flex-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <SupportTicketTable
            tickets={filteredTickets}
            users={localUsers}
            onOpenAssignModal={(ticket) => {
              setSelectedTicketForAssign(ticket);
              setIsAssignModalOpen(true);
            }}
            onOpenAssessmentModal={(ticketId) => {
              setAssessmentTicketId(ticketId || null);
              setIsAssessmentModalOpen(true);
            }}
            onOpenEditTicketModal={(ticket) => {
              setEditingTicket(ticket);
              setIsTicketModalOpen(true);
            }}
            onDeleteTicketConfirm={handleDeleteTicketConfirm}
          />
        </div>
      )}

      {activeTab === "ANALYTICS" && <SupportAnalyticsView tickets={localTickets} />}

      {activeTab === "KNOWLEDGE_BASE" && <SupportKnowledgeBaseView />}

      {/* Subcomponent Modals */}
      <TicketCreationModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        users={localUsers}
        onSubmit={handleCreateOrUpdateTicket}
        initialData={editingTicket}
      />

      <ManageTicketTypeModal
        isOpen={isManageTypesOpen}
        onClose={() => setIsManageTypesOpen(false)}
        ticketTypes={localTicketTypes}
        onCreateTicketType={handleCreateTicketType}
        onDeleteTicketType={handleDeleteTicketType}
      />

      <AssessmentFormModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        tickets={localTickets}
        assessments={propAssessments || []}
        onCreateAssessment={onCreateAssessment || (async () => {})}
        onUpdateAssessment={onUpdateAssessment || (async () => {})}
        onDeleteAssessment={onDeleteAssessment || (async () => {})}
        initialTicketId={assessmentTicketId}
      />

      <AssignTicketModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        ticket={selectedTicketForAssign}
        users={localUsers}
        onAssign={handleAssignTicket}
        onUnassign={handleUnassignTicket}
        currentUserId={localUsers[0]?.id || "1"}
      />

      <ConfirmModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  );
};

export default SupportModule;
