import React, { useState, useEffect } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Heart, Search } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface WellnessModuleProps {
  programs?: any[];
}

const WellnessModule: React.FC<WellnessModuleProps> = ({ programs = [] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const defaultPrograms = programs.length > 0 ? programs : [
    { id: 1, title: "Annual Health & Fitness Gym Allowance", category: "Physical Health", participants: 48, status: "Active" },
    { id: 2, title: "Workplace Mental Health & Counseling Support", category: "Mental Wellbeing", participants: 35, status: "Active" },
    { id: 3, title: "Ergonomic Office Setup & Health Assessment", category: "Occupational Health", participants: 62, status: "Active" },
  ];

  const filtered = defaultPrograms.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedPrograms = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 px-2">
          <Heart size={18} className="text-rose-500" />
          <h4 className="font-black text-sm uppercase dark:text-white">Employee Health & Wellness Programs</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search wellness initiatives..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Wellness Initiative</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Focus Category</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Enrolled Staff</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {paginatedPrograms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No wellness initiatives found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPrograms.map((p, idx) => (
                <TableRow key={p.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{p.title}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500">{p.category}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono font-bold text-blue-600">{p.participants} Members</TableCell>
                  <TableCell className="px-4 py-3"><Badge color="success" className="text-[8px] uppercase">{p.status}</Badge></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ModernPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default WellnessModule;
