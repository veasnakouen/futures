import React, { useState } from "react";
import { Button, TextInput, Select } from '@/lib/flowbite-compat';
import { Clock, Calendar, Search, Filter, Server, Plus, BarChart3 } from "lucide-react";

import { TimetableFormModal } from "./TimetableFormModal";
import { ScheduleAssignmentModal } from "./ScheduleAssignmentModal";
import { HolidayFormModal } from "./HolidayFormModal";
import { useTimetable } from "@/hooks/useTimetable";

import AttendanceMatrixTab from "./attendance/AttendanceMatrixTab";
import AttendanceSchedulesTab from "./attendance/AttendanceSchedulesTab";
import AttendanceReportsTab from "./attendance/AttendanceReportsTab";

interface AttendanceModuleProps {
  globalAttendance: any[];
  onManualLog?: () => void;
  onOpenDeviceManager?: () => void;
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  globalAttendance,
  onManualLog,
  onOpenDeviceManager,
}) => {
  const [subTab, setSubTab] = useState<"MATRIX" | "SCHEDULE" | "REPORTS">("MATRIX");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isAssignScheduleModalOpen, setIsAssignScheduleModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  const { useTimetables } = useTimetable();
  const { data: timetables = [] } = useTimetables();

  const safeAttendance = Array.isArray(globalAttendance) ? globalAttendance : [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 shrink-0">
          {[
            { id: "MATRIX", label: "Attendance Logs", icon: <Clock size={13} /> },
            { id: "SCHEDULE", label: "Shift Roster", icon: <Calendar size={13} /> },
            { id: "REPORTS", label: "Audit Reports", icon: <BarChart3 size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                subTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          {subTab === "MATRIX" && (
            <>
              <div className="relative w-48">
                <TextInput
                  sizing="sm"
                  placeholder="Search logs..."
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  icon={Search}
                  className="text-xs"
                />
              </div>
              <Select
                sizing="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs w-36"
              >
                <option value="">All Statuses</option>
                <option value="On Time">On Time</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </Select>
            </>
          )}

          <div className="flex gap-2 shrink-0">
            {onOpenDeviceManager && (
              <Button color="indigo" size="xs" onClick={onOpenDeviceManager} className="font-black uppercase text-[10px] rounded-lg">
                <Server size={14} className="mr-1" /> Biometric Nodes
              </Button>
            )}
            {onManualLog && (
              <Button color="blue" size="xs" onClick={onManualLog} className="font-black uppercase text-[10px] rounded-lg">
                <Plus size={14} className="mr-1" /> Manual Clock Log
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {subTab === "MATRIX" && (
        <AttendanceMatrixTab
          attendanceData={safeAttendance}
          searchQuery={matrixSearch}
          statusFilter={statusFilter}
        />
      )}

      {subTab === "SCHEDULE" && (
        <AttendanceSchedulesTab
          timetables={timetables}
          onOpenTimetableModal={() => setIsTimetableModalOpen(true)}
          onOpenAssignModal={() => setIsAssignScheduleModalOpen(true)}
        />
      )}

      {subTab === "REPORTS" && (
        <AttendanceReportsTab attendanceData={safeAttendance} />
      )}

      {/* Modals */}
      <TimetableFormModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
      />
      <ScheduleAssignmentModal
        isOpen={isAssignScheduleModalOpen}
        onClose={() => setIsAssignScheduleModalOpen(false)}
        onSave={async () => {}}
      />
      <HolidayFormModal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
      />
    </div>
  );
};

export default AttendanceModule;
