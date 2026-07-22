import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, EnrollmentDto } from "../../../services/schoolService";
import { Plus, Edit2, Trash2, GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
import EnrollmentFormModal from "./EnrollmentFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";
import { toast } from "react-hot-toast";
import { Badge } from "@/lib/flowbite-compat";

export default function EnrollmentList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", page - 1, size],
    queryFn: () => schoolService.getEnrollments(page - 1, size).then((res) => res.data),
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

  const allEnrollments: EnrollmentDto[] = data?.content || [];
  const filteredEnrollments = allEnrollments.filter((e) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (e.studentName && e.studentName.toLowerCase().includes(query)) ||
      (e.courseName && e.courseName.toLowerCase().includes(query)) ||
      (e.grade && e.grade.toLowerCase().includes(query)) ||
      (String(e.id).includes(query))
    );
  });

  const totalElements = data?.totalElements || filteredEnrollments.length;
  const totalPages = data?.totalPages || Math.ceil(totalElements / size) || 1;

  const columns: ColumnDef<EnrollmentDto>[] = [
    {
      header: t("studentName"),
      accessorKey: "studentName",
      sortable: true,
      cell: (enrollment) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
            <GraduationCap size={18} />
          </div>
          <div>
            <span className="font-bold text-sm text-gray-900 dark:text-white block">
              {enrollment.studentName || `#${enrollment.studentId}`}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              Student #{enrollment.studentId}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("courseName"),
      accessorKey: "courseName",
      sortable: true,
      cell: (enrollment) => (
        <div className="flex items-center gap-1.5 font-medium text-xs text-gray-900 dark:text-white">
          <BookOpen size={14} className="text-indigo-500" />
          {enrollment.courseName || `#${enrollment.courseId}`}
        </div>
      ),
    },
    {
      header: t("enrollmentDate"),
      accessorKey: "enrollmentDate",
      sortable: true,
      cell: (enrollment) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono font-bold">
          <Calendar size={12} className="text-gray-400" />
          {enrollment.enrollmentDate || "N/A"}
        </div>
      ),
    },
    {
      header: t("grade"),
      accessorKey: "grade",
      cell: (enrollment) =>
        enrollment.grade ? (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            {enrollment.grade}
          </span>
        ) : (
          <span className="text-gray-400 italic text-xs font-medium">
            {t("noGrade")}
          </span>
        ),
    },
    {
      header: t("actions"),
      cell: (enrollment) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(enrollment)}
            className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all cursor-pointer"
            title="Edit Enrollment"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(enrollment)}
            className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
            title="Delete Enrollment"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl shadow-inner">
            <GraduationCap size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("enrollments")}
            </h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              {t("manageEnrollmentsDesc")}
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus size={20} strokeWidth={2.5} /> {t("newEnrollment")}
        </button>
      </div>

      {/* Enterprise DataTable */}
      <DataTable
        data={filteredEnrollments}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder={t("searchEnrollments")}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalElements}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setSize(newSize);
          setPage(1);
        }}
        enableViewToggle={true}
        enableColumnToggle={true}
        emptyMessage={t("noEnrollmentsFound")}
        renderGridCard={(enrollment: EnrollmentDto) => (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                  {enrollment.studentName || `#${enrollment.studentId}`}
                </h4>
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  {enrollment.courseName || `#${enrollment.courseId}`}
                </span>
              </div>

              {/* Hover Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(enrollment);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Edit Enrollment"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(enrollment);
                  }}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Enrollment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {enrollment.enrollmentDate || "N/A"}
              </span>
              {enrollment.grade ? (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded text-[9px] uppercase font-black">
                  Grade: {enrollment.grade}
                </span>
              ) : (
                <span className="text-gray-400 italic text-[10px]">No Grade</span>
              )}
            </div>
          </div>
        )}
      />

      <EnrollmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        enrollmentToEdit={selectedEnrollment}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedEnrollment?.id) {
            deleteMutation.mutate(selectedEnrollment.id.toString());
          }
        }}
        title={t("deleteEnrollment")}
        message={t("confirmDeleteEnrollment")}
      />
    </div>
  );
}
