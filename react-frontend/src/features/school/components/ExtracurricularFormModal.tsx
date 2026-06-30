"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, ExtracurricularDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: ExtracurricularDto | null;
}

export default function ExtracurricularFormModal({ isOpen, onClose, activityToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!activityToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (activityToEdit) {
        reset({
          name: activityToEdit.name,
        });
      } else {
        reset({
          name: "",
        });
      }
    }
  }, [isOpen, activityToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && activityToEdit
        ? schoolService.updateExtracurricular(activityToEdit.id, data)
        : schoolService.createExtracurricular(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      toast.success(`Activity ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} activity`);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? "Edit Activity" : "New Activity"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Name
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Chess Club"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Create Activity"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
