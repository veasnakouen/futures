import React, { useState } from "react";
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
  tickets: any[];
  ticketTypes: any[];
  assessments: any[];
  users: any[];
  employees: any[];
  onCreateTicket: (data: any) => Promise<any>;
  onUpdateTicket: (id: number, data: any) => Promise<any>;
  onDeleteTicket: (id: number) => Promise<any>;
  onUpdateTicketStatus: (id: number, status: string) => Promise<any>;
  onAssignTicket: (
    id: number,
    payload: { assigneeId: string; assignNote: string; assignedById: string }
  ) => Promise<any>;
  onUnassignTicket: (id: number, assigneeId?: string) => Promise<any>;
  onCreateTicketType: (name: string) => Promise<any>;
  onUpdateTicketType?: (id: number, name: string) => Promise<any>;
  onDeleteTicketType: (id: number) => Promise<any>;
  onCreateAssessment: (data: any) => Promise<any>;
  onUpdateAssessment: (id: number, data: any) => Promise<any>;
  onDeleteAssessment: (id: number) => Promise<any>;
}

const SupportModule: React.FC<SupportModuleProps> = ({
  tickets = [],
  ticketTypes = [],
  assessments = [],
  users = [],
  employees = [],
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

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      (t.subject || t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDeleteTicketConfirm = (id: number) => {
    setConfirmModal({
      show: true,
      title: "Delete Support Ticket",
      message: `Are you sure you want to delete ticket #TICK-${id}?`,
      confirmText: "Delete Ticket",
      type: "danger",
      onConfirm: async () => {
        try {
          await onDeleteTicket(id);
          toast.success("Support ticket deleted successfully");
        } catch (err) {
          toast.error("Failed to delete support ticket");
        }
      },
    });
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
            className="h-11 font-bold text-xs"
          >
            <Tag size={16} className="mr-1.5 text-blue-600" /> Categories
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setEditingTicket(null);
              setIsTicketModalOpen(true);
            }}
            className="h-11 font-black uppercase text-[10px] tracking-widest"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
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
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-xs h-11 px-3 font-bold flex-1 sm:flex-none"
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
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-xs h-11 px-3 font-bold flex-1 sm:flex-none"
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
            users={users}
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

      {activeTab === "ANALYTICS" && <SupportAnalyticsView tickets={tickets} />}

      {activeTab === "KNOWLEDGE_BASE" && <SupportKnowledgeBaseView />}

      {/* Subcomponent Modals */}
      <TicketCreationModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        users={users}
        onSubmit={async (data) => {
          if (editingTicket) {
            await onUpdateTicket(editingTicket.id, data);
          } else {
            await onCreateTicket(data);
          }
          setIsTicketModalOpen(false);
        }}
        initialData={editingTicket}
      />

      <ManageTicketTypeModal
        isOpen={isManageTypesOpen}
        onClose={() => setIsManageTypesOpen(false)}
        ticketTypes={ticketTypes}
        onCreateTicketType={onCreateTicketType}
        onDeleteTicketType={onDeleteTicketType}
      />

      <AssessmentFormModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        tickets={tickets}
        assessments={assessments}
        onCreateAssessment={onCreateAssessment}
        onUpdateAssessment={onUpdateAssessment}
        onDeleteAssessment={onDeleteAssessment}
        initialTicketId={assessmentTicketId}
      />

      <AssignTicketModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        ticket={selectedTicketForAssign}
        users={users}
        onAssign={onAssignTicket}
        onUnassign={onUnassignTicket}
        currentUserId={users[0]?.id || "1"}
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
