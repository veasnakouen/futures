"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, CourseDto, TeacherDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

const schema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  courseCode: z.string().min(1, "Course code is required"),
  credits: z.number().min(1, "Credits must be at least 1"),
  teacherId: z.number().min(1, "Teacher is required"),
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

  const {
    register,
    handleSubmit,
    reset,
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
          courseName: courseToEdit.courseName,
          courseCode: courseToEdit.courseCode,
          credits: courseToEdit.credits,
          teacherId: courseToEdit.teacherId,
        });
      } else {
        reset({
          courseName: "",
          courseCode: "",
          credits: 3,
          teacherId: 0,
        });
      }
    }
  }, [isOpen, courseToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && courseToEdit
        ? schoolService.updateCourse(courseToEdit.id, data)
        : schoolService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(`Course ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} course`);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? "Edit Course" : "New Course"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Name
            </label>
            <input
              {...register("courseName")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Introduction to Programming"
            />
            {errors.courseName && (
              <span className="text-red-500 text-xs mt-1">{errors.courseName.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Code
              </label>
              <input
                {...register("courseCode")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="CS101"
              />
              {errors.courseCode && (
                <span className="text-red-500 text-xs mt-1">{errors.courseCode.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credits
              </label>
              <input
                type="number"
                {...register("credits", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
              {errors.credits && (
                <span className="text-red-500 text-xs mt-1">{errors.credits.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teacher
            </label>
            <select
              {...register("teacherId", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select a Teacher...</option>
              {teachersData?.content?.map((teacher: TeacherDto) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName} ({teacher.department})
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
          submitText={isEdit ? "Save Changes" : "Create Course"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
