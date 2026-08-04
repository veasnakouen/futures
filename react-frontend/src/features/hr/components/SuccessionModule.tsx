import React, { useState, useEffect } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Award, Search, Plus } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface SuccessionModuleProps {
  plans?: any[];
  onAddPlan?: () => void;
}

const SuccessionModule: React.FC<SuccessionModuleProps> = ({
  plans = [],
  onAddPlan,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const defaultPlans = plans.length > 0 ? plans : [
    { id: 1, keyRole: "VP of Engineering & Architecture", currentHolder: "Sokha Chan", designatedSuccessor: "Vandy Meas", readiness: "Ready in 1 Year", status: "Approved" },
    { id: 2, keyRole: "Head of HR Operations", currentHolder: "Bopha Khem", designatedSuccessor: "Dara Sovann", readiness: "Immediate", status: "Active" },
    { id: 3, keyRole: "Lead System Architect", currentHolder: "Veasna Koeun", designatedSuccessor: "Rithy Seng", readiness: "Ready in 6 Months", status: "Approved" },
  ];

  const filtered = defaultPlans.filter((p) =>
    `${p.keyRole} ${p.currentHolder} ${p.designatedSuccessor}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedPlans = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 px-2">
          <Award size={18} className="text-blue-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">Executive Succession Planning</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search succession roles..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
          {onAddPlan && (
            <Button color="blue" size="xs" onClick={onAddPlan} className="font-black uppercase text-[10px] rounded-lg">
              <Plus size={14} className="mr-1" /> Nominate Candidate
            </Button>
          )}
        </div>
      </div>

      {/* Succession Table */}
      <div className="border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Critical Position</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Current Incumbent</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Designated Successor</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Readiness Timeline</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {paginatedPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No succession plans found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPlans.map((p, idx) => (
                <TableRow key={p.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{p.keyRole}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500">{p.currentHolder}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-blue-600">{p.designatedSuccessor}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-emerald-600">{p.readiness}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge color="success" className="text-[8px] uppercase">{p.status}</Badge>
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

export default SuccessionModule;
