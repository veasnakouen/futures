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

const schema = z.object({
  patientId: z.string().min(1, "Required"),
  doctorId: z.string().min(1, "Required"),
  appointmentDate: z.string().min(1, "Required"),
  appointmentTime: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
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
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", 0, 100],
    queryFn: () => clinicService.getDoctors(0, 100).then((res) => res.data),
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
      toast.success(`Appointment ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Appointment" : "New Appointment"} onClose={onClose} icon={null} />
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
            <div>
              <Controller
                control={control}
                name="appointmentDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Date"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(format(date, "yyyy-MM-dd"))}
                    placeholder="Select Date..."
                  />
                )}
              />
              {errors.appointmentDate && <span className="text-red-500 text-xs mt-1">{errors.appointmentDate.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
              <input type="time" {...register("appointmentTime")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.appointmentTime && <span className="text-red-500 text-xs mt-1">{errors.appointmentTime.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select {...register("status")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea {...register("notes")} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Schedule"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
