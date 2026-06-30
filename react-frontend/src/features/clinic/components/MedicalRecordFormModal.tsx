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
import { Plus } from "lucide-react";
import AddDiagnosisModal from "./AddDiagnosisModal";

const schema = z.object({
  patientId: z.string().min(1, "Required"),
  doctorId: z.string().min(1, "Required"),
  recordDate: z.string().min(1, "Required"),
  diagnosis: z.string().min(1, "Required"),
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
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", 0, 100],
    queryFn: () => clinicService.getDoctors(0, 100).then((res) => res.data),
  });

  const { data: diagnosisTemplatesData } = useQuery({
    queryKey: ["diagnosis-templates", 0, 100],
    queryFn: () => clinicService.getDiagnosisTemplates(0, 100).then((res) => res.data),
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
      toast.success(`Record ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="lg">
        <CustomModalHeader title={isEdit ? "Edit Record" : "New Medical Record"} onClose={onClose} icon={null} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
                <select {...register("patientId")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select Patient</option>
                  {patients.map((p: PatientDto) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
                {errors.patientId && <span className="text-red-500 text-xs mt-1">{errors.patientId.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                <select {...register("doctorId")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select Doctor</option>
                  {doctors.map((d: DoctorDto) => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.specialization}</option>
                  ))}
                </select>
                {errors.doctorId && <span className="text-red-500 text-xs mt-1">{errors.doctorId.message}</span>}
              </div>
              <div className="col-span-2">
                <Controller
                  control={control}
                  name="recordDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Date"
                      value={value ? new Date(value) : null}
                      onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      placeholder="Select Date..."
                    />
                  )}
                />
                {errors.recordDate && <span className="text-red-500 text-xs mt-1">{errors.recordDate.message}</span>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      name="diagnosis"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={diagnosisOptions}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          value={diagnosisOptions.find((c: any) => c.value === field.value) || null}
                          onChange={(val: any) => field.onChange(val?.value || "")}
                          placeholder="Select or Search Diagnosis..."
                          isClearable
                        />
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddDiagnosisOpen(true)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center h-[38px] w-[38px]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {errors.diagnosis && <span className="text-red-500 text-xs mt-1">{errors.diagnosis.message}</span>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Treatment Plan</label>
                <textarea {...register("treatment")} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescription Notes</label>
                <textarea {...register("prescription")} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
          </ModalBody>
          <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Save Record"} submitDisabled={mutation.isPending} />
        </form>
      </Modal>

      <AddDiagnosisModal 
        isOpen={isAddDiagnosisOpen}
        onClose={() => setIsAddDiagnosisOpen(false)}
        onAdded={(name) => setValue("diagnosis", name)}
      />
    </>
  );
}
