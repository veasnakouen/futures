import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Spinner} from '@/lib/flowbite-compat';
import {
  CalendarCheck,
  ShieldCheck,
  Activity,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useScheduling } from "../../../hooks/useScheduling";
import { ShiftScheduleModal } from "./ShiftScheduleModal";
import { ShiftScheduleDto } from "../../../services/scheduleService";
import { Select } from "@/lib/flowbite-compat";

const SchedulingModule: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ShiftScheduleDto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { useYearSchedules, useDeleteSchedule } = useScheduling();
  const { data: shifts = [], isLoading: loading } = useYearSchedules(selectedYear);
  const deleteMutation = useDeleteSchedule(selectedYear);

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const openModal = (schedule: ShiftScheduleDto | null = null) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const getShiftBadgeColor = (shift?: string) => {
    if (!shift || shift === "Off") return "gray";
    const s = shift.toLowerCase();
    if (s.includes("morning")) return "success";
    if (s.includes("afternoon") || s.includes("full")) return "info";
    if (s.includes("night")) return "purple";
    return "gray";
  };

  const calcTotalYearAl = (shift: ShiftScheduleDto) => {
    return (shift.janAlDays || 0) +
           (shift.febAlDays || 0) +
           (shift.marAlDays || 0) +
           (shift.aprAlDays || 0) +
           (shift.mayAlDays || 0) +
           (shift.junAlDays || 0) +
           (shift.julAlDays || 0) +
           (shift.augAlDays || 0) +
           (shift.sepAlDays || 0) +
           (shift.octAlDays || 0) +
           (shift.novAlDays || 0) +
           (shift.decAlDays || 0);
  };

  // Calculate coverage for a specific shift type across all months
  const calcCoverage = (shiftType: string) => {
    if (shifts.length === 0) return 0;
    let count = 0;
    shifts.forEach((s) => {
      if (s.janShift === shiftType) count++;
      if (s.febShift === shiftType) count++;
      if (s.marShift === shiftType) count++;
      if (s.aprShift === shiftType) count++;
      if (s.mayShift === shiftType) count++;
      if (s.junShift === shiftType) count++;
      if (s.julShift === shiftType) count++;
      if (s.augShift === shiftType) count++;
      if (s.sepShift === shiftType) count++;
      if (s.octShift === shiftType) count++;
      if (s.novShift === shiftType) count++;
      if (s.decShift === shiftType) count++;
    });
    // total slots possible = shifts.length * 12 months
    const maxSlots = shifts.length * 12;
    if (maxSlots === 0) return 0;
    const coverage = (count / (maxSlots / 3)) * 100;
    return Math.min(Math.round(coverage), 100);
  };

  const mCoverage = calcCoverage("Morning");
  const aCoverage = calcCoverage("Afternoon");
  const nCoverage = calcCoverage("Night");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Scheduling Matrix...
        </p>
      </div>
    );
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthKeys = ["janShift", "febShift", "marShift", "aprShift", "mayShift", "junShift", "julShift", "augShift", "sepShift", "octShift", "novShift", "decShift"] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Yearly Shift & Roster Planner
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Macro-level Workforce Rotation Node
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-32 font-black text-sm"
          >
            {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
          <Button
            color="blue"
            size="sm"
            className="rounded-md shadow-lg shadow-blue-500/20 text-xs font-black uppercase transition-all hover:scale-105"
            onClick={() => openModal()}
          >
            <Plus size={14} className="mr-2" /> Add Staff Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <CalendarCheck size={20} className="text-blue-600" /> Yearly Shift Plan ({selectedYear})
          </h4>
          <div className="overflow-x-auto">
            <Table hoverable className="border-none">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="py-4">Staff Member</TableHeadCell>
                {months.map(m => (
                  <TableHeadCell key={m} className="py-4 px-2 text-center">{m}</TableHeadCell>
                ))}
                <TableHeadCell className="py-4 text-center text-blue-500">Total AL</TableHeadCell>
                <TableHeadCell className="py-4 text-right">Actions</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {shifts.map((shift, idx) => (
                  <TableRow
                    key={shift.id || idx}
                    className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  >
                    <TableCell className="font-black dark:text-white text-xs py-4 whitespace-nowrap">
                      {shift.employeeName || shift.employeeId}
                    </TableCell>
                    {monthKeys.map((key, mIdx) => {
                      const pattern = shift[key] || "Off";
                      // We map monthKeys index to AL keys
                      const alKeys = ["janAlDays", "febAlDays", "marAlDays", "aprAlDays", "mayAlDays", "junAlDays", "julAlDays", "augAlDays", "sepAlDays", "octAlDays", "novAlDays", "decAlDays"] as const;
                      const alDays = shift[alKeys[mIdx]] || 0;

                      return (
                        <TableCell key={key} className="py-4 px-2 text-center align-top min-w-[100px]">
                          {pattern === "Off" || pattern === "None" || !pattern ? (
                            <div className="text-gray-300 dark:text-gray-600 font-black h-4 flex items-center justify-center">—</div>
                          ) : (
                            <Badge
                              color={getShiftBadgeColor(pattern)}
                              className="w-auto mx-auto justify-center rounded-md text-[9px] font-black uppercase whitespace-nowrap px-2"
                            >
                              {pattern}
                            </Badge>
                          )}
                          {alDays > 0 && (
                            <div className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 break-words max-w-[120px] mx-auto">
                              AL: {alDays} Day{alDays !== 1 ? 's' : ''}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="py-4 text-center align-top whitespace-nowrap">
                      {(() => {
                        const total = calcTotalYearAl(shift);
                        return total > 0 ? (
                          <div className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md inline-block border border-blue-100 dark:border-blue-800">
                            {total} Days
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 font-bold">—</span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="py-4 text-right align-top whitespace-nowrap">
                      <Button
                        color="light"
                        size="xs"
                        className="inline-flex mr-2 text-blue-500 hover:text-blue-600 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => openModal(shift)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        className="inline-flex text-red-500 hover:text-red-600 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => shift.id && handleDelete(shift.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {shifts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                      No shift plans found for {selectedYear}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <ShieldCheck size={20} className="text-emerald-500" /> Coverage Metrics
          </h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Morning Shift</span>
                <span className={mCoverage >= 90 ? "text-emerald-500" : "text-amber-500"}>
                  {mCoverage}% {mCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${mCoverage}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Afternoon Shift</span>
                <span className={aCoverage >= 90 ? "text-blue-500" : "text-amber-500"}>
                  {aCoverage}% {aCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${aCoverage}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                <span className="text-gray-400">Night Shift</span>
                <span className={nCoverage >= 90 ? "text-purple-500" : "text-amber-500"}>
                  {nCoverage}% {nCoverage >= 90 ? "Optimal" : "Caution"}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.3)]" style={{ width: `${nCoverage}%` }}></div>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                System coverage is evaluated for {selectedYear}. Ensure backup nodes are on standby for sudden rotation adjustments.
              </p>
              <Button
                color="light"
                size="xs"
                onClick={() => toast.success("Running AI Optimizer on Roster", { icon: "🤖" })}
                className="w-full rounded-md shadow-sm font-black uppercase tracking-widest text-[10px] border-none hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Launch Roster Optimizer
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ShiftScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        year={selectedYear}
        initialData={editingSchedule}
      />

      {/* Ultra-Premium Confirmation Modal */}
      {deleteConfirmId !== null && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200" onClick={() => setDeleteConfirmId(null)}></div>
          
          <div className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-[400px] z-10 transform scale-100 animate-in zoom-in-95 duration-200 overflow-hidden relative">
            
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-rose-500 to-red-500"></div>

            <div className="p-8 pt-10 flex flex-col items-center relative">
              
              {/* Animated Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-20 h-20 rounded-full bg-rose-50 border-[6px] border-white shadow-xl flex items-center justify-center z-10">
                  <Trash2 className="text-rose-500" size={32} strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Delete Schedule?</h3>
              <p className="text-center text-slate-500 font-medium leading-relaxed mb-8 px-2 text-[15px]">
                You are about to permanently delete this schedule. This action cannot be reversed. Are you absolutely sure?
              </p>
              
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-[15px]"
                >
                  Keep it
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_-10px_rgba(225,29,72,0.5)] hover:shadow-[0_10px_25px_-8px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 text-[15px]"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SchedulingModule;
