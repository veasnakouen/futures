"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { schoolService, CourseDto, EnrollmentDto } from "../../../services/schoolService";
import { Modal } from "@/lib/flowbite-compat";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import { Users } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDto | null;
}

export default function CourseStudentsModal({ isOpen, onClose, course }: Props) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", "course", course?.id],
    queryFn: () => schoolService.getEnrollments(0, 100, course?.id).then((res) => res.data),
    enabled: isOpen && !!course?.id,
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader
        title={t("enrolledStudents", "Enrolled Students") + (course ? ` - ${course.name}` : "")}
        onClose={onClose}
        icon={<Users className="text-blue-600" size={24} />}
      />
      <Modal.Body className="bg-gray-50 dark:bg-gray-900 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : data?.content && data.content.length > 0 ? (
          <div className="grid grid-cols-1 md:sgrid-cols-2 lg:grid-cols-3 gap-4">
            {data.content.map((enrollment: EnrollmentDto) => (
              <div key={enrollment.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {enrollment.studentName?.charAt(0) || "S"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{enrollment.studentName}</h4>
                  <p className="text-xs text-gray-500 mt-1">Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-48 text-gray-500">
            <Users size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
            <p>{t("noStudentsEnrolled", "No students enrolled in this course yet.")}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
