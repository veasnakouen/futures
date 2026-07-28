import React, { useState } from "react";
import { Button, TextInput, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { Calendar, Search, Plus, Clock } from "lucide-react";

import { ShiftScheduleModal } from "./ShiftScheduleModal";
import { ScheduleAssignmentModal } from "./ScheduleAssignmentModal";

interface SchedulingModuleProps {
  shifts?: any[];
  onAddShift?: () => void;
  onAssignShift?: () => void;
}

const SchedulingModule: React.FC<SchedulingModuleProps> = ({
  shifts = [],
  onAddShift,
  onAssignShift,
}) => {
  const [search, setSearch] = useState("");
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const defaultShifts = shifts.length > 0 ? shifts : [
    { id: 1, name: "Morning Operational Shift", startTime: "08:00", endTime: "17:00", duration: "8 Hours", employeesCount: 14 },
    { id: 2, name: "Evening Support Shift", startTime: "16:00", endTime: "00:00", duration: "8 Hours", employeesCount: 6 },
    { id: 3, name: "Night Monitoring Shift", startTime: "00:00", endTime: "08:00", duration: "8 Hours", employeesCount: 4 },
  ];

  const filtered = defaultShifts.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <Calendar size={18} className="text-blue-600" />
          <h4 className="font-black text-sm uppercase dark:text-white">Shift Scheduling & Roster Control</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-64">
            <TextInput sizing="sm" placeholder="Search shift templates..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} className="text-xs" />
          </div>
          <Button color="blue" size="xs" onClick={() => setIsShiftModalOpen(true)} className="font-black uppercase text-[10px] rounded-lg">
            <Plus size={14} className="mr-1" /> Create Shift Template
          </Button>
          <Button color="indigo" size="xs" onClick={() => setIsAssignModalOpen(true)} className="font-black uppercase text-[10px] rounded-lg">
            <Clock size={14} className="mr-1" /> Assign Roster
          </Button>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Shift Template</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Start Time</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">End Time</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Duration</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Assigned Staff</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filtered.map((s, idx) => (
              <TableRow key={s.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">{s.name}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-mono">{s.startTime}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-mono">{s.endTime}</TableCell>
                <TableCell className="px-4 py-3 text-xs font-bold">{s.duration}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge color="info" className="text-[8px] uppercase">{s.employeesCount} Personnel</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <ShiftScheduleModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} year={new Date().getFullYear()} />
      <ScheduleAssignmentModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={async () => {}} />
    </div>
  );
};

export default SchedulingModule;
