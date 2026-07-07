"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, EnrollmentDto } from "../../../services/schoolService";
import { Plus, Search, Edit2, Trash2, GraduationCap } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import EnrollmentFormModal from "./EnrollmentFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

export default function EnrollmentList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", page, size],
    queryFn: () => schoolService.getEnrollments(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success(t("enrollmentDeletedSuccess"));
      setIsConfirmOpen(false);
    },
  });

  const handleEdit = (enrollment: EnrollmentDto) => {
    setSelectedEnrollment(enrollment);
    setIsFormOpen(true);
  };

  const handleDelete = (enrollment: EnrollmentDto) => {
    setSelectedEnrollment(enrollment);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedEnrollment(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl shadow-inner">
            <GraduationCap size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("enrollments")}</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">{t("manageEnrollmentsDesc")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder={t("searchEnrollments")}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500/50 dark:text-white transition-all shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} /> {t("newEnrollment")}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-900 dark:text-gray-100 uppercase bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md">
              <tr>
                <th className="px-8 py-5 font-black tracking-wider">{t("studentName")}</th>
                <th className="px-6 py-5 font-black tracking-wider">{t("courseName")}</th>
                <th className="px-6 py-5 font-black tracking-wider">{t("enrollmentDate")}</th>
                <th className="px-6 py-5 font-black tracking-wider">{t("grade")}</th>
                <th className="px-8 py-5 font-black tracking-wider text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/30">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><div className="flex justify-center"><Spinner size="xl" /></div></td></tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-purple-500/10 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {t("noEnrollmentsFound")}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        {t("addFirstEnrollment")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.content?.map((enrollment: EnrollmentDto) => (
                  <tr key={enrollment.id} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">
                      {enrollment.studentName || `#${enrollment.studentId}`}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900 dark:text-white">
                      {enrollment.courseName || `#${enrollment.courseId}`}
                    </td>
                    <td className="px-6 py-5 font-medium">{enrollment.enrollmentDate}</td>
                    <td className="px-6 py-5">
                      {enrollment.grade ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                          {enrollment.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs font-medium">{t("noGrade")}</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(enrollment)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(enrollment)} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/30 bg-gray-50/30 dark:bg-gray-800/20">
            <ModernPagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <EnrollmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        enrollmentToEdit={selectedEnrollment}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedEnrollment!.id)}
        title={t("deleteEnrollment")}
        message={t("confirmDeleteEnrollment", { id: selectedEnrollment?.id })}
        confirmText={t("deleteEnrollment")}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
