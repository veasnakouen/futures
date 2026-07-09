"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, TeacherDto } from "../../../services/schoolService";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import TeacherFormModal from "./TeacherFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import HumanPortfolio from "../../../components/common/HumanPortfolio";
import { Modal, Button } from "@/lib/flowbite-compat";
import { toast } from "react-hot-toast";

export default function TeacherList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<TeacherDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", page, size],
    queryFn: () => schoolService.getTeachers(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(t("teacherDeletedSuccess"));
      setIsConfirmOpen(false);
    },
  });

  const handleEdit = (teacher: TeacherDto) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleDelete = (teacher: TeacherDto) => {
    setSelectedTeacher(teacher);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleView = (teacher: TeacherDto) => {
    setViewTeacher(teacher);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("teachers")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("manageTeachersDesc")}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} />
          {t("addTeacher")}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("searchTeachers")}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">{t("id")}</th>
                <th className="px-6 py-4 font-bold">{t("name")}</th>
                <th className="px-6 py-4 font-bold">{t("email")}</th>
                <th className="px-6 py-4 font-bold">{t("subject")}</th>
                <th className="px-6 py-4 font-bold">{t("hireDate")}</th>
                <th className="px-6 py-4 font-bold text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {t("loadingTeachers")}
                  </td>
                </tr>
              ) : !data?.content || data.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {t("noTeachersFound")}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        {t("addFirstTeacher")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.content?.map((teacher: TeacherDto) => (
                  <tr
                    key={teacher.id}
                    className="bg-white dark:bg-gray-800 border-b hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{teacher.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4">{teacher.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-lg border-indigo-200 dark:border-indigo-800">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">{teacher.hireDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(teacher)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data?.totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/50">
            <ModernPagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <TeacherFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        teacherToEdit={selectedTeacher}
      />

      <Modal show={isViewOpen} onClose={() => setIsViewOpen(false)} size="3xl" dismissible>
        <Modal.Body className="p-0 rounded-xl overflow-hidden bg-transparent">
          {viewTeacher && (
            <HumanPortfolio
              entityType="teacher"
              data={{
                firstName: viewTeacher.firstName,
                lastName: viewTeacher.lastName,
                email: viewTeacher.email,
                idNumber: viewTeacher.id,
                joinedDate: viewTeacher.hireDate,
                department: viewTeacher.subject,
              }}
              actions={
                <Button color="gray" size="sm" onClick={() => setIsViewOpen(false)}>
                  {t("close")}
                </Button>
              }
            />
          )}
        </Modal.Body>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedTeacher!.id)}
        title={t("deleteTeacher")}
        message={t("confirmDeleteTeacher", { name: `${selectedTeacher?.firstName} ${selectedTeacher?.lastName}` })}
        confirmText={t("deleteTeacher")}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
