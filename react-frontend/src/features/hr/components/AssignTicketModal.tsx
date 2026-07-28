import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Button, Select, TextInput, Textarea } from '@/lib/flowbite-compat';
import { UserPlus, PlusSquare, MinusSquare, X } from "lucide-react";
import { format } from "date-fns";

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  users: any[];
  onAssign: (ticketId: number, payload: { assigneeId: string; assignNote: string; assignedById: string }) => void;
  onUnassign: (ticketId: number, assigneeId?: string) => void;
  currentUserId: string;
}

const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  users,
  onAssign,
  onUnassign,
  currentUserId,
}) => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen && ticket) {
      setSelectedAgent("");
      setNote("");
    }
  }, [isOpen, ticket]);

  const handleAssign = () => {
    if (!selectedAgent) return;
    onAssign(ticket.id, { assigneeId: selectedAgent, assignNote: note, assignedById: currentUserId });
  };

  if (!ticket) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <div className="bg-gray-100 dark:bg-gray-800 border-b p-4 flex w-full justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold text-lg">
          <UserPlus size={20} className="text-blue-600" /> Assign Support Ticket
        </div>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200"><X size={18} /></button>
      </div>

      <ModalBody className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Assign Form */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserPlus size={16} className="text-blue-500" /> Assignment Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Ticket ID</label>
                <TextInput sizing="sm" value={`#${String(ticket.id).padStart(5, "0")}`} readOnly />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Status</label>
                <div className="h-9 flex items-center px-3 bg-blue-50 text-blue-600 font-bold text-xs rounded-md">{ticket.status}</div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Assign To Agent</label>
              <Select sizing="sm" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                <option value="">-- Select Agent --</option>
                {users.map((u) => (
                  <option key={u.id || u.username} value={u.id || u.username}>
                    {u.firstName ? `${u.firstName} ${u.lastName}` : u.username} ({u.role || "Agent"})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Internal Note</label>
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason or instructions for assignee..." />
            </div>
          </div>

          {/* Right Side: Current Assignees List */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Assigned Team Members</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {ticket.assignees && ticket.assignees.length > 0 ? (
                ticket.assignees.map((a: any) => (
                  <div key={a.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border text-xs">
                    <div>
                      <p className="font-bold dark:text-white">{a.assigneeName || a.assigneeId}</p>
                      <p className="text-[9px] text-gray-400">Assigned: {a.assignedAt ? format(new Date(a.assignedAt), "MMM dd, yyyy") : "N/A"}</p>
                    </div>
                    <Button size="xs" color="failure" onClick={() => onUnassign(ticket.id, a.assigneeId)}>
                      <MinusSquare size={14} className="mr-1" /> Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-6 text-center italic">No agents assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="bg-gray-100 dark:bg-gray-800">
        <Button color="gray" onClick={onClose} className="px-6 h-10">Cancel</Button>
        <Button color="blue" onClick={handleAssign} disabled={!selectedAgent} className="px-6 h-10">
          <PlusSquare size={16} className="mr-2" /> Confirm Assignment
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignTicketModal;
