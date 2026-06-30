"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, EnrollmentDto, StudentDto, CourseDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";

const schema = z.object({
  studentId: z.number().min(1, "Student ID is required"),
  courseId: z.number().min(1, "Course ID is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  grade: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  enrollmentToEdit?: EnrollmentDto | null;
}

export default function EnrollmentFormModal({ isOpen, onClose, enrollmentToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!enrollmentToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { data: studentsData } = useQuery({
    queryKey: ["students_all"],
    queryFn: () => schoolService.getStudents(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["courses_all"],
    queryFn: () => schoolService.getCourses(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const enrollmentDate = watch("enrollmentDate");

  useEffect(() => {
    if (isOpen) {
      if (enrollmentToEdit) {
        reset({
          studentId: enrollmentToEdit.studentId,
          courseId: enrollmentToEdit.courseId,
          enrollmentDate: enrollmentToEdit.enrollmentDate,
          grade: enrollmentToEdit.grade || "",
        });
      } else {
        reset({
          studentId: 0,
          courseId: 0,
          enrollmentDate: format(new Date(), "yyyy-MM-dd"),
          grade: "",
        });
      }
    }
  }, [isOpen, enrollmentToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && enrollmentToEdit
        ? schoolService.updateEnrollment(enrollmentToEdit.id, data)
        : schoolService.createEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success(`Enrollment ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} enrollment`);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? "Edit Enrollment" : "New Enrollment"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Student
              </label>
              <select
                {...register("studentId", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select a Student...</option>
                {studentsData?.content?.map((student: StudentDto) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <span className="text-red-500 text-xs mt-1">{errors.studentId.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course
              </label>
              <select
                {...register("courseId", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select a Course...</option>
                {coursesData?.content?.map((course: CourseDto) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName} ({course.courseCode})
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <span className="text-red-500 text-xs mt-1">{errors.courseId.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enrollment Date
            </label>
            <DatePicker
              value={enrollmentDate ? new Date(enrollmentDate) : null}
              onChange={(date) => setValue("enrollmentDate", format(date, "yyyy-MM-dd"))}
              placeholder="Select Date"
            />
            {errors.enrollmentDate && (
              <span className="text-red-500 text-xs mt-1">{errors.enrollmentDate.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grade (Optional)
            </label>
            <input
              {...register("grade")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="A"
            />
            {errors.grade && (
              <span className="text-red-500 text-xs mt-1">{errors.grade.message}</span>
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Create Enrollment"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
