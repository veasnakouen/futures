"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, TeacherDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody, Label, TextInput } from "@/lib/flowbite-compat";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacherToEdit?: TeacherDto | null;
}

export default function TeacherFormModal({ isOpen, onClose, teacherToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!teacherToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) reset(teacherToEdit);
      else reset({ status: "ACTIVE" });
    }
  }, [isOpen, teacherToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return isEdit
        ? schoolService.updateTeacher(teacherToEdit!.id, data)
        : schoolService.createTeacher(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(isEdit ? "Teacher record updated" : "Teacher registered");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save teacher");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" dismissible={false}>
      <CustomModalHeader
        title={isEdit ? "Modify Faculty Record" : "Register New Teacher"}
        subtitle="School Management System"
        onClose={onClose}
      />
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4 text-xs">
        <form id="teacher-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">First Name</Label>
              <TextInput {...register("firstName", { required: "First name required" })} sizing="sm" />
              {errors.firstName && <p className="text-red-500 text-[10px]">{errors.firstName.message as string}</p>}
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Last Name</Label>
              <TextInput {...register("lastName", { required: "Last name required" })} sizing="sm" />
              {errors.lastName && <p className="text-red-500 text-[10px]">{errors.lastName.message as string}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Email</Label>
              <TextInput type="email" {...register("email")} sizing="sm" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Phone Number</Label>
              <TextInput {...register("phone")} sizing="sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Department / Subject</Label>
              <TextInput {...register("specialization")} placeholder="e.g. Mathematics" sizing="sm" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Employee ID</Label>
              <TextInput {...register("employeeId")} sizing="sm" />
            </div>
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEdit}
        submitText={isEdit ? "Update Teacher" : "Create Teacher"}
        formId="teacher-form"
        submitDisabled={mutation.isPending}
      />
    </Modal>
  );
}
