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
import {Modal, ModalBody} from "@/lib/flowbite-compat";

const itemSchema = z.object({
  id: z.string().optional(),
  drugName: z.string().min(1, "Required"),
  ndcCode: z.string().min(1, "Required"),
  dosage: z.string().min(1, "Required"),
  frequency: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  refillsAllowed: z.string().min(1, "Required"),
  phamacyId: z.string().min(1, "Required"),
  inventoryItemId: z.number().optional(),
  quantityDispensed: z.number().optional(),
});

const schema = z.object({
  patientId: z.string().min(1, "Required"),
  diagnosis: z.string().min(1, "Required"),
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
      <CustomModalHeader title={isEdit ? "Edit Prescription" : "New Prescription"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
              <select {...register("patientId")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Patient...</option>
                {patientsData?.data?.content?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              {errors.patientId && <span className="text-red-500 text-xs mt-1">{errors.patientId.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis</label>
              <select {...register("diagnosis")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Diagnosis...</option>
                {diagnosisTemplatesData?.data?.content?.map((d: any) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.icd10Code})</option>
                ))}
              </select>
              {errors.diagnosis && <span className="text-red-500 text-xs mt-1">{errors.diagnosis.message}</span>}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medications</h3>
              <button type="button" onClick={() => append({ drugName: "", ndcCode: "", dosage: "", frequency: "", duration: "", refillsAllowed: "0", phamacyId: "P-001", quantityDispensed: 1 })} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                + Add Medicine
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-start p-4 rounded-lg relative">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                  )}
                  
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Drug Name</label>
                    <select 
                      {...register(`items.${index}.drugName`, {
                        onChange: (e) => {
                          const selectedDrug = stockItems?.find((item: any) => item.name === e.target.value);
                          if (selectedDrug) {
                            if (selectedDrug.sku) {
                              setValue(`items.${index}.ndcCode`, selectedDrug.sku);
                            }
                            if (selectedDrug.id) {
                              setValue(`items.${index}.inventoryItemId`, selectedDrug.id);
                            }
                          }
                        }
                      })} 
                      className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Drug</option>
                      {stockItems?.map((item: any) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                    {errors.items?.[index]?.drugName && <span className="text-red-500 text-xs">{errors.items[index]?.drugName?.message}</span>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">NDC/SKU Code</label>
                    <input {...register(`items.${index}.ndcCode`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                    <input {...register(`items.${index}.dosage`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                    <select {...register(`items.${index}.frequency`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="Daily">Daily</option>
                      <option value="BID">BID (2x/day)</option>
                      <option value="TID">TID (3x/day)</option>
                      <option value="Every 4 hrs">Every 4 hrs</option>
                      <option value="PRN">PRN (As needed)</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                    <select {...register(`items.${index}.duration`)} className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="1 Week">1 Week</option>
                      <option value="2 Weeks">2 Weeks</option>
                      <option value="1 Month">1 Month</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Refills</label>
                    <input {...register(`items.${index}.refillsAllowed`)} type="number" className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                    <input {...register(`items.${index}.quantityDispensed`, { valueAsNumber: true })} type="number" min="1" className="w-full px-2 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  
                  {/* Hidden fields */}
                  <input type="hidden" {...register(`items.${index}.phamacyId`)} />
                  <input type="hidden" {...register(`items.${index}.inventoryItemId`, { valueAsNumber: true })} />
                </div>
              ))}
            </div>
            {errors.items && <span className="text-red-500 text-sm mt-2 block">{errors.items.message}</span>}
          </div>

        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
