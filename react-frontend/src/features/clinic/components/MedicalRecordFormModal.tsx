import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { clinicService, MedicalRecordDto, PatientDto, DoctorDto } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import Select from "react-select";
import { Plus, FileText, User, Stethoscope, Activity, Calendar, Pill, HeartPulse } from "lucide-react";
import AddDiagnosisModal from "./AddDiagnosisModal";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  recordDate: z.string().min(1, "Date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: MedicalRecordDto | null;
}

export default function MedicalRecordFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;
  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);

  const { data: patientsData } = useQuery({
    queryKey: ["patients", 0, 100],
    queryFn: () => clinicService.getPatients(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", 0, 100],
    queryFn: () => clinicService.getDoctors(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const { data: diagnosisTemplatesData } = useQuery({
    queryKey: ["diagnosis-templates", 0, 100],
    queryFn: () => clinicService.getDiagnosisTemplates(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const patients = patientsData?.content || [];
  const doctors = doctorsData?.content || [];
  const diagnosisTemplates = diagnosisTemplatesData?.content || [];

  const diagnosisOptions = diagnosisTemplates.map((t: any) => ({
    value: t.name,
    label: t.icd10Code ? `${t.name} (${t.icd10Code})` : t.name
  }));

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        const today = new Date().toISOString().split("T")[0];
        reset({ patientId: "", doctorId: "", recordDate: today, diagnosis: "", treatment: "", prescription: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? clinicService.updateMedicalRecord(itemToEdit.id, data)
        : clinicService.createMedicalRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      toast.success(`Clinical record ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"} clinical record`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="lg">
        <CustomModalHeader
          title={isEdit ? "Edit EHR Clinical Record" : "New EHR Clinical Encounter"}
          subtitle="Electronic Health Record & Diagnostic Summary"
          onClose={onClose}
          icon={<FileText size={20} />}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
            <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={15} /> Clinical Encounter Identification
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
                      <option value="">Select Patient...</option>
                      {patients.map((p: PatientDto) => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                  </div>
                  {errors.patientId && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.patientId.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Attending Physician <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      {...register("doctorId")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                    >
                      <option value="">Select Practitioner...</option>
                      {doctors.map((d: DoctorDto) => (
                        <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization})</option>
                      ))}
                    </select>
                  </div>
                  {errors.doctorId && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.doctorId.message}</span>}
                </div>

                <div className="md:col-span-2">
                  <Controller
                    control={control}
                    name="recordDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label="Encounter Date *"
                        value={value ? new Date(value) : null}
                        onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        placeholder="Select Date of Encounter..."
                      />
                    )}
                  />
                  {errors.recordDate && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.recordDate.message}</span>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Primary Clinical Diagnosis <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Controller
                        name="diagnosis"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            options={diagnosisOptions}
                            value={diagnosisOptions.find((o) => o.value === value) || (value ? { value, label: value } : null)}
                            onChange={(val: any) => onChange(val ? val.value : "")}
                            placeholder="Search ICD-10 Diagnosis..."
                            className="text-sm font-bold"
                            classNamePrefix="react-select"
                            isClearable
                          />
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddDiagnosisOpen(true)}
                      className="px-3 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-indigo-100 transition-all shrink-0 cursor-pointer"
                    >
                      <Plus size={15} /> Add Template
                    </button>
                  </div>
                  {errors.diagnosis && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.diagnosis.message}</span>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Treatment & Therapeutic Plan
                  </label>
                  <textarea
                    {...register("treatment")}
                    rows={3}
                    placeholder="Enter prescribed therapeutic procedures, outpatient care instructions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Medication & Dosage Notes
                  </label>
                  <textarea
                    {...register("prescription")}
                    rows={2}
                    placeholder="Enter medication summary or pharmacy refill instructions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={onClose}
            submitText={isEdit ? "Save Clinical Record" : "Create Encounter Record"}
            submitDisabled={mutation.isPending}
          />
        </form>
      </Modal>

      <AddDiagnosisModal
        isOpen={isAddDiagnosisOpen}
        onClose={() => setIsAddDiagnosisOpen(false)}
        onAdded={(name) => {
          queryClient.invalidateQueries({ queryKey: ["diagnosis-templates"] });
          setValue("diagnosis", name);
        }}
      />
    </>
  );
}
