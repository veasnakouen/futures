"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, GuestDto } from "../../../services/hotelService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  idProofNumber: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: GuestDto | null;
}

export default function GuestFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ firstName: "", lastName: "", email: "", phoneNumber: "", idProofNumber: "", nationality: "", dateOfBirth: "", address: "", emergencyContact: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? hotelService.updateGuest(itemToEdit.id, { ...data, email: data.email || "", phoneNumber: data.phoneNumber || "", dateOfBirth: data.dateOfBirth || undefined })
        : hotelService.createGuest({ ...data, email: data.email || "", phoneNumber: data.phoneNumber || "", dateOfBirth: data.dateOfBirth || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success(`Guest ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Guest" : "New Guest"} onClose={onClose} icon={null} />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input {...register("email")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input {...register("phoneNumber")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID / Passport #</label>
              <input {...register("idProofNumber")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationality</label>
              <input {...register("nationality")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
              <input type="date" {...register("dateOfBirth")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
              <input {...register("emergencyContact")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input {...register("address")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
