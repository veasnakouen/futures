"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, CourseDto, TeacherDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import ImageUploadField from "../../../components/common/ImageUploadField";
import { Badge } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Course description is required"),
  credits: z.number().min(1, "Credits must be at least 1"),
  teacherId: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: CourseDto | null;
}

export default function CourseFormModal({ isOpen, onClose, courseToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!courseToEdit;
  const { t } = useTranslation();
  const schema = z.object({
    name: z.string().min(1, "Course name is required"),
    description: z.string().min(1, "Course description is required"),
    credits: z.number().min(1, "Credits must be at least 1"),
    teacherId: z.string().optional(),
    imageUrl: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { data: teachersData } = useQuery({
    queryKey: ["teachers_all"],
    queryFn: () => schoolService.getTeachers(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        reset({
          name: courseToEdit.name,
          description: courseToEdit.description,
          credits: courseToEdit.credits,
          teacherId: courseToEdit.teacherId || "",
          imageUrl: courseToEdit.imageUrl || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          credits: 1,
          teacherId: "",
          imageUrl: "",
        });
      }
    }
  }, [isOpen, courseToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = { ...data, teacherId: data.teacherId || "" };
      return isEdit && courseToEdit
        ? schoolService.updateCourse(courseToEdit.id, payload)
        : schoolService.createCourse(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(isEdit ? t("courseUpdatedSuccess") : t("courseCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("courseUpdatedFail") : t("courseCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? t("editCourse") : t("newCourse")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <ImageUploadField
            label={t("courseCoverImage")}
            value={watch("imageUrl")}
            onChange={(url) => setValue("imageUrl", url)}
          />
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("courseName")}<span className="text-red-500">{t("*")}</span>
            </label>
            <input
              {...register("name")}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Introduction to Programming"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("courseDescription")}<span className="text-red-500">{t("*")}</span>
              </label>
              <input
                {...register("description")}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="CS101"
              />
              {errors.description && (
                <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>
              )}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("credit")}
              </label>
              <input
                type="number"
                {...register("credits", { valueAsNumber: true })}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="3"
              />
              {errors.credits && (
                <span className="text-red-500 text-xs mt-1">{errors.credits.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("teacher")}
            </label>
            <select
              {...register("teacherId")}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">{t("selectTeacher")}</option>
              {teachersData?.content?.map((teacher: TeacherDto) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName} ({teacher.subject})
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <span className="text-red-500 text-xs mt-1">{errors.teacherId.message}</span>
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createCourse")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
