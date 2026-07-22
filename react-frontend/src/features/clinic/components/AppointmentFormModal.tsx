"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { clinicService, AppointmentDto, PatientDto, DoctorDto } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { Calendar, User, Stethoscope, Clock, Activity, FileText } from "lucide-react";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor/Provider is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: AppointmentDto | null;
}

export default function AppointmentFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

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

  const patients = patientsData?.content || [];
  const doctors = doctorsData?.content || [];

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", status: "PENDING", notes: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? clinicService.updateAppointment(itemToEdit.id, data)
        : clinicService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(`Appointment ${isEdit ? "updated" : "scheduled"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "schedule"} appointment`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader
        title={isEdit ? "Edit Clinical Appointment" : "Schedule New Appointment"}
        subtitle="Patient Consultation & Practitioner Booking"
        onClose={onClose}
        icon={<Calendar size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={15} /> Consultation Details
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
                    <option value="">Choose Patient...</option>
                    {patients.map((p: PatientDto) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} {p.medicalRecordNumber ? `(MRN: ${p.medicalRecordNumber})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.patientId && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.patientId.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Select Attending Practitioner <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    {...register("doctorId")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Choose Doctor / Specialist...</option>
                    {doctors.map((d: DoctorDto) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.firstName} {d.lastName} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.doctorId && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.doctorId.message}</span>}
              </div>

              <div>
                <Controller
                  control={control}
                  name="appointmentDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Appointment Date *"
                      value={value ? new Date(value) : null}
                      onChange={(date) => onChange(format(date, "yyyy-MM-dd"))}
                      placeholder="Select Appointment Date..."
                    />
                  )}
                />
                {errors.appointmentDate && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.appointmentDate.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Consultation Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    {...register("appointmentTime")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                {errors.appointmentTime && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.appointmentTime.message}</span>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Appointment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                >
                  <option value="PENDING">PENDING - Awaiting Confirmation</option>
                  <option value="CONFIRMED">CONFIRMED - Practitioner Assigned</option>
                  <option value="COMPLETED">COMPLETED - Consultation Finished</option>
                  <option value="CANCELLED">CANCELLED - Appointment Void</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Clinical Encounter Notes / Reason for Visit
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 text-gray-400" size={16} />
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Enter chief complaint, diagnostic symptoms, or booking instructions..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Schedule Appointment"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
