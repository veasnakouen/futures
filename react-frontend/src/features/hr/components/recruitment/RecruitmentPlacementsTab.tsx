import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import { format } from "date-fns";

interface RecruitmentPlacementsTabProps {
  placements: any[];
  searchQuery: string;
}

const RecruitmentPlacementsTab: React.FC<RecruitmentPlacementsTabProps> = ({
  placements,
  searchQuery,
}) => {
  const [placementPage, setPlacementPage] = useState(1);
  const placementsPerPage = 10;

  const filteredPlacements = placements.filter(
    (p) =>
      (p.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.companyName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPlacements = filteredPlacements.slice(
    (placementPage - 1) * placementsPerPage,
    placementPage * placementsPerPage
  );

  return (
    <motion.div
      key="placements"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white/50 backdrop-blur-xl">
        <div className="p-8 border-b bg-gray-50/50 dark:bg-gray-700/20">
          <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
            Placement Audit Ledger
          </h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Verified historical hiring records
          </p>
        </div>
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
          <Table hoverable className="w-full min-w-[800px] relative">
            <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Candidate
              </TableHeadCell>
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Company
              </TableHeadCell>
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Position
              </TableHeadCell>
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Salary
              </TableHeadCell>
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Date
              </TableHeadCell>
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Type
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {paginatedPlacements.map((p) => (
                <TableRow
                  key={p.id}
                  className="bg-white dark:bg-gray-800 transition-colors"
                >
                  <TableCell className="px-6 py-4 font-black dark:text-white uppercase text-xs">
                    {p.clientName || "Candidate"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                    {p.companyName || "Employer"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs font-bold text-blue-600">
                    {p.jobPositionName || "Role"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-black dark:text-white text-xs">
                    ${p.salary || 0}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[10px] font-bold text-gray-400">
                    {p.placementDate
                      ? format(new Date(p.placementDate), "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[10px] font-black uppercase text-emerald-600">
                    {p.placementType || "Direct Hire"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {filteredPlacements.length > placementsPerPage && (
        <div className="mt-8">
          <ModernPagination
            currentPage={placementPage}
            totalPages={Math.ceil(
              filteredPlacements.length / placementsPerPage
            )}
            onPageChange={setPlacementPage}
            totalItems={filteredPlacements.length}
            pageSize={placementsPerPage}
            onPageSizeChange={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
};

export default RecruitmentPlacementsTab;
