import React, { useState, useEffect } from "react";
import { X, Users, Calendar as CalendarIcon, Clock, Building2 } from "lucide-react";
import { Modal, Datepicker } from "@/lib/flowbite-compat";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, assignmentType: "employee" | "department") => void;
}

const shiftOptions = [
  { value: "Off", label: "Off" },
  { value: "TimeTable AM (08:00 - 12:00)", label: "TimeTable AM (08:00 - 12:00)" },
  { value: "TimeTable PM (13:00 - 17:00)", label: "TimeTable PM (13:00 - 17:00)" },
  { value: "Full Day (08:00 - 17:00)", label: "Full Day (08:00 - 17:00)" }
];

export const ScheduleAssignmentModal: React.FC<ScheduleAssignmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  const [assignmentType, setAssignmentType] = useState<"employee" | "department">("employee");
  
  const [targetId, setTargetId] = useState(""); // either employeeId or departmentId
  const [weekStartDate, setWeekStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // 7-day AM/PM split grid state
  const [schedulePattern, setSchedulePattern] = useState({
    mondayShift: { am: "TimeTable AM (08:00 - 12:00)", pm: "TimeTable PM (13:00 - 17:00)" },
    tuesdayShift: { am: "TimeTable AM (08:00 - 12:00)", pm: "TimeTable PM (13:00 - 17:00)" },
    wednesdayShift: { am: "TimeTable AM (08:00 - 12:00)", pm: "TimeTable PM (13:00 - 17:00)" },
    thursdayShift: { am: "TimeTable AM (08:00 - 12:00)", pm: "TimeTable PM (13:00 - 17:00)" },
    fridayShift: { am: "TimeTable AM (08:00 - 12:00)", pm: "TimeTable PM (13:00 - 17:00)" },
    saturdayShift: { am: "Off", pm: "Off" },
    sundayShift: { am: "Off", pm: "Off" },
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSave = () => {
    // Format the nested {am, pm} objects into the string "AM: [am] | PM: [pm]"
    const formattedPattern = {
      mondayShift: `AM: ${schedulePattern.mondayShift.am} | PM: ${schedulePattern.mondayShift.pm}`,
      tuesdayShift: `AM: ${schedulePattern.tuesdayShift.am} | PM: ${schedulePattern.tuesdayShift.pm}`,
      wednesdayShift: `AM: ${schedulePattern.wednesdayShift.am} | PM: ${schedulePattern.wednesdayShift.pm}`,
      thursdayShift: `AM: ${schedulePattern.thursdayShift.am} | PM: ${schedulePattern.thursdayShift.pm}`,
      fridayShift: `AM: ${schedulePattern.fridayShift.am} | PM: ${schedulePattern.fridayShift.pm}`,
      saturdayShift: `AM: ${schedulePattern.saturdayShift.am} | PM: ${schedulePattern.saturdayShift.pm}`,
      sundayShift: `AM: ${schedulePattern.sundayShift.am} | PM: ${schedulePattern.sundayShift.pm}`,
    };

    const payload = {
      [assignmentType === "employee" ? "employeeId" : "departmentId"]: targetId,
      weekStartDate,
      ...formattedPattern
    };
    onSave(payload, assignmentType);
  };

  const handleShiftChange = (day: keyof typeof schedulePattern, session: "am" | "pm", val: string) => {
    setSchedulePattern(prev => ({ 
      ...prev, 
      [day]: { ...prev[day], [session]: val } 
    }));
  };

  const days = [
    { key: "mondayShift" as const, label: "Monday" },
    { key: "tuesdayShift" as const, label: "Tuesday" },
    { key: "wednesdayShift" as const, label: "Wednesday" },
    { key: "thursdayShift" as const, label: "Thursday" },
    { key: "fridayShift" as const, label: "Friday" },
    { key: "saturdayShift" as const, label: "Saturday" },
    { key: "sundayShift" as const, label: "Sunday" },
  ];

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="2xl" // Increased size for the 7-day grid
      className="[&_.fixed.inset-0]:bg-black/60 [&_.fixed.inset-0]:backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col max-h-[90vh] bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5"
      >
        
        {/* ── Header ── */}
        <div className="shrink-0 relative flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-[#7a2323] to-[#c53030]" />
          <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2 pl-2 tracking-tight">
            <CalendarIcon size={18} className="text-[#c53030]" />
            {t("assignSchedule")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Assignment Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl relative">
            <button
              onClick={() => { setAssignmentType("employee"); setTargetId(""); }}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all z-10 ${
                assignmentType === "employee" 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {assignmentType === "employee" && (
                <motion.div
                  layoutId="assignment-type-indicator"
                  className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Users size={16} /> Individual Employee
            </button>
            <button
              onClick={() => { setAssignmentType("department"); setTargetId(""); }}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all z-10 ${
                assignmentType === "department" 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {assignmentType === "department" && (
                <motion.div
                  layoutId="assignment-type-indicator"
                  className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Building2 size={16} /> Entire Department
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={assignmentType}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                    {assignmentType === "employee" ? "Select Employee" : "Select Department"}
                  </label>
                  <div className="relative">
                    {assignmentType === "employee" ? (
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    ) : (
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                    
                    <select
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-semibold"
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                    >
                      <option value="">-- {t("select")} --</option>
                      {assignmentType === "employee" ? (
                        <>
                          <option value="EMP-001">Koeun Veasna</option>
                          <option value="EMP-002">Sok San</option>
                          <option value="EMP-003">Chan Dara</option>
                        </>
                      ) : (
                        <>
                          <option value="1">IT Department</option>
                          <option value="2">Human Resources</option>
                          <option value="3">Operations</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                    Week Start Date (Monday)
                  </label>
                  <Datepicker
                    className="w-full"
                    value={weekStartDate}
                    onChange={(e: any) => setWeekStartDate(e.target ? e.target.value : e)}
                  />
                </div>
              </div>

              {/* 7-Day Grid */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-blue-500"/> Daily Shift Schedule
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {/* Notice we removed AnimatePresence here, since the parent is already animating */}
                  {days.map((day, index) => (
                    <motion.div 
                      key={day.key} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-sm transition-all"
                    >
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-1 mb-1 flex items-center justify-between">
                        {day.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-500 w-5">AM</span>
                        <select
                          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded text-[11px] font-semibold text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 p-1 cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800"
                          value={schedulePattern[day.key].am}
                          onChange={(e) => handleShiftChange(day.key, "am", e.target.value)}
                        >
                          {shiftOptions.map(opt => (
                            <option key={`am-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-rose-500 w-5">PM</span>
                        <select
                          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded text-[11px] font-semibold text-gray-900 dark:text-white focus:ring-1 focus:ring-rose-500 p-1 cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800"
                          value={schedulePattern[day.key].pm}
                          onChange={(e) => handleShiftChange(day.key, "pm", e.target.value)}
                        >
                          {shiftOptions.map(opt => (
                            <option key={`pm-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!targetId}
            className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#7a2323] to-[#c53030] hover:from-[#5c1a1a] hover:to-[#a32828] rounded-xl transition-all shadow-md shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assignmentType === "department" ? "Bulk Assign" : t("assign")}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};
