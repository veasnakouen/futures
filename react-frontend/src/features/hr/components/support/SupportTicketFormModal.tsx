import React from "react";
import { Modal, Label, TextInput, Select, Textarea } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

interface SupportTicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isViewMode: boolean;
  isEditMode: boolean;
  formData: {
    title: string;
    description: string;
    priority: string;
    category: string;
    status: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function SupportTicketFormModal({
  isOpen,
  onClose,
  isViewMode,
  isEditMode,
  formData,
  setFormData,
  handleSubmit,
}: SupportTicketFormModalProps) {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <CustomModalHeader
        title={
          isViewMode
            ? "Ticket Details"
            : isEditMode
            ? "Edit Support Ticket"
            : "New Support Ticket"
        }
        subtitle="Support Center"
        onClose={onClose}
      />
      <div className="p-6 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-1 block">Issue Title</Label>
            <TextInput
              required
              placeholder="e.g. Cannot access email"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isViewMode}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Category</Label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                disabled={isViewMode}
              >
                <option>IT</option>
                <option>Facilities</option>
                <option>Human Resources</option>
                <option>General</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Priority</Label>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                disabled={isViewMode}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-1 block">Description</Label>
            <Textarea
              required
              rows={4}
              placeholder="Provide more details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isViewMode}
            />
          </div>
          <div className="pt-4">
            <CustomModalFooter
              onClose={onClose}
              isEditMode={isEditMode}
              submitText={isEditMode ? "Update Ticket" : "Create Ticket"}
              cancelText={isViewMode ? "Close" : "Cancel"}
              hideSubmit={isViewMode}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
