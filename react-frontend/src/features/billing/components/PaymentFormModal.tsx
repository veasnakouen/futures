"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService, PaymentDto, CreatePaymentCommand, UpdatePaymentCommand, InvoiceDto } from "../../../services/billingService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";

const schema = z.object({
  amount: z.coerce.number().min(0, "Invalid amount"),
  submitDate: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  adjudicatedAmount: z.coerce.number().min(0, "Invalid amount"),
  referenceId: z.string().optional().or(z.literal("")),
  sourceModule: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: PaymentDto | null;
}

export default function PaymentFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  // Queries for invoices
  const { data: invoicesData } = useQuery({ queryKey: ["invoices"], queryFn: () => billingService.getInvoices(0, 100), enabled: isOpen });

  const submitDate = watch("submitDate");

  // When an invoice is selected, auto-fill the amount
  const selectedInvoiceId = watch("referenceId");
  useEffect(() => {
    if (selectedInvoiceId && invoicesData?.data?.content) {
      const invoice = invoicesData.data.content.find((inv: InvoiceDto) => inv.id === selectedInvoiceId);
      if (invoice) {
        setValue("amount", invoice.grandTotal);
        setValue("sourceModule", invoice.sourceModule || "GENERAL");
      }
    }
  }, [selectedInvoiceId, invoicesData, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ amount: 0, submitDate: format(new Date(), "yyyy-MM-dd"), status: "PENDING", adjudicatedAmount: 0, referenceId: "", sourceModule: "GENERAL" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? billingService.updatePayment(itemToEdit.id, data as UpdatePaymentCommand)
        : billingService.createPayment(data as CreatePaymentCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`Payment ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Payment" : "Record Payment"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Invoice to Pay</label>
              <select {...register("referenceId")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">-- Select an Invoice --</option>
                {invoicesData?.data?.content?.map((inv: InvoiceDto) => {
                  return (
                    <option key={inv.id} value={inv.id}>
                      Invoice #{inv.id.substring(0, 8)} - ${inv.grandTotal.toFixed(2)} ({inv.sourceModule})
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Hidden field for sourceModule since we auto-inherit it from the invoice */}
            <input type="hidden" {...register("sourceModule")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select {...register("status")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Submit Date</label>
            <DatePicker
              value={submitDate ? new Date(submitDate) : null}
              onChange={(date) => setValue("submitDate", format(date, "yyyy-MM-dd"))}
              placeholder="Select Date"
            />
            {errors.submitDate && <span className="text-red-500 text-xs mt-1">{errors.submitDate.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
              <input type="number" step="0.01" {...register("amount")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.amount && <span className="text-red-500 text-xs mt-1">{errors.amount.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adjudicated ($)</label>
              <input type="number" step="0.01" {...register("adjudicatedAmount")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.adjudicatedAmount && <span className="text-red-500 text-xs mt-1">{errors.adjudicatedAmount.message}</span>}
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Record Payment"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
