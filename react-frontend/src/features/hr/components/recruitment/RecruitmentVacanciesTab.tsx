import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, DropdownDivider } from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import { Briefcase, Building2, Calendar, Edit3, Trash2, MoreVertical, LayoutGrid, List } from "lucide-react";
import { format } from "date-fns";

interface RecruitmentVacanciesTabProps {
  vacancies: any[];
  searchQuery: string;
  onSelectVacancy: (v: any) => void;
  onEditVacancy: (v: any) => void;
  onDeleteVacancy: (id: number) => void;
}

const RecruitmentVacanciesTab: React.FC<RecruitmentVacanciesTabProps> = ({
  vacancies,
  searchQuery,
  onSelectVacancy,
  onEditVacancy,
  onDeleteVacancy,
}) => {
  const [vacancyPage, setVacancyPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerRow, setItemsPerRow] = useState("4");
  const vacanciesPerPage = 9;

  const filteredVacancies = vacancies.filter(
    (v) =>
      (v.jobPositionName || v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.employerName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedVacancies = filteredVacancies.slice(
    (vacancyPage - 1) * vacanciesPerPage,
    vacancyPage * vacanciesPerPage
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Active Vacancies</h3>
        <div className="flex items-center gap-3">
          {viewMode === "grid" && (
            <select
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-xs h-9 border-none px-3 font-bold cursor-pointer"
              value={itemsPerRow}
              onChange={(e) => setItemsPerRow(e.target.value)}
            >
              <option value="3">3 per row</option>
              <option value="4">4 per row</option>
              <option value="5">5 per row</option>
            </select>
          )}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className={`grid gap-6 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-4"}`}>
          {paginatedVacancies.map((v) => (
            <div key={v.id} className="shadow-sm bg-white dark:bg-gray-800 rounded-md p-4 relative group hover:shadow-md transition-shadow">
              <div className="absolute right-2 top-2">
                <Dropdown placement="bottom-end" label={<MoreVertical size={16} className="text-gray-400 cursor-pointer" />} arrowIcon={false} inline>
                  <DropdownItem onClick={() => onEditVacancy(v)} className="text-xs text-blue-600 font-bold">
                    <Edit3 size={14} className="mr-2" /> Edit Posting
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={() => onDeleteVacancy(v.id)} className="text-xs text-rose-600 font-bold">
                    <Trash2 size={14} className="mr-2" /> Delete Vacancy
                  </DropdownItem>
                </Dropdown>
              </div>
              <div className="flex items-start gap-3 mb-4 cursor-pointer" onClick={() => onSelectVacancy(v)}>
                <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20"><Briefcase size={20} /></div>
                <div>
                  <h4 className="font-bold dark:text-white text-base tracking-tight uppercase group-hover:text-blue-500">{v.jobPositionName || "Standard Role"}</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Building2 size={12} className="text-blue-500" /> {v.employerName || "Confidential"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2 border-y mb-3 text-xs">
                <div><p className="text-[8px] font-black text-gray-400 uppercase">Salary</p><p className="font-black dark:text-white">${v.salary || 0}</p></div>
                <div><p className="text-[8px] font-black text-gray-400 uppercase">Available</p><p className="font-black dark:text-white">{v.positionAvailable || 1}</p></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                <span className="flex items-center gap-1"><Calendar size={12} /> {v.closingDate || "TBD"}</span>
                <Badge color={v.status === "Open" ? "success" : "failure"} className="rounded-md">{v.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden p-0">
          <Table hoverable className="w-full">
            <TableHead className="bg-gray-50 dark:bg-gray-700">
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Position</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Employer</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Salary</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Closing</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
              <TableHeadCell className="py-3 px-4 text-[10px] uppercase text-right">Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {paginatedVacancies.map((v) => (
                <TableRow key={v.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 cursor-pointer" onClick={() => onSelectVacancy(v)}>
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase">{v.jobPositionName}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500">{v.employerName || "Confidential"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-black">${v.salary || 0}</TableCell>
                  <TableCell className="px-4 py-3 text-[10px] text-gray-400">{v.closingDate ? format(new Date(v.closingDate), "MMM dd, yyyy") : "N/A"}</TableCell>
                  <TableCell className="px-4 py-3"><Badge color={v.status === "Open" ? "success" : "gray"}>{v.status}</Badge></TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEditVacancy(v)} className="p-1 text-blue-600"><Edit3 size={15} /></button>
                      <button onClick={() => onDeleteVacancy(v.id)} className="p-1 text-rose-600"><Trash2 size={15} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ModernPagination
        currentPage={vacancyPage}
        totalPages={Math.max(1, Math.ceil(filteredVacancies.length / vacanciesPerPage))}
        onPageChange={setVacancyPage}
        totalItems={filteredVacancies.length}
        pageSize={vacanciesPerPage}
        onPageSizeChange={() => {}}
      />
    </motion.div>
  );
};

export default RecruitmentVacanciesTab;
