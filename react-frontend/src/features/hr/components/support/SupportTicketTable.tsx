import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Progress } from "@/lib/flowbite-compat";
import { format } from "date-fns";
import { UserPlus, FileText, Trash2, Edit, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, CheckCircle2 } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface SupportTicketTableProps {
  tickets: any[];
  users: any[];
  onOpenAssignModal: (ticket: any) => void;
  onOpenAssessmentModal: (ticketId?: number) => void;
  onOpenEditTicketModal: (ticket: any) => void;
  onDeleteTicketConfirm: (id: number) => void;
}

export const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  tickets,
  users,
  onOpenAssignModal,
  onOpenAssessmentModal,
  onOpenEditTicketModal,
  onDeleteTicketConfirm,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getTaskStageInfo = (status: string, replacementAction?: string) => {
    if (replacementAction === "REPLACE_PRODUCT") {
      return { stage: "Replacement Pending", progress: 80, color: "purple" as const };
    }
    switch (status) {
      case "OPEN":
        return { stage: "Triage & Logged", progress: 20, color: "blue" as const };
      case "IN_PROGRESS":
        return { stage: "Servicing & Diagnosis", progress: 50, color: "yellow" as const };
      case "REPLACEMENT_APPROVED":
        return { stage: "Replacement Approved", progress: 85, color: "indigo" as const };
      case "RESOLVED":
      case "CLOSED":
        return { stage: "Closed & Verified", progress: 100, color: "green" as const };
      default:
        return { stage: "Submitted", progress: 10, color: "blue" as const };
    }
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
                    <TableCell className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                          #TICK-{ticket.id}
                        </span>
                        <span className="text-sm font-black dark:text-white block mt-0.5">
                          {ticket.subject || ticket.title || "Support Request"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-6">
                      <Badge color="gray" size="xs" className="font-bold">
                        {ticket.type?.name || ticket.category || ticket.taskType || "General IT"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 px-6">
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

                    <TableCell className="py-4 px-6">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
                          <span>{stageInfo.stage}</span>
                          <span>{stageInfo.progress}%</span>
                        </div>
                        <Progress progress={stageInfo.progress} size="xs" color={stageInfo.color} />
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-6">
                      <Badge color={ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? "success" : "warning"} size="xs" className="font-black uppercase">
                        {ticket.status || "OPEN"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-200">
                      {assignedUser ? assignedUser.userName || assignedUser.firstName : "Unassigned"}
                    </TableCell>

                    <TableCell className="py-4 px-6 text-xs font-medium text-gray-500 font-mono">
                      {ticket.createdAt ? format(new Date(ticket.createdAt), "yyyy-MM-dd HH:mm") : "N/A"}
                    </TableCell>

                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenAssignModal(ticket)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors cursor-pointer"
                          title="Assign Ticket"
                        >
                          <UserPlus size={14} />
                        </button>
                        <button
                          onClick={() => onOpenAssessmentModal(ticket.id)}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors cursor-pointer"
                          title="Technical Assessment & Product Replacement Request"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() => onOpenEditTicketModal(ticket)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors cursor-pointer"
                          title="Edit Ticket"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteTicketConfirm(ticket.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors cursor-pointer"
                          title="Delete Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
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
      )}
    </div>
  );
};

export default SupportTicketTable;
