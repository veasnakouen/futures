import React, { useState, useEffect } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { ShieldCheck, Search, CheckCircle } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface ComplianceModuleProps {
  audits?: any[];
}

const ComplianceModule: React.FC<ComplianceModuleProps> = ({ audits = [] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const defaultAudits = audits.length > 0 ? audits : [
    { id: 1, title: "Ministry of Labour Workplace Safety Audit", category: "Regulatory", status: "Passed", score: "98/100" },
    { id: 2, title: "NSSF Health & Social Security Compliance", category: "Social Security", status: "Passed", score: "100/100" },
    { id: 3, title: "Data Privacy & GDPR Staff Records Audit", category: "Cybersecurity", status: "Passed", score: "96/100" },
  ];

  const filtered = defaultAudits.filter((a) =>
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedAudits = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 px-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">Legal & Regulatory Compliance Management</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search compliance audits..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Audit Program</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Compliance Framework</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Audit Score</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {paginatedAudits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No compliance audits found
                </TableCell>
              </TableRow>
            ) : (
              paginatedAudits.map((a, idx) => (
                <TableRow key={a.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{a.title}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500">{a.category}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-emerald-600">{a.score}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge color="success" className="text-[8px] uppercase">
                      <CheckCircle size={10} className="inline mr-1" /> {a.status}
                    </Badge>
                  </TableCell>
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

export default ComplianceModule;
