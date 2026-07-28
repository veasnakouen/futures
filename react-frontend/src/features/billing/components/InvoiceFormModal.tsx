import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Modal, ModalBody, Label, TextInput, Select, Button } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: any;
  onSave?: (data: any) => Promise<void>;
  [key: string]: any;
}

export default function InvoiceFormModal({
  isOpen,
  onClose,
  invoiceToEdit,
  onSave = async () => {},
}: InvoiceFormModalProps) {
  const isEdit = !!invoiceToEdit;
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<any>({
    defaultValues: {
      items: [{ description: "Standard Service Fee", quantity: 1, unitPrice: 100 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (isOpen) {
      if (invoiceToEdit) reset(invoiceToEdit);
      else reset({ status: "UNPAID", items: [{ description: "Consultation / Service", quantity: 1, unitPrice: 50 }] });
    }
  }, [isOpen, invoiceToEdit, reset]);

  const items = watch("items") || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), 0);

  const onSubmit = async (data: any) => {
    try {
      await onSave({ ...data, totalAmount: subtotal });
      toast.success(isEdit ? "Invoice updated" : "Invoice issued");
      onClose();
    } catch {
      toast.error("Failed to save invoice");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" dismissible={false}>
      <CustomModalHeader
        title={isEdit ? "Modify Financial Invoice" : "Generate Billing Invoice"}
        subtitle="Financial & Billing Subsystem"
        onClose={onClose}
      />
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4 text-xs">
        <form id="invoice-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Customer / Patient Name</Label>
              <TextInput {...register("customerName", { required: "Customer is required" })} sizing="sm" placeholder="Client Name" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Invoice Status</Label>
              <Select {...register("status")} sizing="sm">
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase text-gray-400">Line Items</Label>
              <Button type="button" size="xs" color="light" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}>
                <Plus size={12} className="mr-1" /> Add Line
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <TextInput {...register(`items.${index}.description`)} placeholder="Item description" sizing="sm" className="flex-1" />
                <TextInput type="number" {...register(`items.${index}.quantity`)} placeholder="Qty" sizing="sm" className="w-16" />
                <TextInput type="number" step="0.01" {...register(`items.${index}.unitPrice`)} placeholder="Price" sizing="sm" className="w-24" />
                <button type="button" onClick={() => remove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border">
            <span className="font-black uppercase text-gray-400 text-[10px]">Total Invoice Amount:</span>
            <span className="font-mono font-black text-lg text-emerald-600">${subtotal.toFixed(2)}</span>
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEdit}
        submitText={isEdit ? "Update Invoice" : "Issue Invoice"}
        formId="invoice-form"
      />
    </Modal>
  );
}
