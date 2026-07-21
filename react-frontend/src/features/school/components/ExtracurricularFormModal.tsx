"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, ExtracurricularDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  schedule: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().optional(),
  cost: z.number().optional(),
  leadTeacherId: z.string().optional(),
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
  const { t } = useTranslation();

  const { data: teachersData } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => schoolService.getTeachers(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

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
          description: activityToEdit.description || "",
          schedule: activityToEdit.schedule || "",
          location: activityToEdit.location || "",
          capacity: activityToEdit.capacity,
          cost: activityToEdit.cost,
          leadTeacherId: activityToEdit.leadTeacherId || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          schedule: "",
          location: "",
          capacity: undefined,
          cost: undefined,
          leadTeacherId: "",
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
      toast.success(isEdit ? t("activityUpdatedSuccess") : t("activityCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("activityUpdatedFail") : t("activityCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? t("editActivity") : t("newActivity")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("activityName")}
            </label>
            <input
              {...register("name")}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Chess Club"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("leadTeacher")}
            </label>
            <select
              {...register("leadTeacherId")}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">{t("selectLeadTeacher")}</option>
              {(teachersData?.content || (Array.isArray(teachersData) ? teachersData : [])).map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("description")}
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Describe the activity..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("schedule")}
              </label>
              <input
                {...register("schedule")}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Fridays 3-5 PM"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("location")}
              </label>
              <input
                {...register("location")}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Room 101"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("capacity")}
              </label>
              <input
                {...register("capacity", { valueAsNumber: true })}
                type="number"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Maximum students"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("cost")}
              </label>
              <input
                {...register("cost", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. 50.00"
              />
            </div>
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createActivity")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
