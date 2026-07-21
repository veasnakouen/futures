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

import { DataTable, ColumnDef } from "../../../components/common/DataTable";

export default function TeacherList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<TeacherDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", page, size, search, sortField, sortDir],
    queryFn: () => schoolService.getTeachers(page, size, search, sortField, sortDir).then((res) => res.data),
  });

  const { data: assignedCourses } = useQuery({
    queryKey: ["teacher_courses", viewTeacher?.id],
    queryFn: () => schoolService.getCoursesByTeacher(viewTeacher!.id, 0, 100).then((res) => res.data),
    enabled: !!viewTeacher && isViewOpen,
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const columns: ColumnDef<TeacherDto>[] = [
    {
      header: t("name"),
      accessorKey: "firstName",
      sortable: true,
      cell: (teacher) => (
        <span className="font-medium text-gray-900 dark:text-white uppercase">
          {teacher.firstName} {teacher.lastName}
        </span>
      )
    },
    {
      header: t("email"),
      accessorKey: "email",
      sortable: true,
      cell: (teacher) => teacher.email
    },
    {
      header: t("subject"),
      accessorKey: "subject",
      sortable: true,
      cell: (teacher) => (
        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-lg border-indigo-200 dark:border-indigo-800">
          {teacher.subject}
        </span>
      )
    },
    {
      header: t("hireDate"),
      accessorKey: "hireDate",
      sortable: true,
      cell: (teacher) => teacher.hireDate
    },
    {
      header: t("actions"),
      className: "text-right",
      cell: (teacher) => (
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
      )
    }
  ];

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

      <DataTable
        data={data?.content || []}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={handleSearch}
        searchPlaceholder={t("searchTeachers")}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        pageSize={size}
        onPageSizeChange={handlePageSizeChange}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        totalItems={data?.totalElements || 0}
        emptyMessage={t("noTeachersFound")}
      />

      <TeacherFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        teacherToEdit={selectedTeacher}
      />

      <Modal show={isViewOpen} onClose={() => setIsViewOpen(false)} size="5xl" dismissible>
        <Modal.Body className="p-0 rounded-xl overflow-hidden bg-transparent">
          {viewTeacher && (
            <HumanPortfolio
              entityType="teacher"
              onClose={() => setIsViewOpen(false)}
              data={{
                avatarUrl: viewTeacher.imageUrl,
                firstName: viewTeacher.firstName,
                lastName: viewTeacher.lastName,
                email: viewTeacher.email,
                idNumber: viewTeacher.id,
                joinedDate: viewTeacher.hireDate,
                department: viewTeacher.subject,
                socials: {
                  facebook: viewTeacher.facebookLink,
                  instagram: viewTeacher.instagramLink,
                  twitter: viewTeacher.twitterLink,
                  linkedin: viewTeacher.linkedinLink,
                },
                experiences: [
                  {
                    role: "Teacher",
                    organization: "Current School",
                    period: viewTeacher.hireDate 
                      ? `${new Date(viewTeacher.hireDate).getFullYear()} - Present` 
                      : `${new Date().getFullYear()} - Present`,
                    description: `Teaching ${viewTeacher.subject || "various subjects"} to students. Dedicated to providing quality education, developing comprehensive lesson plans, and fostering a highly engaging and positive learning environment.`
                  }
                ],
                projects: assignedCourses?.content?.map((course: any) => ({
                  title: course.name,
                  description: course.description || `${course.credits} Credits`,
                  imageUrl: course.imageUrl || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop",
                })) || []
              }}
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
