import React, { useState } from "react";
import { Button, TextInput, Select, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { HelpCircle, Search, Plus, UserPlus, FileText } from "lucide-react";

import TicketCreationModal from "./TicketCreationModal";
import AssignTicketModal from "./AssignTicketModal";
import AssessmentFormModal from "./AssessmentFormModal";

interface SupportModuleProps {
  tickets?: any[];
  users?: any[];
  assessments?: any[];
  currentUserId?: string;
  onCreateTicket?: (data: any) => Promise<any>;
  onUpdateTicket?: (id: number, data: any) => Promise<any>;
  onAssignTicket?: (ticketId: number, payload: any) => Promise<any>;
  onUnassignTicket?: (ticketId: number, assigneeId?: string) => Promise<any>;
  onCreateAssessment?: (data: any) => Promise<any>;
  onUpdateAssessment?: (id: number, data: any) => Promise<any>;
  onDeleteAssessment?: (id: number) => Promise<any>;
  [key: string]: any;
}

const SupportModule: React.FC<SupportModuleProps> = ({
  tickets = [],
  users = [],
  assessments = [],
  currentUserId = "admin",
  onCreateTicket,
  onAssignTicket,
  onUnassignTicket,
  onCreateAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
}) => {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [assignTicket, setAssignTicket] = useState<any>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const filtered = tickets.filter((t) =>
    (t.subject || t.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <HelpCircle size={18} className="text-blue-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">IT Support & Helpdesk Tickets</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
          <Button color="indigo" size="xs" onClick={() => setIsAssessmentOpen(true)} className="font-black uppercase text-[10px] rounded-lg">
            <FileText size={14} className="mr-1" /> Assessment Forms
          </Button>
          <Button color="blue" size="xs" onClick={() => setIsCreateOpen(true)} className="font-black uppercase text-[10px] rounded-lg">
            <Plus size={14} className="mr-1" /> New Support Ticket
          </Button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Ticket ID</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Subject</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Category</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Priority</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-xs font-bold text-gray-400 uppercase">
                  No support tickets found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t, idx) => (
                <TableRow key={t.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-mono font-bold text-xs text-blue-600">#{String(t.id).padStart(5, "0")}</TableCell>
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{t.subject || t.title}</TableCell>
                  <TableCell className="px-4 py-3 text-xs">{t.ticketType || "General"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold">{t.priority || "Level 2"}</TableCell>
                  <TableCell className="px-4 py-3"><Badge color="info" className="text-[8px] uppercase">{t.status || "New Ticket"}</Badge></TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button size="xs" color="light" onClick={() => setAssignTicket(t)} className="text-[9px] font-black uppercase">
                      <UserPlus size={12} className="mr-1 text-blue-600" /> Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <TicketCreationModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={onCreateTicket || (async () => {})} users={users} />
      <AssignTicketModal isOpen={!!assignTicket} onClose={() => setAssignTicket(null)} ticket={assignTicket} users={users} onAssign={onAssignTicket || (async () => {})} onUnassign={onUnassignTicket || (() => {})} currentUserId={currentUserId} />
      <AssessmentFormModal isOpen={isAssessmentOpen} onClose={() => setIsAssessmentOpen(false)} tickets={tickets} assessments={assessments} onCreateAssessment={onCreateAssessment || (async () => {})} onUpdateAssessment={onUpdateAssessment || (async () => {})} onDeleteAssessment={onDeleteAssessment || (async () => {})} />
    </div>
  );
};

export default SupportModule;
