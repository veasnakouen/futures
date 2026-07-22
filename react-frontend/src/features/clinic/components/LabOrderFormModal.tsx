"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, LabOrderDto, CreateLabOrderCommand, UpdateLabOrderCommand } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { TestTube, FileCode, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

const schema = z.object({
  testName: z.string().min(1, "Test Name is required"),
  loincCode: z.string().min(1, "LOINC Code is required"),
  status: z.string().min(1, "Status is required"),
  resultValue: z.string().optional(),
  referenceRange: z.string().optional(),
  abnormalFlag: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: LabOrderDto | null;
}

export default function LabOrderFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit, resultValue: itemToEdit.resultValue || "", referenceRange: itemToEdit.referenceRange || "", abnormalFlag: itemToEdit.abnormalFlag || "false" });
      } else {
        reset({ testName: "", loincCode: "", status: "PENDING", resultValue: "", referenceRange: "", abnormalFlag: "false" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? clinicService.updateLabOrder(itemToEdit.id, data as UpdateLabOrderCommand)
        : clinicService.createLabOrder(data as CreateLabOrderCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
      toast.success(`Lab order ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"} lab order`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader
        title={isEdit ? "Edit Pathology Lab Order" : "New Pathology Lab Order"}
        subtitle="Diagnostic Laboratory Testing & LOINC Coding"
        onClose={onClose}
        icon={<TestTube size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={15} /> Laboratory Test Panel Specs
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Test Name / Panel Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <TestTube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register("testName")}
                    placeholder="e.g. Complete Blood Count (CBC) w/ Differential"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                {errors.testName && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.testName.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  LOINC Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileCode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register("loincCode")}
                    placeholder="e.g. 57021-8"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                {errors.loincCode && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.loincCode.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Order Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                >
                  <option value="PENDING">PENDING - Order Created</option>
                  <option value="IN_PROGRESS">IN_PROGRESS - Specimen Processing</option>
                  <option value="COMPLETED">COMPLETED - Results Finalized</option>
                  <option value="CANCELLED">CANCELLED - Order Voided</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Result Value
                </label>
                <input
                  {...register("resultValue")}
                  placeholder="e.g. 14.2 g/dL"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Reference Normal Range
                </label>
                <input
                  {...register("referenceRange")}
                  placeholder="e.g. 12.0 - 16.0 g/dL"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-3 p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("abnormalFlag")}
                    value="true"
                    className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle size={15} /> Flag Result as Abnormal Critical Alert
                  </span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Lab Order" : "Submit Lab Order"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
