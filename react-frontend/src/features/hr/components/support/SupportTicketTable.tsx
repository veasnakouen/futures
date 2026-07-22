import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Button } from "@/lib/flowbite-compat";
import { format } from "date-fns";
import { UserPlus, FileText, Trash2, Edit } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Ticket ID & Subject
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Category
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Priority
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Status
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Assignee
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Created Date
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-xs font-bold text-gray-400">
                  No support tickets match the current filter criteria
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const assignedUser = users.find(
                  (u) =>
                    u.id?.toString() === ticket.assigneeId?.toString() ||
                    u.userName === ticket.assigneeId
                );

                return (
                  <TableRow key={ticket.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors group">
                    <TableCell className="py-4 font-bold text-gray-900 dark:text-white">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                          #TICK-{ticket.id}
                        </span>
                        <span className="text-sm font-black dark:text-white block mt-0.5">
                          {ticket.subject || ticket.title || "Support Request"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge color="gray" size="xs" className="font-bold">
                        {ticket.type?.name || ticket.category || "General"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
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

                    <TableCell className="py-4">
                      <Badge
                        color={
                          ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                            ? "success"
                            : ticket.status === "IN_PROGRESS"
                            ? "warning"
                            : "indigo"
                        }
                        size="xs"
                        className="font-black uppercase tracking-wider"
                      >
                        {ticket.status || "OPEN"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 font-bold text-xs text-gray-700 dark:text-gray-200">
                      {assignedUser ? assignedUser.userName || assignedUser.firstName : "Unassigned"}
                    </TableCell>

                    <TableCell className="py-4 text-xs font-medium text-gray-500 font-mono">
                      {ticket.createdAt ? format(new Date(ticket.createdAt), "yyyy-MM-dd HH:mm") : "N/A"}
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenAssignModal(ticket)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                          title="Assign Ticket"
                        >
                          <UserPlus size={14} />
                        </button>
                        <button
                          onClick={() => onOpenAssessmentModal(ticket.id)}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
                          title="Technical Assessment"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() => onOpenEditTicketModal(ticket)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors"
                          title="Edit Ticket"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteTicketConfirm(ticket.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
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
    </div>
  );
};

export default SupportTicketTable;
