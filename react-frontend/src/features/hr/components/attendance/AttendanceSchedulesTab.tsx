import React, { useState } from "react";
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { Calendar, Plus } from "lucide-react";
import ModernPagination from "@/components/common/ModernPagination";

interface AttendanceSchedulesTabProps {
  timetables: any[];
  onOpenTimetableModal: () => void;
  onOpenAssignModal: () => void;
}

const AttendanceSchedulesTab: React.FC<AttendanceSchedulesTabProps> = ({
  timetables,
  onOpenTimetableModal,
  onOpenAssignModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const safeTimetables = Array.isArray(timetables) ? timetables : [];
  const totalItems = safeTimetables.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedTimetables = safeTimetables.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h4 className="font-black text-sm uppercase dark:text-white">Shift Timetables & Schedules</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Configure working hours and assign rosters</p>
        </div>
        <div className="flex gap-2">
          <Button color="indigo" size="xs" onClick={onOpenTimetableModal} className="font-black uppercase text-[9px] rounded-lg">
            <Plus size={14} className="mr-1" /> New Timetable
          </Button>
          <Button color="blue" size="xs" onClick={onOpenAssignModal} className="font-black uppercase text-[9px] rounded-lg">
            <Calendar size={14} className="mr-1" /> Assign Roster
          </Button>
        </div>
      </div>

      <div className="border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Timetable Name</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">On-Duty Time</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Off-Duty Time</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Late Allowance</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Break Duration</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {paginatedTimetables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-gray-400 uppercase">
                  No shift timetables defined
                </TableCell>
              </TableRow>
            ) : (
              paginatedTimetables.map((t, idx) => (
                <TableRow key={t.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase">{t.name || "Standard Shift"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono">{t.onDutyTime || "08:00"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono">{t.offDutyTime || "17:00"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs">{t.lateAllowance || 15} mins</TableCell>
                  <TableCell className="px-4 py-3 text-xs">{t.breakDuration || 60} mins</TableCell>
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

export default AttendanceSchedulesTab;
