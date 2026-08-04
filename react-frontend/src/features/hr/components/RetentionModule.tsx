import React, { useState, useEffect } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Heart, Search } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface RetentionModuleProps {
  records?: any[];
}

const RetentionModule: React.FC<RetentionModuleProps> = ({ records = [] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const defaultRecords = records.length > 0 ? records : [
    { id: 1, employeeName: "Sokha Chan", position: "Senior Fullstack Lead", flightRisk: "Low Risk", retentionStrategy: "Stock Options & Career Progression", status: "Stable" },
    { id: 2, employeeName: "Vandy Meas", position: "POS Store Manager", flightRisk: "Medium Risk", retentionStrategy: "Performance Bonus Incentive", status: "Under Review" },
    { id: 3, employeeName: "Bopha Khem", position: "Clinic Operations Nurse", flightRisk: "Low Risk", retentionStrategy: "Flexible Schedule & Education Allowance", status: "Stable" },
  ];

  const filtered = defaultRecords.filter((r) =>
    `${r.employeeName} ${r.position}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 px-2">
          <Heart size={18} className="text-rose-500" />
          <h4 className="font-black text-sm uppercase dark:text-white">Talent Retention & Attrition Risk Control</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search retention records..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
        </div>
      </div>

      {/* Retention Table */}
      <div className="border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Employee</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Role</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Flight Risk</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Retention Strategy</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No retention records found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((r, idx) => (
                <TableRow key={r.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{r.employeeName}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500">{r.position}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge color={r.flightRisk === "Low Risk" ? "success" : "warning"} className="text-[8px] uppercase">
                      {r.flightRisk}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-blue-600">{r.retentionStrategy}</TableCell>
                  <TableCell className="px-4 py-3"><Badge color="info" className="text-[8px] uppercase">{r.status}</Badge></TableCell>
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

export default RetentionModule;
