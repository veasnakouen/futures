"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, CourseDto } from "../../../services/schoolService";
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import CourseFormModal from "./CourseFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import CourseStudentsModal from "./CourseStudentsModal";
import { toast } from "react-hot-toast";

import { DataTable, ColumnDef } from "../../../components/common/DataTable";

export default function CourseList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["courses", page, size, search, sortField, sortDir],
    queryFn: () => schoolService.getCourses(page, size, search, sortField, sortDir).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(t("courseDeletedSuccess"));
      setIsConfirmOpen(false);
    },
  });

  const handleEdit = (course: CourseDto) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleViewStudents = (course: CourseDto) => {
    setSelectedCourse(course);
    setIsStudentsOpen(true);
  };

  const handleDelete = (course: CourseDto) => {
    setSelectedCourse(course);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
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

  const columns: ColumnDef<CourseDto>[] = [
    {
      header: t("code"),
      accessorKey: "description",
      sortable: true,
      cell: (course) => (
        <span className="font-bold text-gray-900 dark:text-white">
          {course.description}
        </span>
      )
    },
    {
      header: t("name"),
      accessorKey: "name",
      sortable: true,
      cell: (course) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {course.name}
        </span>
      )
    },
    {
      header: t("credits"),
      accessorKey: "credits",
      sortable: true,
      cell: (course) => (
        <span className="px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-lg border-yellow-200 dark:border-yellow-800">
          {course.credits} Credits
        </span>
      )
    },
    {
      header: t("teacher"),
      accessorKey: "teacherFirstName",
      sortable: true,
      cell: (course) => (
        <span className="text-gray-900 dark:text-white">
          {course.teacherFirstName && course.teacherLastName ? (
            `${course.teacherFirstName} ${course.teacherLastName}`
          ) : (
            <span className="text-gray-400 italic text-xs">{t("unassigned")}</span>
          )}
        </span>
      )
    },
    {
      header: t("actions"),
      className: "text-right",
      cell: (course) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleViewStudents(course)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={t("viewStudents")}
          >
            <Users size={16} />
          </button>
          <button
            onClick={() => handleEdit(course)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(course)}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("courses")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("manageCoursesDesc")}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} />
          {t("addCourse")}
        </button>
      </div>

      <DataTable
        data={data?.content || []}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={handleSearch}
        searchPlaceholder={t("searchCourses")}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        pageSize={size}
        onPageSizeChange={handlePageSizeChange}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        totalItems={data?.totalElements || 0}
        emptyMessage={t("noCoursesFound")}
      />

      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        courseToEdit={selectedCourse}
      />

      <CourseStudentsModal
        isOpen={isStudentsOpen}
        onClose={() => setIsStudentsOpen(false)}
        course={selectedCourse}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedCourse!.id)}
        title={t("deleteCourse")}
        message={t("confirmDeleteCourse", { name: selectedCourse?.name })}
        confirmText={t("deleteCourse")}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
