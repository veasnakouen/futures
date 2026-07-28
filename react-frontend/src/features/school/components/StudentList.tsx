import React, { useState } from "react";
import { StudentDto } from "../../../services/schoolService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, GraduationCap, Eye } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

export interface StudentListProps {
  students?: StudentDto[];
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (student: StudentDto) => void;
  onDelete?: (id: any) => void;
  onAddNew?: () => void;
  onView?: (student: StudentDto) => void;
  [key: string]: any;
}

export default function StudentList({
  students = [],
  totalElements = 0,
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddNew = () => {},
  onView,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (s: any) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentIdNumber || s.id || "").toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          <Input
            type="text"
            placeholder="Search students by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button size="sm" onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs h-9">
          <Plus size={14} className="mr-1" /> Register Student
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase font-black text-gray-400">
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>Grade / Class</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y text-xs">
            {filteredStudents.map((student: any) => (
              <TableRow key={student.id}>
                <TableCell className="font-bold dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                    <GraduationCap size={16} />
                  </div>
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell className="font-mono text-gray-500">{student.studentIdNumber || student.id || "N/A"}</TableCell>
                <TableCell>{student.gradeLevel || student.grade || "Unassigned"}</TableCell>
                <TableCell className="text-gray-500">{student.email || "N/A"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${student.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    {student.status || "ACTIVE"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <Button variant="ghost" size="sm" onClick={() => onView(student)} className="h-8 w-8 p-0 text-indigo-600"><Eye size={14} /></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onEdit(student)} className="h-8 w-8 p-0 text-blue-600"><Edit size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(student.id)} className="h-8 w-8 p-0 text-red-600"><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalElements}
        />
      )}
    </div>
  );
}
