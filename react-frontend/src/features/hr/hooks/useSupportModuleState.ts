import { useState, useEffect, useMemo } from "react";
import { useSupportModulePermissions } from "./support/useSupportModulePermissions";
import { useSupportTicketsFilter } from "./support/useSupportTicketsFilter";
import { useSupportAnalyticsState } from "./support/useSupportAnalyticsState";
import { useSupportTicketActions } from "./support/useSupportTicketActions";

export { COLORS } from "./support/useSupportAnalyticsState";

export function useSupportModuleState(props: any) {
  const {
    tickets = [],
    ticketTypes = [],
    users = [],
    employees = [],
    assessments = [],
    currentUserId = "admin",
    onCreateTicket,
    onUpdateTicket,
    onDeleteTicket,
    onUpdateTicketStatus,
    onAssignTicket,
    onUnassignTicket,
    onCreateTicketType,
    onDeleteTicketType,
    onCreateAssessment,
  } = props;

  const permissions = useSupportModulePermissions();

  const [activeSubTab, setActiveSubTab] = useState<"TICKETS" | "PIE_ANALYTICS" | "EVALUATION" | "ALL">(
    "TICKETS"
  );

  const [ticketsState, setTicketsState] = useState<any[]>([]);

  const initialMockTickets = useMemo(
    () => [
      {
        id: 101,
        subject: "Core Network Switch Offline - Server Room B",
        category: "IT Support",
        taskType: "Network & Hardware",
        department: "IT",
        priority: "HIGH",
        status: "IN_PROGRESS",
        assigneeId: "1",
        createdAt: new Date().toISOString(),
        replacementAction: "NONE",
      },
      {
        id: 102,
        subject: "AC Unit Temperature Fault - Clinic Room 4",
        category: "Maintenance",
        taskType: "Facilities & HVAC",
        department: "MAINTENANCE",
        priority: "URGENT",
        status: "OPEN",
        assigneeId: null,
        createdAt: new Date().toISOString(),
        replacementAction: "REPLACE_PRODUCT",
      },
      {
        id: 103,
        subject: "Community Outreach Vehicle Inspection & Fuel Card",
        category: "Outreach",
        taskType: "Field Logistics",
        department: "OUTREACH",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        assigneeId: "2",
        createdAt: new Date().toISOString(),
        replacementAction: "NONE",
      },
      {
        id: 104,
        subject: "Biometric Scanner Sensor Calibration Failure",
        category: "IT Support",
        taskType: "Hardware Repair",
        department: "IT",
        priority: "HIGH",
        status: "REPLACEMENT_APPROVED",
        assigneeId: "1",
        createdAt: new Date().toISOString(),
        replacementAction: "REPLACE_PRODUCT",
      },
      {
        id: 105,
        subject: "Staff Onboarding Laptop Provisioning - HR",
        category: "IT Support",
        taskType: "Software & Account",
        department: "HR",
        priority: "NORMAL",
        status: "RESOLVED",
        assigneeId: "3",
        createdAt: new Date().toISOString(),
        replacementAction: "NONE",
      },
      {
        id: 106,
        subject: "New Staff Email & Access Credentials Creation",
        category: "HR Support",
        taskType: "Software & Account",
        department: "HR",
        priority: "NORMAL",
        status: "OPEN",
        assigneeId: null,
        createdAt: new Date().toISOString(),
        replacementAction: "NONE",
      },
    ],
    []
  );

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      setTicketsState(tickets);
    } else {
      setTicketsState(initialMockTickets);
    }
  }, [tickets, initialMockTickets]);

  const defaultTickets = useMemo(() => {
    const rawTickets = ticketsState.length > 0 ? ticketsState : initialMockTickets;
    return rawTickets.map((t) => {
      const isUnassigned =
        !t.assigneeId || t.assigneeId === "" || String(t.assigneeId).toLowerCase() === "unassigned";
      if (isUnassigned && (t.status === "CLOSED" || t.status === "RESOLVED")) {
        return { ...t, status: "OPEN" };
      }
      return t;
    });
  }, [ticketsState, initialMockTickets]);

  const filterState = useSupportTicketsFilter(defaultTickets);
  const analyticsState = useSupportAnalyticsState(defaultTickets, users);
  const actions = useSupportTicketActions({
    ticketsState,
    setTicketsState,
    onCreateTicket,
    onUpdateTicket,
    onDeleteTicket,
    onUpdateTicketStatus,
    onAssignTicket,
    onUnassignTicket,
    onCreateAssessment,
  });

  return {
    ...permissions,
    ...filterState,
    ...analyticsState,
    ...actions,
    activeSubTab,
    setActiveSubTab,
    ticketTypes,
    users,
    employees,
    assessments,
    currentUserId,
    onCreateTicketType,
    onDeleteTicketType,
  };
}
