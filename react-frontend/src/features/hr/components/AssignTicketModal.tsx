import React, { useState, useEffect } from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Select, TextInput, Textarea} from '@/lib/flowbite-compat';
import { UserPlus, PlusSquare, MinusSquare, X } from "lucide-react";
import { format } from "date-fns";

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  users: any[];
  onAssign: (
    ticketId: number,
    payload: { assigneeId: string; assignNote: string; assignedById: string },
  ) => void;
  onUnassign: (ticketId: number, assigneeId?: string) => void;
  currentUserId: string; // usually an employee ID or username
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
    onAssign(ticket.id, {
      assigneeId: selectedAgent,
      assignNote: note,
      assignedById: currentUserId,
    });
  };

  const handleUnassign = (assigneeId: string) => {
    onUnassign(ticket.id, assigneeId);
  };

  if (!ticket) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="6xl">
      <div className="bg-gray-100 dark:bg-gray-800 border-b p-4 flex w-full justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold text-xl">
          <UserPlus size={22} className="text-blue-600" />
          Assign Ticket to User
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
            <X size={20} />
        </button>
      </div>
      <ModalBody className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-6 h-[65vh] min-h-[450px]">
          {/* LEFT SIDE: Assign Form & Details */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Assign Form */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-blue-500" /> Assignment
                Details
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Ticket No.
                    </label>
                    <TextInput
                      sizing="sm"
                      value={String(ticket.id).padStart(5, "0")}
                      readOnly
                      className="font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="h-[34px] flex items-center px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold text-xs rounded-md border-blue-100 dark:border-blue-800">
                      {ticket.status}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Assign To User
                  </label>
                  <Select
                    sizing="sm"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="">Select User...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Note (Optional)
                  </label>
                  <TextInput
                    sizing="sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for the user..."
                  />
                </div>
              </div>
            </div>

            {/* Assigned Details */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                  Current Assignment(s)
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {ticket.assignees && ticket.assignees.length > 0 ? (
                  ticket.assignees.map((assignee: any) => (
                    <div
                      key={assignee.id}
                      className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                            User
                          </p>
                          <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                            {assignee.firstName} {assignee.lastName}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnassign(assignee.id)}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 px-2 py-1 rounded-md flex items-center transition-colors"
                        >
                          <MinusSquare size={10} className="mr-1" /> Unassign
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                            Assigned Date
                          </p>
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                            {ticket.assignedDate
                              ? format(
                                  new Date(ticket.assignedDate),
                                  "MMM dd, yyyy",
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                            Assigned By
                          </p>
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                            {ticket.assignedBy
                              ? `${ticket.assignedBy.firstName} ${ticket.assignedBy.lastName}`
                              : "System"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                            Note
                          </p>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 italic">
                            {ticket.assignNote || "No notes provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded-md min-h-[150px]">
                    <UserPlus size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No users assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Ticket Overview */}
          <div className="w-1/2 bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-5 pb-3 border-b">
              Ticket Overview
            </h4>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
                    Ticket Number
                  </p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                    #{String(ticket.id).padStart(5, "0")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
                    Date Created
                  </p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {format(
                      new Date(ticket.createdAt || new Date()),
                      "MMM dd, yyyy",
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">
                    Category
                  </p>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-bold">
                    {ticket.category || "Question"}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">
                    Priority
                  </p>
                  <span
                    className={`px-3 py-1.5 rounded-md text-xs font-bold ${ticket.priority ==="Level 1"|| ticket.priority ==="Urgent"?"bg-red-50 text-red-600 border-red-100": ticket.priority ==="Level 2"|| ticket.priority ==="Important"?"bg-yellow-50 text-yellow-600 border-yellow-100":"bg-green-50 text-green-600 border-green-100"}`}
                  >
                    {ticket.priority || "Normal"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wider">
                  Requester Details
                </p>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        Name
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {ticket.reporter
                          ? `${ticket.reporter.firstName} ${ticket.reporter.lastName}`
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        Department
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {ticket.reporter?.department?.name || "ChildSafe"}
                      </span>
                    </div>
                    <div className="flex flex-col col-span-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        Phone
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {ticket.reporter?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">
                  Subject
                </p>
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                  {ticket.title}
                </p>
              </div>

              <div className="flex-1 flex flex-col min-h-[150px]">
                <p className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">
                  Issue Description
                </p>
                <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md text-sm text-gray-700 dark:text-gray-300 leading-relaxed overflow-y-auto font-medium">
                  {ticket.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex justify-end gap-3 bg-gray-100 dark:bg-gray-800 p-4 border-t rounded-b-lg">
        <Button color="gray" onClick={onClose} className="h-12">
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleAssign}
          disabled={!selectedAgent}
          className="h-12"
        >
          <PlusSquare size={16} className="mr-2" /> Assign Ticket
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignTicketModal;
