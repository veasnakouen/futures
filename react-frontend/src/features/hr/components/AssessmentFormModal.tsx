import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Button, TextInput, Textarea, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Select } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { X, FileText, Save, Plus, Trash2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import AssessmentPreviewModal from "./AssessmentPreviewModal";
import ConfirmModal from "./ConfirmModal";

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
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    itemCode: "",
    subject: "",
    issueDescription: "",
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [requesterName, setRequesterName] = useState("");
  const [department, setDepartment] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });

  const [items, setItems] = useState<
    { itemName: string; unitType: string; quantity: number; price: number }[]
  >([]);

  useEffect(() => {
    if (isOpen && initialTicketId) {
      setSelectedTicketId(String(initialTicketId));
    } else if (isOpen && !initialTicketId) {
      setSelectedTicketId("");
      setSelectedAssessmentId(null);
      setRequesterName("");
      setDepartment("");
      setFormData({
        brand: "",
        model: "",
        itemCode: "",
        subject: "",
        issueDescription: "",
      });
      setItems([]);
    }
  }, [isOpen, initialTicketId]);

  useEffect(() => {
    if (selectedTicketId) {
      const tkt = tickets.find(
        (t) =>
          String(t.id) === selectedTicketId ||
          `TKT-${String(t.id).padStart(5, "0")}` === selectedTicketId,
      );
      if (tkt) {
        const name = tkt.reporter
          ? tkt.reporter.firstName || tkt.reporter.firstNameEnglish || "Unknown"
          : "Unknown";
        const dept =
          tkt.reporter?.department?.name ||
          tkt.reporter?.department ||
          "Unknown";
        setRequesterName(name);
        setDepartment(dept);
        setFormData((prev) => ({
          ...prev,
          subject: tkt.title || "",
          issueDescription: tkt.description || "",
        }));
      } else {
        setRequesterName("");
        setDepartment("");
        setFormData((prev) => ({
          ...prev,
          subject: "",
          issueDescription: "",
        }));
      }
    }
  }, [selectedTicketId, tickets]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemName: "", unitType: "PCs", quantity: 1, price: 0 },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedTicketId) {
      toast.error("Please select or enter a Ticket ID");
      return;
    }

    try {
      await onCreateAssessment({
        ticketId: selectedTicketId,
        requesterName,
        department,
        brand: formData.brand,
        model: formData.model,
        itemCode: formData.itemCode,
        subject: formData.subject,
        issueDescription: formData.issueDescription,
        items,
      });
      toast.success("Assessment Form saved successfully!");
      // Reset
      setFormData({
        brand: "",
        model: "",
        itemCode: "",
        subject: "",
        issueDescription: "",
      });
      setItems([]);
      setSelectedTicketId("");
    } catch (err) {
      toast.error("Failed to save Assessment Form");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAssessmentId)
      return toast.error("Please select an assessment to update");
    try {
      await onUpdateAssessment(selectedAssessmentId, {
        ticketId: selectedTicketId,
        requesterName,
        department,
        brand: formData.brand,
        model: formData.model,
        itemCode: formData.itemCode,
        subject: formData.subject,
        issueDescription: formData.issueDescription,
        items,
      });
      toast.success("Assessment Form updated successfully!");
    } catch (err) {
      toast.error("Failed to update Assessment Form");
    }
  };

  const handleRemove = async () => {
    if (!selectedAssessmentId)
      return toast.error("Please select an assessment to remove");

    setConfirmModal({
      isOpen: true,
      title: "Delete Assessment Form",
      message:
        "Are you sure you want to completely remove this IT Assessment Form? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await onDeleteAssessment(selectedAssessmentId);
          toast.success("Assessment removed successfully");
          handleNew();
          setSelectedAssessmentId(null);
        } catch (error) {
          toast.error("Failed to remove assessment");
        }
      },
    });
  };

  const handleNew = () => {
    setSelectedAssessmentId(null);
    setSelectedTicketId("");
    setRequesterName("");
    setDepartment("");
    setFormData({
      brand: "",
      model: "",
      itemCode: "",
      subject: "",
      issueDescription: "",
    });
    setItems([]);
  };

  const loadAssessment = (a: any) => {
    setSelectedAssessmentId(a.id);
    setSelectedTicketId(a.ticketId || "");
    setRequesterName(a.requesterName || "");
    setDepartment(a.department || "");
    setFormData({
      brand: a.brand || "",
      model: a.model || "",
      itemCode: a.itemCode || "",
      subject: a.subject || "",
      issueDescription: a.issueDescription || "",
    });
    setItems(a.items || []);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <CustomModalHeader
        title="IT Assessment Form"
        subtitle="Tickets System Module"
        onClose={onClose}
      />
      <ModalBody className="p-0 dark:bg-gray-900 bg-gray-100 flex flex-col md:flex-row h-[750px] overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-full md:w-3/5 p-6 border-r overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Ticket No.
              </label>
              <TextInput
                sizing="sm"
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                placeholder="e.g. 2447"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                User
              </label>
              <TextInput
                sizing="sm"
                value={requesterName}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Department
              </label>
              <TextInput
                sizing="sm"
                value={department}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Brand
              </label>
              <TextInput
                sizing="sm"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Model
              </label>
              <TextInput
                sizing="sm"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Item Code
              </label>
              <TextInput
                sizing="sm"
                value={formData.itemCode}
                onChange={(e) =>
                  setFormData({ ...formData, itemCode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Subject
            </label>
            <TextInput
              sizing="sm"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Issue description
            </label>
            <Textarea
              rows={3}
              value={formData.issueDescription}
              onChange={(e) =>
                setFormData({ ...formData, issueDescription: e.target.value })
              }
            />
          </div>

          {/* Items Table */}
          <div className="rounded-md overflow-hidden bg-white dark:bg-gray-800">
            <Table hoverable>
              <TableHead className="bg-blue-200/50 dark:bg-blue-900/30">
                <TableHeadCell className="py-2 text-xs">
                  Item name*
                </TableHeadCell>
                <TableHeadCell className="py-2 text-xs w-24">
                  Unit Type*
                </TableHeadCell>
                <TableHeadCell className="py-2 text-xs w-20">
                  Quantity*
                </TableHeadCell>
                <TableHeadCell className="py-2 text-xs w-24">
                  Price*
                </TableHeadCell>
                <TableHeadCell className="py-2 text-xs w-10"></TableHeadCell>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx} className="border-b">
                    <TableCell className="p-1">
                      <TextInput
                        sizing="sm"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(idx, "itemName", e.target.value)
                        }
                        className="border-none shadow-none focus:ring-0"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Select
                        sizing="sm"
                        value={item.unitType}
                        onChange={(e) =>
                          handleItemChange(idx, "unitType", e.target.value)
                        }
                        className="border-none shadow-none"
                      >
                        <option>PCs</option>
                        <option>Box</option>
                        <option>Set</option>
                        <option>Unit</option>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1">
                      <TextInput
                        type="number"
                        sizing="sm"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            idx,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-none shadow-none"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <TextInput
                        type="number"
                        sizing="sm"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            idx,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="border-none shadow-none"
                      />
                    </TableCell>
                    <TableCell className="p-1 text-center">
                      <Button
                        size="xs"
                        color="failure"
                        outline
                        className="p-0 border-none h-6 w-6 rounded-md mx-auto h-12"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t">
              <Button
                size="xs"
                color="light"
                onClick={handleAddItem}
                className="font-bold text-xs"
              >
                <Plus size={14} className="mr-1" /> Add Item
              </Button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-2 mt-6">
            <Button
              color="light"
              size="sm"
              className="font-bold border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 h-12"
              onClick={handleNew}
            >
              <Plus size={16} className="mr-2" /> New
            </Button>
            <Button
              color="blue"
              size="sm"
              className="font-bold"
              onClick={handleSave}
              disabled={!!selectedAssessmentId}
            >
              <Save size={16} className="mr-2" /> Save
            </Button>
            <Button
              color="light"
              size="sm"
              className="font-bold h-12"
              onClick={handleUpdate}
              disabled={!selectedAssessmentId}
            >
              Update
            </Button>
            <Button
              color="failure"
              size="sm"
              className="font-bold ml-auto h-12"
              onClick={handleRemove}
              disabled={!selectedAssessmentId}
            >
              Remove
            </Button>
            <Button
              color="light"
              size="sm"
              className="font-bold"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Right Panel - Records */}
        <div className="w-full md:w-2/5 p-6 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-sm uppercase tracking-tight text-gray-700 dark:text-gray-300">
              Assessment Form Record
            </h4>
            <Button
              size="xs"
              color="light"
              className="font-bold text-[10px] uppercase"
              onClick={() => {
                if (!selectedAssessmentId)
                  return toast.error(
                    "Please select an assessment record first.",
                  );
                setIsPreviewOpen(true);
              }}
            >
              <Printer size={12} className="mr-2" /> Preview Form
            </Button>
          </div>

          <div className="rounded-md overflow-hidden">
            <Table hoverable>
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="py-2 text-[10px] text-center px-1">
                  Assessment ID
                </TableHeadCell>
                <TableHeadCell className="py-2 text-[10px] text-center px-1">
                  Assessment Date
                </TableHeadCell>
                <TableHeadCell className="py-2 text-[10px] text-center px-1">
                  Ref Ticket No.
                </TableHeadCell>
                <TableHeadCell className="py-2 text-[10px] px-1">
                  User
                </TableHeadCell>
                <TableHeadCell className="py-2 text-[10px] px-1">
                  Dept
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700 text-xs">
                {assessments?.map((a: any, i) => (
                  <TableRow
                    key={a.id || i}
                    className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer ${selectedAssessmentId === a.id ? "bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500" : ""}`}
                    onClick={() => loadAssessment(a)}
                  >
                    <TableCell className="py-2 px-1 text-center font-mono text-blue-600">
                      {a.id}
                    </TableCell>
                    <TableCell className="py-2 px-1 text-center">
                      {a.assessmentDate}
                    </TableCell>
                    <TableCell className="py-2 px-1 text-center font-mono">
                      {a.ticketId}
                    </TableCell>
                    <TableCell className="py-2 px-1 font-bold">
                      {a.requesterName}
                    </TableCell>
                    <TableCell className="py-2 px-1">{a.department}</TableCell>
                  </TableRow>
                ))}
                {(!assessments || assessments.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-400"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ModalBody>

      <AssessmentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        assessment={assessments?.find((a) => a.id === selectedAssessmentId)}
        ticket={tickets?.find(
          (t) => t.id.toString() === selectedTicketId.toString(),
        )}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </Modal>
  );
};

export default AssessmentFormModal;
