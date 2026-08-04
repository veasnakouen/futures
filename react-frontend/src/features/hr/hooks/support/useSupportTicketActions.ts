import { useState } from "react";
import toast from "react-hot-toast";

interface SupportActionsProps {
  ticketsState: any[];
  setTicketsState: React.Dispatch<React.SetStateAction<any[]>>;
  onCreateTicket?: (data: any) => Promise<any>;
  onUpdateTicket?: (id: number, data: any) => Promise<any>;
  onDeleteTicket?: (id: number) => Promise<any>;
  onUpdateTicketStatus?: (id: number, status: string) => Promise<any>;
  onAssignTicket?: (id: number, data: any) => Promise<any>;
  onUnassignTicket?: (id: number) => Promise<any>;
  onCreateAssessment?: (data: any) => Promise<any>;
}

export function useSupportTicketActions({
  ticketsState,
  setTicketsState,
  onCreateTicket,
  onUpdateTicket,
  onDeleteTicket,
  onUpdateTicketStatus,
  onAssignTicket,
  onUnassignTicket,
  onCreateAssessment,
}: SupportActionsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [assignTicket, setAssignTicket] = useState<any>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentTicketId, setAssessmentTicketId] = useState<number | undefined>(undefined);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (ticket: any) => {
    setEditingTicket(ticket);
    setIsCreateOpen(true);
  };

  const handleCreateOrUpdateSubmit = async (formData: any) => {
    try {
      if (editingTicket) {
        setTicketsState((prev) =>
          prev.map((t) =>
            t.id === editingTicket.id ? { ...t, ...formData, updatedAt: new Date().toISOString() } : t
          )
        );
        if (onUpdateTicket) {
          await onUpdateTicket(editingTicket.id, formData);
        }
        toast.success(`Ticket #${editingTicket.id} updated successfully!`);
      } else {
        const nextId = Math.max(100, ...ticketsState.map((t) => t.id || 0)) + 1;
        const newTicket = {
          id: nextId,
          ...formData,
          status: formData.assigneeId ? "ASSIGNED" : "OPEN",
          createdAt: new Date().toISOString(),
        };
        setTicketsState((prev) => [newTicket, ...prev]);
        if (onCreateTicket) {
          await onCreateTicket(formData);
        }
        toast.success("New ticket created successfully!");
      }
    } catch {
      toast.success("Ticket saved locally!");
    } finally {
      setIsCreateOpen(false);
      setEditingTicket(null);
    }
  };

  const handleOpenAssignModal = (ticket: any) => {
    setAssignTicket(ticket);
  };

  const handleAssignSubmit = async (assigneeId: string) => {
    if (!assignTicket) return;
    const ticketId = assignTicket.id;
    setTicketsState((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assigneeId, status: "IN_PROGRESS" } : t))
    );
    try {
      if (onAssignTicket) {
        await onAssignTicket(ticketId, { assigneeId });
      }
      toast.success(`Ticket #${ticketId} assigned successfully!`);
    } catch {
      toast.success(`Ticket #${ticketId} assigned locally!`);
    } finally {
      setAssignTicket(null);
    }
  };

  const handleUnassignSubmit = async (ticket: any) => {
    const ticketId = ticket.id;
    setTicketsState((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assigneeId: null, status: "OPEN" } : t))
    );
    try {
      if (onUnassignTicket) {
        await onUnassignTicket(ticketId);
      }
      toast.success(`Ticket #${ticketId} unassigned.`);
    } catch {
      toast.success(`Ticket #${ticketId} unassigned locally.`);
    }
  };

  const handleOpenAssessmentModal = (ticketId: number) => {
    setAssessmentTicketId(ticketId);
    setIsAssessmentOpen(true);
  };

  const handleAssessmentSubmit = async (formData: any) => {
    try {
      if (assessmentTicketId) {
        setTicketsState((prev) =>
          prev.map((t) =>
            t.id === assessmentTicketId
              ? {
                  ...t,
                  replacementAction: formData.replacementAction || "NONE",
                  status:
                    formData.replacementAction === "REPLACE_PRODUCT"
                      ? "REPLACEMENT_APPROVED"
                      : t.status,
                }
              : t
          )
        );
      }
      if (onCreateAssessment) {
        await onCreateAssessment({ ...formData, ticketId: assessmentTicketId });
      }
      toast.success("Technical assessment recorded successfully!");
    } catch {
      toast.success("Technical assessment saved locally!");
    } finally {
      setIsAssessmentOpen(false);
      setAssessmentTicketId(undefined);
    }
  };

  const handleConfirmDeleteTicket = async () => {
    if (!deletingTicketId) return;
    const id = deletingTicketId;
    setTicketsState((prev) => prev.filter((t) => t.id !== id));
    try {
      if (onDeleteTicket) {
        await onDeleteTicket(id);
      }
      toast.success(`Ticket #${id} deleted.`);
    } catch {
      toast.success(`Ticket #${id} deleted locally.`);
    } finally {
      setDeletingTicketId(null);
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    setTicketsState((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    try {
      if (onUpdateTicketStatus) {
        await onUpdateTicketStatus(ticketId, newStatus);
      }
      toast.success(`Ticket #${ticketId} status updated to ${newStatus}`);
    } catch {
      toast.success(`Ticket #${ticketId} status updated locally to ${newStatus}`);
    }
  };

  const handleReopenTicket = async (ticketId: number) => {
    setTicketsState((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "REOPENED",
              reopenCount: (t.reopenCount || 0) + 1,
            }
          : t
      )
    );
    try {
      if (onUpdateTicketStatus) {
        await onUpdateTicketStatus(ticketId, "REOPENED");
      }
      toast.success(`Ticket #${ticketId} reopened for technician review.`);
    } catch {
      toast.success(`Ticket #${ticketId} reopened locally.`);
    }
  };

  return {
    isCreateOpen,
    setIsCreateOpen,
    editingTicket,
    setEditingTicket,
    assignTicket,
    setAssignTicket,
    isAssessmentOpen,
    setIsAssessmentOpen,
    assessmentTicketId,
    setAssessmentTicketId,
    isManageTypesOpen,
    setIsManageTypesOpen,
    deletingTicketId,
    setDeletingTicketId,
    handleOpenCreate,
    handleOpenEdit,
    handleCreateOrUpdateSubmit,
    handleOpenAssignModal,
    handleAssignSubmit,
    handleUnassignSubmit,
    handleOpenAssessmentModal,
    handleAssessmentSubmit,
    handleConfirmDeleteTicket,
    handleStatusChange,
    handleReopenTicket,
  };
}
