"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  studentId: z.string().min(1, "Student ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
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
  const { t } = useTranslation();

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
          studentId: "",
          courseId: "",
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
      toast.success(isEdit ? t("enrollmentUpdatedSuccess") : t("enrollmentCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("enrollmentUpdatedFail") : t("enrollmentCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? t("editEnrollment") : t("newEnrollment")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
        <ModalBody className="p-0 flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("student")}<span className="text-red-500">{t("*")}</span>
                </label>
                <select
                  {...register("studentId")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">{t("selectStudent")}</option>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("course")}<span className="text-red-500">{t("*")}</span>
                </label>
                <select
                  {...register("courseId")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">{t("selectCourse")}</option>
                  {coursesData?.content?.map((course: CourseDto) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                      {/* ({course.description}) */}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <span className="text-red-500 text-xs mt-1">{errors.courseId.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("enrollmentDate")}
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
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("gradeOptional")}
              </label>
              <select
                {...register("grade")}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">{t("selectGradeOptional")}</option>
                <option value="A">A - Excellent</option>
                <option value="B">B - Good</option>
                <option value="C">C - Average</option>
                <option value="D">D - Poor</option>
                <option value="E">E - Very Poor</option>
                <option value="F">F - Fail</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              {errors.grade && (
                <span className="text-red-500 text-xs mt-1">{errors.grade.message}</span>
              )}
            </div>
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createEnrollment")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
