import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  TextInput,
} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Tag, Plus, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ManageTicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketTypes: any[];
  onCreateTicketType: (name: string) => Promise<void>;
  onDeleteTicketType: (id: number) => Promise<void>;
}

const ManageTicketTypeModal: React.FC<ManageTicketTypeModalProps> = ({
  isOpen,
  onClose,
  ticketTypes,
  onCreateTicketType,
  onDeleteTicketType,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!newType.trim()) return;
    setLoading(true);
    try {
      await onCreateTicketType(newType);
      setNewType("");
      setIsAdding(false);
      toast.success("Ticket type added");
    } catch (err) {
      toast.error("Failed to add ticket type");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Are you sure you want to remove this ticket type?")) return;
    try {
      await onDeleteTicketType(id);
      toast.success("Ticket type removed");
    } catch (err) {
      toast.error("Failed to remove ticket type");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader
        title="Manage Issue Type"
        subtitle="Settings"
        onClose={onClose}
      />
      <ModalBody className="p-0 dark:bg-gray-800 bg-gray-50/30">
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              color="light"
              onClick={() => setIsAdding(true)}
              className="font-bold text-xs"
            >
              <Plus size={14} className="mr-2" /> Add New
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md overflow-hidden h-[400px] overflow-y-auto">
            <Table hoverable>
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="py-3 text-xs font-black uppercase text-gray-500">
                  Ticket Type
                </TableHeadCell>
                <TableHeadCell className="py-3 text-xs font-black uppercase text-gray-500 w-24 text-right">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {isAdding && (
                  <TableRow className="bg-blue-50/50 dark:bg-blue-900/20">
                    <TableCell className="py-2">
                      <TextInput
                        sizing="sm"
                        autoFocus
                        placeholder="Enter type name..."
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                      />
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="xs"
                          color="success"
                          disabled={loading}
                          onClick={handleSave}
                          className="px-1 h-12"
                        >
                          <Check size={14} />
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => {
                            setIsAdding(false);
                            setNewType("");
                          }}
                          className="px-1"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {ticketTypes?.map((type, i) => (
                  <TableRow
                    key={type.id || i}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell className="py-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                      {type.name}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Button
                        size="xs"
                        color="failure"
                        outline
                        onClick={() => handleRemove(type.id)}
                        className="ml-auto p-1 h-7 w-7 rounded-md"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {ticketTypes?.length === 0 && !isAdding && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-8 text-gray-400 font-medium text-sm"
                    >
                      No ticket types found. Add one above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ManageTicketTypeModal;
