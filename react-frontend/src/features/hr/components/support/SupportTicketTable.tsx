import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Progress } from "@/lib/flowbite-compat";
import { format } from "date-fns";
import { UserPlus, FileText, Trash2, Edit, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, CheckCircle2, PauseCircle, Clock, RotateCcw, CheckCircle, Laptop, Wrench, Globe, Stethoscope, Tag, Building2, Server } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

import { toast } from "react-hot-toast";

interface SupportTicketTableProps {
  tickets: any[];
  users: any[];
  userRoles?: string[];
  currentUserId?: string;
  onOpenAssignModal: (ticket: any) => void;
  onOpenAssessmentModal: (ticketId?: number) => void;
  onOpenEditTicketModal: (ticket: any) => void;
  onDeleteTicketConfirm: (id: number) => void;
  onUpdateTicketStatus?: (id: number, status: string, note?: string) => void;
}

export const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  tickets,
  users,
  userRoles = [],
  currentUserId = "",
  onOpenAssignModal,
  onOpenAssessmentModal,
  onOpenEditTicketModal,
  onDeleteTicketConfirm,
  onUpdateTicketStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Permission evaluation
  const roles = userRoles.length > 0 ? userRoles : ["ROLE_ADMIN"];
  const isAdmin = roles.some((r) => r.toUpperCase().includes("ADMIN") || r.toUpperCase().includes("SUPERADMIN"));
  const isManager = roles.some((r) => r.toUpperCase().includes("MANAGER"));
  const isTechnician = roles.some((r) => r.toUpperCase().includes("IT") || r.toUpperCase().includes("MAINTENANCE") || r.toUpperCase().includes("TECH"));

  const canAssign = isAdmin || isManager || isTechnician;
  const canAssess = isAdmin || isTechnician;
  const canDelete = isAdmin;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getCategoryIconAvatar = (category?: string, taskType?: string) => {
    const text = (category || taskType || "").toUpperCase();
    if (text.includes("IT") || text.includes("SOFTWARE") || text.includes("ACCOUNT") || text.includes("EMAIL") || text.includes("TELEGRAM")) {
      return <Laptop size={16} className="text-blue-600 dark:text-blue-300" />;
    }
    if (text.includes("NETWORK") || text.includes("INTERNET") || text.includes("SWITCH") || text.includes("HARDWARE") || text.includes("ERROR")) {
      return <Server size={16} className="text-indigo-600 dark:text-indigo-300" />;
    }
    if (text.includes("MAINT") || text.includes("HVAC") || text.includes("FACILIT")) {
      return <Wrench size={16} className="text-amber-600 dark:text-amber-300" />;
    }
    if (text.includes("OUTREACH") || text.includes("FIELD") || text.includes("VEHICLE")) {
      return <Globe size={16} className="text-purple-600 dark:text-purple-300" />;
    }
    if (text.includes("CLINIC") || text.includes("MEDICAL") || text.includes("HEALTH")) {
      return <Stethoscope size={16} className="text-rose-600 dark:text-rose-300" />;
    }
    return <Building2 size={16} className="text-emerald-600 dark:text-emerald-300" />;
  };

  const getTaskStageInfo = (status: string, replacementAction?: string) => {
    if (replacementAction === "REPLACE_PRODUCT") {
      return { stage: "Replacement Pending", progress: 80, color: "purple" as const };
    }
    switch (status) {
      case "OPEN":
        return { stage: "Triage & Logged", progress: 15, color: "blue" as const };
      case "ASSIGNED":
        return { stage: "Assigned to Tech", progress: 35, color: "cyan" as const };
      case "IN_PROGRESS":
        return { stage: "Servicing & Repair", progress: 55, color: "yellow" as const };
      case "SUSPENDED":
        return { stage: "Suspended (Vendor/Part)", progress: 40, color: "red" as const };
      case "ON_HOLD":
        return { stage: "On Hold (Pending Request)", progress: 30, color: "gray" as const };
      case "REPLACEMENT_APPROVED":
        return { stage: "Replacement Approved", progress: 85, color: "indigo" as const };
      case "RESOLVED":
        return { stage: "48H Verification Window", progress: 90, color: "emerald" as const };
      case "REOPENED":
        return { stage: "Re-opened (Fix Failed)", progress: 45, color: "purple" as const };
      case "CLOSED":
        return { stage: "Closed & Verified", progress: 100, color: "green" as const };
      default:
        return { stage: "Submitted", progress: 10, color: "blue" as const };
    }
  };

  const get48HWindowInfo = (resolvedAt?: string) => {
    if (!resolvedAt) return { hoursLeft: 48, isExpired: false, label: "48h left" };
    const resolvedTime = new Date(resolvedAt).getTime();
    const diffMs = Date.now() - resolvedTime;
    const remainingMs = 48 * 3600 * 1000 - diffMs;
    if (remainingMs <= 0) return { hoursLeft: 0, isExpired: true, label: "Verification Complete" };
    const hoursLeft = Math.ceil(remainingMs / (3600 * 1000));
    return { hoursLeft, isExpired: false, label: `${hoursLeft}h verification left` };
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";
      if (sortField === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortField === "category") {
        aVal = a.type?.name || a.category || "";
        bVal = b.type?.name || b.category || "";
      } else if (sortField === "priority") {
        aVal = a.priority || "";
        bVal = b.priority || "";
      } else if (sortField === "status") {
        aVal = a.status || "";
        bVal = b.status || "";
      } else if (sortField === "createdAt") {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const res = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? res : -res;
    });
  }, [tickets, sortField, sortDirection]);

  const totalItems = sortedTickets.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 select-none">
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center gap-1.5">
                <span>Ticket ID & Subject</span>
                {sortField === "id" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center gap-1.5">
                <span>Category / Task Type</span>
                {sortField === "category" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("priority")}
            >
              <div className="flex items-center gap-1.5">
                <span>Priority</span>
                {sortField === "priority" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Task Process Tracker
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                {sortField === "status" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Assignee
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center gap-1.5">
                <span>Created Date</span>
                {sortField === "createdAt" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {totalItems === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center text-xs font-bold text-gray-400">
                  No support tickets match the current filter criteria
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((ticket) => {
                const assignedUser = users.find(
                  (u) =>
                    u.id?.toString() === ticket.assigneeId?.toString() ||
                    u.userName === ticket.assigneeId
                );

                const stageInfo = getTaskStageInfo(ticket.status, ticket.replacementAction);

                return (
                  <TableRow key={ticket.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors group">
                    <TableCell className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-start gap-3 max-w-[340px]">
                        {/* Responsive Category Icon Avatar Node (Replaces Duplicate ID Number) */}
                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700/80 border border-gray-200/80 dark:border-gray-600/60 flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-105 transition-transform">
                          {getCategoryIconAvatar(ticket.category || ticket.type?.name, ticket.taskType || ticket.subject)}
                        </div>

                        <div className="space-y-1 overflow-hidden">
                          {/* Monospace Code Badge & Department Breadcrumb */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/50 tracking-wider">
                              #TICK-{String(ticket.id).padStart(3, "0")}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 font-mono">
                              {ticket.department || ticket.category || "General"}
                            </span>
                          </div>

                          {/* Responsive Subject Title with Native Hover Tooltip & Line-Clamp */}
                          <span
                            title={ticket.subject || ticket.title || "Support Request"}
                            className="text-xs sm:text-sm font-extrabold dark:text-white block hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug line-clamp-1 sm:line-clamp-2 cursor-pointer"
                          >
                            {ticket.subject || ticket.title || "Support Request"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <Badge color="gray" size="xs" className="font-bold">
                        {ticket.type?.name || ticket.category || ticket.taskType || "General IT"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <Badge
                        color={
                          ticket.priority === "HIGH" || ticket.priority === "URGENT"
                            ? "failure"
                            : ticket.priority === "MEDIUM"
                            ? "warning"
                            : "info"
                        }
                        size="xs"
                        className="font-black uppercase tracking-wider"
                      >
                        {ticket.priority || "NORMAL"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
                          <span>{stageInfo.stage}</span>
                          <span>{stageInfo.progress}%</span>
                        </div>
                        <Progress progress={stageInfo.progress} size="xs" color={stageInfo.color} />
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <div className="space-y-1">
                        <Badge
                          color={
                            ticket.status === "CLOSED"
                              ? "success"
                              : ticket.status === "RESOLVED"
                              ? "emerald"
                              : ticket.status === "SUSPENDED"
                              ? "failure"
                              : ticket.status === "ON_HOLD"
                              ? "gray"
                              : ticket.status === "REOPENED"
                              ? "purple"
                              : "warning"
                          }
                          size="xs"
                          className="font-black uppercase tracking-wider inline-flex items-center gap-1"
                        >
                          {ticket.status === "SUSPENDED" && <PauseCircle size={10} />}
                          {ticket.status === "ON_HOLD" && <Clock size={10} />}
                          {ticket.status === "REOPENED" && <RotateCcw size={10} />}
                          {ticket.status === "CLOSED" && <CheckCircle size={10} />}
                          {ticket.status === "RESOLVED" && <CheckCircle2 size={10} />}
                          <span>{ticket.status || "OPEN"}</span>
                        </Badge>

                        {ticket.status === "RESOLVED" && (
                          <div className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                            <Clock size={10} className="animate-spin" />
                            <span>{get48HWindowInfo(ticket.resolvedAt).label}</span>
                          </div>
                        )}
                        {ticket.reopenCount && ticket.reopenCount > 0 && (
                          <span className="text-[9px] font-extrabold text-purple-600 dark:text-purple-400 block font-mono">
                            Re-opened x{ticket.reopenCount}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-xs font-bold text-gray-700 dark:text-gray-200">
                      {assignedUser ? assignedUser.userName || assignedUser.firstName : "Unassigned"}
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-xs font-medium text-gray-500 font-mono">
                      {ticket.createdAt ? format(new Date(ticket.createdAt), "yyyy-MM-dd HH:mm") : "N/A"}
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 p-1 bg-gray-50/90 dark:bg-gray-800/90 rounded-xl border border-gray-100 dark:border-gray-700/80 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                        {canAssign && (
                          <button
                            onClick={() => onOpenAssignModal(ticket)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                            title="Assign Ticket to Technician"
                          >
                            <UserPlus size={14} />
                          </button>
                        )}
                        {canAssess && (
                          <button
                            onClick={() => onOpenAssessmentModal(ticket.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                            title="Technical Assessment & Product Replacement"
                          >
                            <FileText size={14} />
                          </button>
                        )}
                        {onUpdateTicketStatus && canAssign && (
                          <>
                            {ticket.status !== "SUSPENDED" && ticket.status !== "CLOSED" && (
                              <button
                                onClick={() => onUpdateTicketStatus(ticket.id, "SUSPENDED")}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                title="Suspend Ticket (Vendor/Part Delay)"
                              >
                                <PauseCircle size={14} />
                              </button>
                            )}
                            {ticket.status !== "ON_HOLD" && ticket.status !== "CLOSED" && (
                              <button
                                onClick={() => onUpdateTicketStatus(ticket.id, "ON_HOLD")}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                title="Put Ticket On Hold"
                              >
                                <Clock size={14} />
                              </button>
                            )}
                            {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                              <button
                                onClick={() => {
                                  const isUnassigned = !ticket.assigneeId || ticket.assigneeId === "" || String(ticket.assigneeId).toLowerCase() === "unassigned";
                                  if (isUnassigned) {
                                    toast.error("Ticket must be assigned to a technician staff member before it can be completed or closed.");
                                    onOpenAssignModal(ticket);
                                    return;
                                  }
                                  onUpdateTicketStatus(ticket.id, "RESOLVED");
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                title="Complete Ticket & Start 48H Window"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                            {(ticket.status === "RESOLVED" || ticket.status === "CLOSED" || ticket.status === "IN_PROGRESS") && (
                              <button
                                onClick={() => onUpdateTicketStatus(ticket.id, "REOPENED")}
                                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                title="Re-open Ticket (Fix Failed within 48 Hours)"
                              >
                                <RotateCcw size={14} />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => onOpenEditTicketModal(ticket)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                          title="Edit Ticket Details"
                        >
                          <Edit size={14} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => onDeleteTicketConfirm(ticket.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                            title="Delete Ticket (Admin Only)"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default SupportTicketTable;
