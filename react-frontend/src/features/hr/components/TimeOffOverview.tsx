import React, { useState } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Calendar, Search, Plus, Clock } from "lucide-react";

interface TimeOffOverviewProps {
  leaveRequests?: any[];
  onOpenRequestModal?: () => void;
}

const TimeOffOverview: React.FC<TimeOffOverviewProps> = ({
  leaveRequests = [],
  onOpenRequestModal,
}) => {
  const [search, setSearch] = useState("");

  const defaultRequests = leaveRequests.length > 0 ? leaveRequests : [
    { id: 1, employeeName: "Sokha Chan", leaveType: "Annual Leave", startDate: "2026-06-01", endDate: "2026-06-05", duration: "5 Days", status: "Approved" },
    { id: 2, employeeName: "Vandy Meas", leaveType: "Sick Leave", startDate: "2026-06-10", endDate: "2026-06-11", duration: "2 Days", status: "Pending" },
    { id: 3, employeeName: "Bopha Khem", leaveType: "Personal Leave", startDate: "2026-06-15", endDate: "2026-06-15", duration: "1 Day", status: "Approved" },
  ];

  const filtered = defaultRequests.filter((r) =>
    `${r.employeeName} ${r.leaveType}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <Calendar size={18} className="text-blue-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">Time-Off & Leave Request Ledger</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search leave requests..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
          {onOpenRequestModal && (
            <Button color="blue" size="xs" onClick={onOpenRequestModal} className="font-black uppercase text-[10px] rounded-lg">
              <Plus size={14} className="mr-1" /> New Leave Request
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Employee</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Leave Type</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Start Date</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">End Date</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Duration</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filtered.map((r, idx) => (
              <TableRow key={r.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{r.employeeName}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-gray-500">{r.leaveType}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-mono">{r.startDate}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-mono">{r.endDate}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-bold text-blue-600">{r.duration}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge color={r.status === "Approved" ? "success" : "warning"} className="text-[8px] uppercase">{r.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimeOffOverview;
