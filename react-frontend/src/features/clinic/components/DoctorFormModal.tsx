"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, DoctorDto } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  specialization: z.string().min(1, "Required"),
  contactNumber: z.string().min(1, "Required"),
  email: z.string().email("Invalid email").min(1, "Required"),
  licenseNumber: z.string().optional(),
  yearOfExperience: z.coerce.number().optional(),
  npiNumber: z.string().optional(),
  consultationFee: z.coerce.number().optional(),
  employeeId: z.string().optional(),
  role: z.string().min(1, "Required"),
  hiredDate: z.string().optional(),
  terminationDate: z.string().optional(),
  shift: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: DoctorDto | null;
}

export default function DoctorFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ firstName: "", lastName: "", specialization: "", contactNumber: "", email: "", licenseNumber: "", yearOfExperience: undefined, npiNumber: "", consultationFee: undefined, employeeId: "", role: "", hiredDate: "", terminationDate: "", shift: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit && itemToEdit
        ? clinicService.updateDoctor(itemToEdit.id, data)
        : clinicService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success(`Provider ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
    );
    mutation.mutate(cleanData as FormValues);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Provider" : "New Provider"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input {...register("firstName")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input {...register("lastName")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
              <select {...register("specialization")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="General Practice">General Practice</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Other">Other</option>
              </select>
              {errors.specialization && <span className="text-red-500 text-xs mt-1">{errors.specialization.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input {...register("contactNumber")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input {...register("email")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Number</label>
              <input {...register("licenseNumber")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NPI Number</label>
              <input {...register("npiNumber")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
              <input type="number" {...register("yearOfExperience")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consultation Fee</label>
              <input type="number" step="0.01" {...register("consultationFee")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
              <input {...register("employeeId")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select {...register("role")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Specialist">Specialist</option>
                <option value="Administrator">Administrator</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <Controller
                control={control}
                name="hiredDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Hired Date"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
              {errors.hiredDate && <span className="text-red-500 text-xs mt-1">{errors.hiredDate.message}</span>}
            </div>
            <div>
              <Controller
                control={control}
                name="terminationDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Termination Date"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shift</label>
              <select {...register("shift")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
