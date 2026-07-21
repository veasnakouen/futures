"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, StudentDto } from "../../../services/schoolService";
import { useAllUsers } from "../../../hooks/useHR";
import { Plus, Search, Edit2, Trash2, Eye, Users, Filter } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import StudentFormModal from "./StudentFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import HumanPortfolio from "../../../components/common/HumanPortfolio";
import { Modal, Button } from "@/lib/flowbite-compat";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DataTable, ColumnDef } from "../../../components/common/DataTable";

export default function StudentList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
  const [selectedOutreachWorker, setSelectedOutreachWorker] = useState<string>("");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<StudentDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: usersData, isLoading: usersLoading } = useAllUsers();

  const { data, isLoading } = useQuery({
    queryKey: ["students", page, size, search, sortField, sortDir, selectedOutreachWorker],
    queryFn: () => schoolService.getStudents(page, size, search, sortField, sortDir, selectedOutreachWorker).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(t("studentDeletedSuccess"));
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`${t("studentDeletedFail")}: ${msg}`);
      setIsConfirmOpen(false);
    }
  });

  const handleEdit = (student: StudentDto) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = (student: StudentDto) => {
    setSelectedStudent(student);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleView = (student: StudentDto) => {
    setViewStudent(student);
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

  const columns: ColumnDef<StudentDto>[] = [
    {
      header: t("name"),
      accessorKey: "firstName",
      sortable: true,
      cell: (student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
            {student.firstName?.charAt(0) || ""}{student.lastName?.charAt(0) || ""}
          </div>
          <div className="flex flex-col">
            <span className="font-bold whitespace-nowrap">{student.firstName} {student.lastName}</span>
            {(student.isIdPoor || student.broughtByOutreachWorker) && (
              <div className="flex gap-1.5 mt-1">
                {student.isIdPoor && (
                  <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                    ID Poor
                  </span>
                )}
                {student.broughtByOutreachWorker && (
                  <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md text-[9px] font-bold uppercase tracking-wider" title={student.outreachWorkerName}>
                    Outreach
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      header: t("email"),
      accessorKey: "email",
      sortable: true,
      cell: (student) => <span className="font-medium">{student.email}</span>
    },
    {
      header: t("dob"),
      accessorKey: "dateOfBirth",
      sortable: true,
      cell: (student) => <span className="font-medium">{student.dateOfBirth}</span>
    },
    {
      header: t("enrollmentDate"),
      accessorKey: "enrollmentDate",
      sortable: true,
      cell: (student) => (
        <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
          {student.enrollmentDate}
        </span>
      )
    },
    {
      header: t("actions"),
      className: "text-right",
      cell: (student) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleView(student)} className="p-2 text-green-600 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-xl transition-all"><Eye size={18} /></button>
          <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all"><Edit2 size={18} /></button>
          <button onClick={() => handleDelete(student)} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full shadow-inner">
            <Users size={28} className="drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t("students")}</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">{t("manageStudentsDesc")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64 group flex items-center gap-2">
            {usersLoading ? (
              <div className="text-sm text-gray-500 mr-2">...</div>
            ) : (
              <Select
                value={selectedOutreachWorker || "all"}
                onValueChange={(val) => {
                  setSelectedOutreachWorker(val === "all" ? "" : val);
                  setPage(0); // reset to first page when filtering
                }}
              >
                <SelectTrigger className="w-full h-[46px] pl-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded text-sm focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-inner">
                  <SelectValue placeholder="All Workers (My Clients)">
                    {selectedOutreachWorker && selectedOutreachWorker !== "all"
                      ? selectedOutreachWorker
                      : "All Workers (My Clients)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
                  <SelectItem value="all" className="cursor-pointer font-medium text-blue-600 dark:text-blue-400">
                    All Workers (My Clients)
                  </SelectItem>
                  {usersData?.map((u: any) => (
                    <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 my-1">
                      <div className="flex flex-col items-start text-left">
                        <span>{u.firstName} {u.lastName}</span>
                        {u.userName && <span className="text-xs text-gray-400">({u.userName})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded font-bold transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} /> {t("addStudent")}
          </button>
        </div>
      </div>

      <DataTable
        data={data?.content || []}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={handleSearch}
        searchPlaceholder={t("searchStudents")}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        pageSize={size}
        onPageSizeChange={handlePageSizeChange}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        totalItems={data?.totalElements || 0}
        emptyMessage={t("noStudentsFound")}
      />

      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        studentToEdit={selectedStudent}

      />

      <Modal show={isViewOpen} onClose={() => setIsViewOpen(false)} size="5xl" dismissible>
        <Modal.Body className="p-0 rounded-xl overflow-hidden bg-transparent">
          {viewStudent && (
            <HumanPortfolio
              entityType="student"
              onClose={() => setIsViewOpen(false)}
              data={{
                firstName: viewStudent.firstName,
                lastName: viewStudent.lastName,
                email: viewStudent.email,
                phone: viewStudent.studentPhone || "N/A",
                avatarUrl: viewStudent.imageUrl,
                idNumber: viewStudent.id,
                joinedDate: viewStudent.enrollmentDate,
                location: viewStudent.currentAddress ? `${viewStudent.currentAddress.street || ''} ${viewStudent.currentAddress.city || ''}` : undefined,
                socials: {
                  facebook: "#",
                  twitter: "#",
                  instagram: "#",
                  linkedin: "#"
                },
                about: `I am a dedicated student with a strong passion for computer science and mathematics. Over the last few years, I have actively participated in various coding competitions and robotics clubs.\n\nMy goal is to leverage technology to solve real-world problems. In my free time, I enjoy reading science fiction, contributing to open-source projects, and exploring new programming frameworks. I believe in continuous learning and always strive to push my boundaries.`,
                skills: [
                  { name: "Frontend Development", percentage: 85 },
                  { name: "Backend Architecture", percentage: 70 },
                  { name: "UI/UX Design", percentage: 90 },
                  { name: "Data Analysis", percentage: 65 }
                ],
                experiences: [
                  {
                    role: "President, Robotics Club",
                    organization: "High School Tech Department",
                    period: "Sep 2024 - Present",
                    description: "Lead a team of 15 students in designing and programming autonomous robots for state-level competitions. Organized weekly workshops on C++ and hardware integration."
                  },
                  {
                    role: "Intern Software Developer",
                    organization: "Local Tech Solutions",
                    period: "Jun 2024 - Aug 2024",
                    description: "Assisted in developing a web-based inventory management system using React and Node.js. Improved application performance by 20% through code optimization."
                  }
                ],
                projects: [
                  {
                    title: "Smart Garden Monitor",
                    description: "An IoT project using Arduino and moisture sensors to automatically water plants and track soil health via a React dashboard.",
                    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400&h=300",
                    link: "#"
                  },
                  {
                    title: "Student Portal App",
                    description: "A mobile application built with React Native for students to track their grades, assignments, and campus events in real-time.",
                    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400&h=300",
                    link: "#"
                  },
                  {
                    title: "AI Chat Assistant",
                    description: "A Python-based chatbot that integrates with OpenAI APIs to help students study by generating quizzes and summarizing notes.",
                    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400&h=300",
                    link: "#"
                  }
                ]
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedStudent!.id)}
        title={t("deleteStudent")}
        message={t("confirmDeleteStudent", { name: `${selectedStudent?.firstName} ${selectedStudent?.lastName}` })}
        confirmText={t("deleteStudent")}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
