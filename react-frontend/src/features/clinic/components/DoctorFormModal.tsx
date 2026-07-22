"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, DoctorDto } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { Stethoscope } from "lucide-react";

import { doctorFormSchema, DoctorFormValues } from "./doctor/doctorSchema";
import { DoctorIdentityFields } from "./doctor/DoctorIdentityFields";
import { DoctorCredentialsFields } from "./doctor/DoctorCredentialsFields";
import { DoctorRoleShiftFields } from "./doctor/DoctorRoleShiftFields";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: DoctorDto | null;
}

export default function DoctorFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({
          ...itemToEdit,
          yearOfExperience: itemToEdit.yearOfExperience ?? undefined,
          consultationFee: itemToEdit.consultationFee ?? undefined,
          role: itemToEdit.role || "Doctor",
          shift: itemToEdit.shift || "Full Day",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          specialization: "General Practice",
          contactNumber: "",
          email: "",
          licenseNumber: "",
          yearOfExperience: undefined,
          npiNumber: "",
          consultationFee: undefined,
          employeeId: "",
          role: "Doctor",
          hiredDate: "",
          terminationDate: "",
          shift: "Full Day",
        });
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
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Failed to ${isEdit ? "update" : "create"} provider. Please verify all mandatory fields.`;
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: DoctorFormValues) => {
    const cleanData: Record<string, any> = {};
    (Object.keys(data) as Array<keyof DoctorFormValues>).forEach((key) => {
      const val = data[key];
      if (val === "" || val === null || val === undefined) {
        cleanData[key] = undefined;
      } else if (typeof val === "number" && isNaN(val)) {
        cleanData[key] = undefined;
      } else {
        cleanData[key] = val;
      }
    });
    mutation.mutate(cleanData);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <CustomModalHeader
        title={isEdit ? "Edit Clinical Provider" : "New Practitioner Registration"}
        subtitle="Medical Provider Credentials & Practice Settings"
        onClose={onClose}
        icon={<Stethoscope size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 pb-10 bg-gray-50/50 dark:bg-gray-900/50 space-y-6 max-h-[75vh] overflow-y-auto">
          <DoctorIdentityFields register={register} errors={errors} />
          <DoctorCredentialsFields register={register} />
          <DoctorRoleShiftFields register={register} errors={errors} control={control} />
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Provider Record" : "Create Provider"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
