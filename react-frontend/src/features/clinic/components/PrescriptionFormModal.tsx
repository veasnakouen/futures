"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import { clinicService, PrescriptionDto, CreatePrescriptionCommand, UpdatePrescriptionCommand } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { Pill, User, Activity, Plus, Trash2, Shield, Package, Clock, Hash } from "lucide-react";

const itemSchema = z.object({
  id: z.string().optional(),
  drugName: z.string().min(1, "Drug Name is required"),
  ndcCode: z.string().min(1, "NDC Code is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  refillsAllowed: z.string().min(1, "Refills is required"),
  phamacyId: z.string().min(1, "Pharmacy ID is required"),
  inventoryItemId: z.number().optional(),
  quantityDispensed: z.number().optional(),
});

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  items: z.array(itemSchema).min(1, "Add at least one medicine"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: PrescriptionDto | null;
}

export default function PrescriptionFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: "",
      diagnosis: "",
      items: [{ drugName: "", ndcCode: "", dosage: "", frequency: "", duration: "", refillsAllowed: "0", phamacyId: "P-001", quantityDispensed: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const { data: stockItems } = useQuery({
    queryKey: ["inventory", "Medicine"],
    queryFn: async () => {
      const res = await api.get("/stock/inventory", { params: { size: 1000, category: "Medicine" } });
      return res.data?.content || [];
    },
    enabled: isOpen
  });

  const { data: patientsData } = useQuery({
    queryKey: ["patients"],
    queryFn: () => clinicService.getPatients(0, 100),
    enabled: isOpen
  });

  const { data: diagnosisTemplatesData } = useQuery({
    queryKey: ["diagnosisTemplates"],
    queryFn: () => clinicService.getDiagnosisTemplates(0, 100),
    enabled: isOpen
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({
          patientId: "",
          diagnosis: "",
          items: [{ drugName: "", ndcCode: "", dosage: "", frequency: "", duration: "", refillsAllowed: "0", phamacyId: "P-001", quantityDispensed: 1 }]
        });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? clinicService.updatePrescription(itemToEdit.id, data as UpdatePrescriptionCommand)
        : clinicService.createPrescription(data as CreatePrescriptionCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success(`Prescription ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader
        title={isEdit ? "Edit Clinical Prescription" : "New Rx Prescription Order"}
        subtitle="E-Pharmacy Fulfillment & Dosage Schedule"
        onClose={onClose}
        icon={<Pill size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient & Diagnosis Card */}
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <User size={15} /> Recipient Patient & ICD-10 Diagnosis
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Select Patient <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    {...register("patientId")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Patient Record...</option>
                    {patientsData?.data?.content?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
                </div>
                {errors.patientId && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.patientId.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Primary Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    {...register("diagnosis")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Diagnosis Template...</option>
                    {diagnosisTemplatesData?.data?.content?.map((d: any) => (
                      <option key={d.id} value={d.name}>{d.name} ({d.icd10Code})</option>
                    ))}
                  </select>
                </div>
                {errors.diagnosis && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.diagnosis.message}</span>}
              </div>
            </div>
          </div>

          {/* Rx Items Dynamic Table */}
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Pill size={15} /> Prescribed Pharmaceutical Items
              </h4>
              <button
                type="button"
                onClick={() => append({ drugName: "", ndcCode: "", dosage: "", frequency: "", duration: "", refillsAllowed: "0", phamacyId: "P-001", quantityDispensed: 1 })}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                <Plus size={14} /> Add Medicine Item
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50/70 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                    Medication #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-rose-500 hover:text-rose-700 p-1 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Drug Name / Item
                    </label>
                    <input
                      {...register(`items.${index}.drugName`)}
                      placeholder="e.g. Amoxicillin 500mg"
                      className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      NDC Code
                    </label>
                    <input
                      {...register(`items.${index}.ndcCode`)}
                      placeholder="e.g. 0093-3109-01"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Dosage
                    </label>
                    <input
                      {...register(`items.${index}.dosage`)}
                      placeholder="e.g. 500mg"
                      className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Frequency
                    </label>
                    <input
                      {...register(`items.${index}.frequency`)}
                      placeholder="e.g. 3x Daily after meals"
                      className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Duration
                    </label>
                    <input
                      {...register(`items.${index}.duration`)}
                      placeholder="e.g. 7 Days"
                      className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Refills Allowed
                    </label>
                    <input
                      {...register(`items.${index}.refillsAllowed`)}
                      placeholder="e.g. 0"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register(`items.${index}.quantityDispensed`, { valueAsNumber: true })}
                      placeholder="1"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Prescription" : "Issue Prescription Order"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
