import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Button, TextInput, Textarea, Select } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AssessmentPreviewModal from "./AssessmentPreviewModal";
import ConfirmModal from "./ConfirmModal";
import AssessmentItemTable from "./assessment/AssessmentItemTable";
import AssessmentRecordList from "./assessment/AssessmentRecordList";

interface AssessmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: any[];
  assessments: any[];
  onCreateAssessment: (data: any) => Promise<void>;
  onUpdateAssessment: (id: number, data: any) => Promise<void>;
  onDeleteAssessment: (id: number) => Promise<void>;
  initialTicketId?: number | null;
}

const initialFormState = {
  brand: "",
  model: "",
  itemCode: "",
  subject: "",
  issueDescription: "",
  replacementAction: "REPLACE_PRODUCT",
  replacementProduct: "",
  estimatedBudget: "",
  approvalStatus: "PENDING_APPROVAL",
};

const AssessmentFormModal: React.FC<AssessmentFormModalProps> = ({
  isOpen,
  onClose,
  tickets,
  assessments,
  onCreateAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
  initialTicketId,
}) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [requesterName, setRequesterName] = useState("");
  const [department, setDepartment] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [items, setItems] = useState<{ itemName: string; unitType: string; quantity: number; price: number }[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen && initialTicketId) setSelectedTicketId(String(initialTicketId));
    else if (isOpen && !initialTicketId) handleNew();
  }, [isOpen, initialTicketId]);

  const handleNew = () => {
    setSelectedAssessmentId(null);
    setSelectedTicketId("");
    setRequesterName("");
    setDepartment("");
    setFormData(initialFormState);
    setItems([]);
  };

  const handleSave = async () => {
    if (!selectedTicketId) return toast.error("Please select a Ticket ID");
    try {
      await onCreateAssessment({ ticketId: selectedTicketId, requesterName, department, ...formData, items });
      toast.success("Assessment Form saved!");
      handleNew();
    } catch {
      toast.error("Failed to save Assessment");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAssessmentId) return toast.error("Select an assessment first");
    try {
      await onUpdateAssessment(selectedAssessmentId, { ticketId: selectedTicketId, requesterName, department, ...formData, items });
      toast.success("Assessment Form updated!");
    } catch {
      toast.error("Failed to update Assessment");
    }
  };

  const handleRemove = async () => {
    if (!selectedAssessmentId) return;
    try {
      await onDeleteAssessment(selectedAssessmentId);
      toast.success("Assessment removed");
      handleNew();
    } catch {
      toast.error("Failed to remove assessment");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <CustomModalHeader title="IT Assessment Form" subtitle="Tickets System Module" onClose={onClose} />
      <ModalBody className="p-0 dark:bg-gray-900 bg-gray-100 flex flex-col md:flex-row h-[750px] overflow-hidden">
        {/* Left Form */}
        <div className="w-full md:w-3/5 p-6 border-r overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Ticket No.</label><TextInput sizing="sm" value={selectedTicketId} onChange={(e) => setSelectedTicketId(e.target.value)} /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">User</label><TextInput sizing="sm" value={requesterName} readOnly className="bg-gray-50" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Department</label><TextInput sizing="sm" value={department} readOnly className="bg-gray-50" /></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Brand</label><TextInput sizing="sm" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Model</label><TextInput sizing="sm" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Item Code</label><TextInput sizing="sm" value={formData.itemCode} onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })} /></div>
          </div>

          <div><label className="text-xs font-bold text-gray-500 uppercase">Subject</label><TextInput sizing="sm" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Issue Description</label><Textarea rows={3} value={formData.issueDescription} onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })} /></div>

          <AssessmentItemTable
            items={items}
            onAddItem={() => setItems([...items, { itemName: "", unitType: "PCs", quantity: 1, price: 0 }])}
            onItemChange={(idx, field, val) => { const next = [...items]; (next[idx] as any)[field] = val; setItems(next); }}
            onRemoveItem={(idx) => setItems(items.filter((_, i) => i !== idx))}
          />

          <div className="flex gap-2 pt-2">
            <Button color="light" size="sm" onClick={handleNew}><Plus size={14} className="mr-1" /> New</Button>
            <Button color="blue" size="sm" onClick={handleSave} disabled={!!selectedAssessmentId}><Save size={14} className="mr-1" /> Save</Button>
            <Button color="light" size="sm" onClick={handleUpdate} disabled={!selectedAssessmentId}>Update</Button>
            <Button color="failure" size="sm" onClick={() => setConfirmDelete(true)} disabled={!selectedAssessmentId} className="ml-auto">Remove</Button>
          </div>
        </div>

        {/* Right List */}
        <AssessmentRecordList
          assessments={assessments}
          selectedAssessmentId={selectedAssessmentId}
          onSelectAssessment={(a) => { setSelectedAssessmentId(a.id); setFormData(a); setItems(a.items || []); }}
          onPreviewForm={() => setIsPreviewOpen(true)}
        />
      </ModalBody>

      <AssessmentPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} assessment={assessments?.find((a) => a.id === selectedAssessmentId)} ticket={null} />
      <ConfirmModal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={handleRemove} title="Delete Assessment" message="Permanently delete this IT Assessment record?" />
    </Modal>
  );
};

export default AssessmentFormModal;
