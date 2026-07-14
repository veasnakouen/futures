"use client";
import React, { useState } from "react";
import { Clock, Layers, CalendarDays, Calendar as CalendarIcon, Edit2, Trash2, Plus, Users } from "lucide-react";
import { TimetableFormModal } from "@/features/hr/components/TimetableFormModal";
import { HolidayFormModal } from "@/features/hr/components/HolidayFormModal";
import { ScheduleAssignmentModal } from "@/features/hr/components/ScheduleAssignmentModal";
import { useTimetable } from "@/hooks/useTimetable";
import { useHoliday } from "@/hooks/useHoliday";

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState("maintenance");

  // Modal states
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { useTimetables } = useTimetable();
  const { data: timetables = [] } = useTimetables();

  const { useHolidays } = useHoliday();
  const { data: holidays = [] } = useHolidays();

  const [schedules, setSchedules] = useState([
    { id: 1, employeeId: "EMP-001", employeeName: "Koeun Veasna", shiftId: "SHIFT-3", shiftName: "Full Day", dateFrom: "2026-07-01", dateTo: "2026-07-31" }
  ]);

  const tabs = [
    { id: "maintenance", label: "Shift Timetable Maintenance", icon: Clock },
    { id: "management", label: "Shift Management", icon: Layers },
    { id: "schedule", label: "Schedule Employee", icon: CalendarDays },
    { id: "holidays", label: "System Holidays / ថ្ងៃឈប់សម្រាក", icon: CalendarIcon },
  ];

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto text-white pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">កាលវិភាគការងារ / Timetable</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          MANAGE SHIFTS, SCHEDULES, AND HOLIDAYS
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-2 mb-6 flex flex-wrap gap-2 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all ${
                isActive
                  ? tab.id === "holidays"
                    ? "bg-white text-rose-600 shadow-sm border border-rose-100" // Special styling for holidays tab
                    : "bg-white text-[#0f172a] shadow-sm border border-gray-200"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <tab.icon size={18} className={isActive && tab.id === "holidays" ? "text-rose-600" : ""} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-6 shadow-sm min-h-[500px]">
        {/* TAB: TIMETABLE MAINTENANCE */}
        {activeTab === "maintenance" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Shift Timetable Maintenance</h2>
              <button 
                onClick={() => setIsTimetableModalOpen(true)}
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Timetable
              </button>
            </div>
            
            <div className="overflow-x-auto border border-gray-700/50 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f172a]/50 border-b border-gray-700/50">
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timetable Name</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">On Duty Time</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Off Duty Time</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Late Time (Min)</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Leave Early Time (Min)</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {timetables.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-bold text-sm">{t.name}</td>
                      <td className="px-5 py-4 font-mono text-sm text-blue-400">{t.onDutyTime}</td>
                      <td className="px-5 py-4 font-mono text-sm text-blue-400">{t.offDutyTime}</td>
                      <td className="px-5 py-4 font-bold text-sm">{t.lateTime}</td>
                      <td className="px-5 py-4 font-bold text-sm">{t.leaveEarlyTime}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-gray-400 hover:text-white mr-3 transition-colors"><Edit2 size={16}/></button>
                        <button className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SHIFT MANAGEMENT */}
        {activeTab === "management" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Shift Management</h2>
              <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm">
                <Plus size={16} /> Add Shift
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Shift Card */}
              <div className="bg-[#0f172a] border border-gray-700 p-5 rounded-xl flex flex-col gap-3 group hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">Full Day Shift</h3>
                    <p className="text-xs text-gray-400 mt-1">Monday - Friday</p>
                  </div>
                  <button className="text-gray-500 hover:text-white"><Edit2 size={16}/></button>
                </div>
                <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">AM Session</span>
                    <span className="font-mono text-blue-400">08:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">PM Session</span>
                    <span className="font-mono text-blue-400">13:00 - 17:00</span>
                  </div>
                </div>
              </div>

              {/* Shift Card 2 */}
              <div className="bg-[#0f172a] border border-gray-700 p-5 rounded-xl flex flex-col gap-3 group hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">Morning Shift</h3>
                    <p className="text-xs text-gray-400 mt-1">Saturday Only</p>
                  </div>
                  <button className="text-gray-500 hover:text-white"><Edit2 size={16}/></button>
                </div>
                <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">AM Session</span>
                    <span className="font-mono text-blue-400">08:00 - 12:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SCHEDULE EMPLOYEE */}
        {activeTab === "schedule" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Schedule Employee</h2>
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
              >
                <Plus size={16} /> Assign Schedule
              </button>
            </div>
            
            <div className="overflow-x-auto border border-gray-700/50 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f172a]/50 border-b border-gray-700/50">
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Shift</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valid From</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valid To</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{s.employeeName}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.employeeId}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                          <Layers size={12} /> {s.shiftName}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-300">{s.dateFrom}</td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-300">{s.dateTo}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-gray-400 hover:text-white mr-3 transition-colors"><Edit2 size={16}/></button>
                        <button className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SYSTEM HOLIDAYS */}
        {activeTab === "holidays" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">System Holidays</h2>
              <button 
                onClick={() => setIsHolidayModalOpen(true)}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Holiday
              </button>
            </div>
            
            <div className="overflow-x-auto border border-gray-700/50 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f172a]/50 border-b border-gray-700/50">
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Holiday Name</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {holidays.map((h) => (
                    <tr key={h.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-bold text-sm text-rose-400">{h.eventDate}</td>
                      <td className="px-5 py-4 font-bold text-sm text-white">{h.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{h.description}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-gray-400 hover:text-white mr-3 transition-colors"><Edit2 size={16}/></button>
                        <button className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {holidays.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                        No holidays added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TimetableFormModal 
        isOpen={isTimetableModalOpen} 
        onClose={() => setIsTimetableModalOpen(false)} 
      />

      <HolidayFormModal 
        isOpen={isHolidayModalOpen} 
        onClose={() => setIsHolidayModalOpen(false)} 
      />

      <ScheduleAssignmentModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        onSave={(data) => {
          setSchedules([...schedules, { 
            id: Date.now(), 
            ...data, 
            employeeName: "Mock Employee", 
            shiftName: "Mock Shift" 
          }]);
          setIsScheduleModalOpen(false);
        }} 
      />

    </div>
  );
}
