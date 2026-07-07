"use client";
import React, { useState } from "react";
import { useAttendance } from "@/hooks/useHR";
import { Edit2, Trash2, Search, Plus, Clock, Filter, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import ManualAttendanceModal from "@/features/hr/components/ManualAttendanceModal";

export default function AttendanceLogsPage() {
  const { data: globalAttendance = [], isLoading } = useAttendance();
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    const lower = status.toLowerCase();

    if (lower.includes("late & early")) {
      return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider whitespace-nowrap border border-rose-200 shadow-sm text-center">
          យឺត & <br /> ចេញមុន / <br /> LATE & <br /> EARLY
        </span>
      );
    }
    if (lower.includes("late")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-amber-200 shadow-sm text-center">
          មកយឺត / <br /> LATE
        </span>
      );
    }
    if (lower.includes("present") || lower.includes("on_time")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1. rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-emerald-200 shadow-sm">
          ទាន់ពេល / <br /> ON TIME
        </span>
      );
    }

    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-gray-200 shadow-sm">
        {status}
      </span>
    );
  };

  return (
    <div className="animate-fade-in text-white max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">គ្រប់គ្រងវត្តមានបុគ្គលិក / Attendance Management</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            AUDIT, CORRECT, OR MANUALLY RECORD CHECK-IN/OUT LOGS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
            <Clock size={16} /> ភ្លេចស្កេនចូល/ចេញ / Forgot Clock-In/Out
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={16} /> ចុះវត្តមានដោយដៃ / Manual Attendance
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ការិយាល័យ / Department</label>
            <select
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">-- បង្ហាញទាំងអស់ --</option>
              <option value="IT">IT</option>
              <option value="Administration">Administration</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ជ្រើសរើសបុគ្គលិក / Employee</label>
            <select
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="">-- បង្ហាញទាំងអស់ --</option>
              {Array.from(new Set(globalAttendance.map(a => a.employeeName || (a.employee && a.employee.firstNameEnglish + ' ' + a.employee.lastNameEnglish)))).filter(Boolean).map(name => (
                <option key={name as string} value={name as string}>{name as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ចាប់ពីថ្ងៃ / Date From</label>
            <input
              type="date"
              className="w-full bg-[#0f172a] border border-gray-700 text-gray-400 rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">រហូតដល់ថ្ងៃ / Date To</label>
            <input
              type="date"
              className="w-full bg-[#0f172a] border border-gray-700 text-gray-400 rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-700/50 flex items-center gap-3">
          <Clock className="text-blue-500" size={20} />
          <h2 className="text-lg font-bold text-white">ប្រវត្តិនៃការចុះវត្តមានសរុប / Attendance Scan History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 border-b border-gray-700/50">
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">បុគ្គលិក / Employee</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">ការិយាល័យ /<br />Department</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">កាល<br />បរិច្ឆេទ /<br />Date</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">កាលវិភាគ /<br />Timetable</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">ម៉ោងចូល /<br />Check-<br />In</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">ម៉ោងចេញ<br />/ Check-<br />Out</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap">ម៉ោង<br />ការងារ /<br />Work<br />Hours</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap text-center">ស្ថានភាព /<br />Status</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 whitespace-nowrap text-right">សកម្មភាព /<br />Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-400">Loading attendance data...</td>
                </tr>
              ) : globalAttendance.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-400">No attendance records found.</td>
                </tr>
              ) : (
                globalAttendance.map((log, index) => {
                  const empName = log.employee ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}` : log.employeeName;
                  const empEmail = log.employee?.email || `${empName?.toLowerCase().replace(/\s/g, '')}@gmail.com`;

                  // Calculate mock hours for UI purposes if missing
                  let workHours = "0.0 hrs";
                  if (log.clockIn && log.clockOut) {
                    const inTime = new Date(log.clockIn);
                    const outTime = new Date(log.clockOut);
                    const diffMs = outTime.getTime() - inTime.getTime();
                    workHours = (diffMs / (1000 * 60 * 60)).toFixed(1) + " hrs";
                  } else if (log.clockIn) {
                    workHours = "In Progress";
                  }

                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-[13px]">{log.employee?.idNo || `MT-00${index + 1}`} {empName}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{empEmail}</div>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-gray-300">
                        {log.employee?.department?.name || log.employee?.department || "IT"}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-gray-300">
                        {log.clockIn ? format(new Date(log.clockIn), "MMM d, yyyy") : "---"}
                      </td>
                      <td className="px-5 py-4 text-[12px] font-bold text-gray-300">
                        TimeTable<br />PM (13:00 -<br />17:00)
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-white">
                        {log.clockIn ? format(new Date(log.clockIn), "HH:mm") : "---"}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-white">
                        {log.clockOut ? format(new Date(log.clockOut), "HH:mm") : "---"}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-gray-300">
                        {workHours}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-gray-500 hover:text-white transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-rose-500 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ManualAttendanceModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        employees={[]}
        handleSubmit={(data) => {
          console.log("Manual attendance data submitted:", data);
          setIsManualModalOpen(false);
        }}
      />
    </div>
  );
}
