import React from "react";
import TicketCreationModal from "./TicketCreationModal";
import AssignTicketModal from "./AssignTicketModal";
import AssessmentFormModal from "./AssessmentFormModal";
import ManageTicketTypeModal from "./ManageTicketTypeModal";
import SupportTicketTable from "./support/SupportTicketTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useSupportModuleState } from "@/features/hr/hooks/useSupportModuleState";

import SupportMetricsBanner from "./support/SupportMetricsBanner";
import SupportFiltersBar from "./support/SupportFiltersBar";
import SupportPieAnalytics from "./support/SupportPieAnalytics";
import SupportEvaluationTab from "./support/SupportEvaluationTab";

interface SupportModuleProps {
  tickets?: any[];
  ticketTypes?: any[];
  users?: any[];
  employees?: any[];
  assessments?: any[];
  currentUserId?: string;
  onCreateTicket?: (data: any) => Promise<any>;
  onUpdateTicket?: (id: number, data: any) => Promise<any>;
  onDeleteTicket?: (id: number) => Promise<any>;
  onUpdateTicketStatus?: (id: number, status: string) => Promise<any>;
  onAssignTicket?: (ticketId: number, payload: any) => Promise<any>;
  onUnassignTicket?: (ticketId: number, assigneeId?: string) => Promise<any>;
  onCreateTicketType?: (data: any) => Promise<any>;
  onDeleteTicketType?: (id: number) => Promise<any>;
  onCreateAssessment?: (data: any) => Promise<any>;
  onUpdateAssessment?: (id: number, data: any) => Promise<any>;
  onDeleteAssessment?: (id: number) => Promise<any>;
}

const SupportModule: React.FC<SupportModuleProps> = (props) => {
  const state = useSupportModuleState(props);
  const {
    activeSubTab,
    filtered,
    isCreateOpen,
    setIsCreateOpen,
    editingTicket,
    assignTicket,
    setAssignTicket,
    isAssessmentOpen,
    setIsAssessmentOpen,
    assessmentTicketId,
    isManageTypesOpen,
    setIsManageTypesOpen,
    deletingTicketId,
    setDeletingTicketId,
    ticketTypes,
    users,
    assessments,
    currentUserId,
    handleOpenEdit,
    handleCreateOrUpdateSubmit,
    handleOpenAssignModal,
    handleAssignSubmit,
    handleUnassignSubmit,
    handleOpenAssessmentModal,
    handleAssessmentSubmit,
    handleConfirmDeleteTicket,
    handleStatusChange,
    onCreateTicketType,
    onDeleteTicketType,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top KPI Metrics Banner */}
      <SupportMetricsBanner state={state} />

      {/* Navigation Sub-Tabs & Filters */}
      <SupportFiltersBar state={state} />

      {/* Tab Panel 1: Helpdesk Ticket Data Table */}
      {activeSubTab === "TICKETS" && (
        <SupportTicketTable
          tickets={filtered}
          users={users}
          onOpenAssignModal={handleOpenAssignModal}
          onOpenAssessmentModal={handleOpenAssessmentModal}
          onOpenEditTicketModal={handleOpenEdit}
          onDeleteTicketConfirm={(id: number) => setDeletingTicketId(id)}
          onUpdateTicketStatus={handleStatusChange}
        />
      )}

      {/* Tab Panel 2: Interactive Recharts Pie Analytics */}
      {activeSubTab === "PIE_ANALYTICS" && <SupportPieAnalytics state={state} />}

      {/* Tab Panel 3: Technician Performance & Evaluation Matrix */}
      {activeSubTab === "EVALUATION" && <SupportEvaluationTab state={state} />}

      {/* Ticket Creation & Edit Dialog Modal */}
      {isCreateOpen && (
        <TicketCreationModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          initialData={editingTicket}
          users={users}
          onSubmit={handleCreateOrUpdateSubmit}
        />
      )}

      {/* Technician Assignment Modal */}
      {assignTicket && (
        <AssignTicketModal
          isOpen={!!assignTicket}
          onClose={() => setAssignTicket(null)}
          ticket={assignTicket}
          users={users}
          currentUserId={currentUserId}
          onAssign={(ticketId, payload) => handleAssignSubmit(payload.assigneeId)}
          onUnassign={(ticketId) => handleUnassignSubmit({ id: ticketId })}
        />
      )}

      {/* Technical Assessment & Replacement Form Modal */}
      {isAssessmentOpen && (
        <AssessmentFormModal
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          tickets={filtered}
          assessments={assessments}
          initialTicketId={assessmentTicketId}
          onCreateAssessment={handleAssessmentSubmit}
          onUpdateAssessment={async () => {}}
          onDeleteAssessment={async () => {}}
        />
      )}

      {/* Manage Ticket Categories Modal */}
      {isManageTypesOpen && (
        <ManageTicketTypeModal
          isOpen={isManageTypesOpen}
          onClose={() => setIsManageTypesOpen(false)}
          ticketTypes={ticketTypes}
          onCreateTicketType={onCreateTicketType || (async () => {})}
          onDeleteTicketType={onDeleteTicketType || (async () => {})}
        />
      )}

      {/* Delete Ticket Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingTicketId}
        onClose={() => setDeletingTicketId(null)}
        onConfirm={handleConfirmDeleteTicket}
        title="Delete Helpdesk Ticket"
        message="Are you sure you want to permanently delete this ticket record? This action cannot be undone."
        confirmText="Delete Ticket"
        cancelText="Cancel"
      />
    </div>
  );
};

export default SupportModule;
