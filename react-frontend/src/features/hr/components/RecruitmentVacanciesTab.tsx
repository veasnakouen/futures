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
      (v.jobPositionName || v.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (v.employerName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedVacancies = filteredVacancies.slice(
    (vacancyPage - 1) * vacanciesPerPage,
    vacancyPage * vacanciesPerPage
  );

  return (
    <motion.div
      key="vacancies"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
          Active Vacancies
        </h3>
        <div className="flex items-center gap-3">
          {viewMode === "grid" && (
            <div className="flex-shrink-0">
              <select
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                value={itemsPerRow}
                onChange={(e) => setItemsPerRow(e.target.value)}
              >
                <option value="3">3 per row</option>
                <option value="4">4 per row</option>
                <option value="5">5 per row</option>
              </select>
            </div>
          )}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className={`grid gap-8 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
          {paginatedVacancies.map((v) => (
            <div
              key={v.id}
              className="shadow-sm bg-white dark:bg-gray-800 rounded-md focus-within:z-30 p-4 relative group hover:shadow-md transition-shadow"
            >
              <div className="absolute right-2 top-2">
                <Dropdown
                  placement="bottom-end"
                  label={
                    <div className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-blue-600 cursor-pointer">
                      <MoreVertical size={16} />
                    </div>
                  }
                  arrowIcon={false}
                  inline
                  className="bg-white dark:bg-gray-800 shadow-sm !rounded-md"
                >
                  <DropdownItem
                    onClick={() => setTimeout(() => onEditVacancy(v), 0)}
                    className="font-medium text-xs text-blue-600"
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 size={14} />
                      <span>Edit Posting</span>
                    </div>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onClick={() => setTimeout(() => onDeleteVacancy(v.id), 0)}
                    className="font-medium text-xs text-rose-600"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 size={14} />
                      <span>Delete Vacancy</span>
                    </div>
                  </DropdownItem>
                </Dropdown>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                  <Briefcase size={20} />
                </div>
                <div
                  className="pr-6 cursor-pointer group-hover:text-blue-600 transition-colors"
                  onClick={() => onSelectVacancy(v)}
                >
                  <h4 className="font-bold dark:text-white text-lg tracking-tight leading-none mb-1 uppercase group-hover:text-blue-500">
                    {v.jobPositionName || "Standard Role"}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <Building2 size={12} className="text-blue-500" />{" "}
                    {v.employerName || "Confidential"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y mb-3">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    Salary Package
                  </p>
                  <p className="font-black dark:text-white text-lg">
                    ${v.salary || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    Nodes Available
                  </p>
                  <p className="font-black dark:text-white text-lg">
                    {v.positionAvailable || 1}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={14} /> {v.closingDate || "TBD"}
                </span>
                <Badge
                  color={v.status === "Open" ? "success" : "failure"}
                  className="rounded-md"
                >
                  {v.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden p-0">
          <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
            <Table hoverable className="w-full min-w-[800px] relative">
              <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Broadcast Identity
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Employer Node
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Salary Scale
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Closing
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                  Status
                </TableHeadCell>
                <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6 text-right">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {paginatedVacancies.map((v) => (
                  <TableRow
                    key={v.id}
                    className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700/50"
                    onClick={() => onSelectVacancy(v)}
                  >
                    <TableCell className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                          <Briefcase size={14} />
                        </div>
                        <span className="font-black dark:text-white uppercase tracking-tight text-xs">
                          {v.jobPositionName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase">
                      {v.employerName || "Confidential"}
                    </TableCell>
                    <TableCell className="px-6 py-3 font-black dark:text-white text-xs">
                      ${v.salary || 0}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[10px] font-bold text-gray-400">
                      {v.closingDate
                        ? format(new Date(v.closingDate), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <Badge
                        color={v.status === "Open" ? "success" : "gray"}
                        className="rounded-md px-2 py-0.5 text-[8px] font-black uppercase"
                      >
                        {v.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditVacancy(v);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteVacancy(v.id);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {filteredVacancies.length > vacanciesPerPage && (
        <div className="mt-8">
          <ModernPagination
            currentPage={vacancyPage}
            totalPages={Math.ceil(
              filteredVacancies.length / vacanciesPerPage
            )}
            onPageChange={setVacancyPage}
            totalItems={filteredVacancies.length}
            pageSize={vacanciesPerPage}
            onPageSizeChange={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
};

export default RecruitmentVacanciesTab;
