import React from "react";
import { X } from "lucide-react";
import {
  Button,
  Modal,
  ModalBody,
  Label,
  TextInput,
  Select,
  Textarea,
} from "@/lib/flowbite-compat";

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: {
    clientId: string;
    subject: string;
    description: string;
    priority: string;
    serviceType: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  clients: any[];
  onSubmit: (e: React.FormEvent) => void;
}

export const CaseFormModal: React.FC<CaseFormModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  clients,
  onSubmit,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <span className="text-lg font-bold dark:text-white">
          {isEditMode ? "Edit Case Detail" : "Open New Case"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
          <X size={20} />
        </button>
      </div>
      <ModalBody className="p-6 bg-white dark:bg-gray-800">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="mb-1 block">Client</Label>
            <Select
              required
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
            >
              <option value="">Select client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label className="mb-1 block">Subject</Label>
            <TextInput
              required
              placeholder="Case subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Priority</Label>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option>Normal</option>
                <option>High</option>
                <option>Low</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Service</Label>
              <Select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
              >
                <option>Job Placement</option>
                <option>Social Support</option>
                <option>Education</option>
                <option>Medical</option>
                <option>Technical Support</option>
                <option>Counseling</option>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-1 block">Description</Label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 mt-6">
            <Button
              outline
              color="gray"
              size="sm"
              className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              size="sm"
              type="submit"
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-4 shadow-lg shadow-blue-500/20"
            >
              {isEditMode ? "Update" : "Open Case"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default CaseFormModal;
