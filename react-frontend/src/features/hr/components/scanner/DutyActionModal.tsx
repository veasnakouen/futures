import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Zap,
  Coffee,
  CheckCircle,
  LogOut,
  Flame,
  X,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { ActionType, OFFICE_BRANCHES } from "./scannerTypes";
import { format } from "date-fns";

interface DutyActionModalProps {
  isOpen: boolean;
  actionType: ActionType;
  onClose: () => void;
  onConfirm: (payload: {
    action: ActionType;
    breakDuration?: number;
    emergencyWard?: string;
    emergencyNote?: string;
    handoverNotes?: string;
  }) => void;
  user: any;
  shiftStartTime: Date | null;
  breakStartTime: Date | null;
  currentTime: Date;
  location: any;
  nearestBranch: any;
}

export default function DutyActionModal({
  isOpen,
  actionType,
  onClose,
  onConfirm,
  user,
  shiftStartTime,
  breakStartTime,
  currentTime,
  location,
  nearestBranch,
}: DutyActionModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  const [breakDuration, setBreakDuration] = useState<number>(60);
  const [emergencyWard, setEmergencyWard] = useState<string>("ER / Trauma Unit");
  const [emergencyPriority, setEmergencyPriority] = useState<string>("STAT High Priority");
  const [emergencyNote, setEmergencyNote] = useState<string>("");
  const [handoverNotes, setHandoverNotes] = useState<string>("");

  const calculateShiftStats = () => {
    if (!shiftStartTime) {
      return { totalHours: "0h 00m", breakHours: "0m", netHours: "0h 00m" };
    }
    const diffMs = currentTime.getTime() - shiftStartTime.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    const breakMs = breakStartTime ? currentTime.getTime() - breakStartTime.getTime() : 45 * 60000;
    const breakMins = Math.floor(breakMs / 60000);

    const netMs = Math.max(0, diffMs - breakMs);
    const netH = Math.floor(netMs / 3600000);
    const netM = Math.floor((netMs % 3600000) / 60000);

    return {
      totalHours: `${hours}h ${minutes}m`,
      breakHours: `${breakMins}m`,
      netHours: `${netH}h ${netM}m`,
    };
  };

  const stats = calculateShiftStats();

  const handleExecute = () => {
    onConfirm({
      action: actionType,
      breakDuration,
      emergencyWard,
      emergencyNote: `[${emergencyPriority}] ${emergencyWard} ${emergencyNote ? "- " + emergencyNote : ""}`,
      handoverNotes,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 relative overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
            actionType === "CLOCK_IN"
              ? "from-blue-600 to-indigo-600"
              : actionType === "BREAK_START"
              ? "from-amber-500 to-orange-600"
              : actionType === "BREAK_END"
              ? "from-emerald-500 to-teal-600"
              : actionType === "CLOCK_OUT"
              ? "from-rose-600 to-red-600"
              : "from-purple-600 to-pink-600"
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <X size={20} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${
              actionType === "CLOCK_IN"
                ? "bg-blue-600"
                : actionType === "BREAK_START"
                ? "bg-amber-600"
                : actionType === "BREAK_END"
                ? "bg-emerald-600"
                : actionType === "CLOCK_OUT"
                ? "bg-rose-600"
                : "bg-purple-600"
            }`}
          >
            {actionType === "CLOCK_IN" && <Zap size={28} />}
            {actionType === "BREAK_START" && <Coffee size={28} />}
            {actionType === "BREAK_END" && <CheckCircle size={28} />}
            {actionType === "CLOCK_OUT" && <LogOut size={28} />}
            {actionType === "ON_CALL" && <Flame size={28} />}
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Enterprise Duty Authorization
            </span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
              {actionType === "CLOCK_IN" && "Clock In (Duty Start)"}
              {actionType === "BREAK_START" && "Lunch / Meal Break Start"}
              {actionType === "BREAK_END" && "Resume Duty Shift"}
              {actionType === "CLOCK_OUT" && "Clock Out (Shift Summary)"}
              {actionType === "ON_CALL" && "Emergency On-Call Check-In"}
            </h3>
          </div>
        </div>

        {/* Staff Verification Badge */}
        <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
              {user?.username?.substring(0, 2)?.toUpperCase() || "ST"}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{user?.username || "Staff Member"}</p>
              <p className="text-[10px] font-semibold text-gray-500">ID: {user?.id || "EMP-9021"} • Clinical Staff</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 block">Location Verified</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <MapPin size={12} /> {nearestBranch.name}
            </span>
          </div>
        </div>

        {/* Action Specific Input Controls */}

        {/* 1. EMERGENCY ON-CALL */}
        {actionType === "ON_CALL" && (
          <div className="space-y-4 bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/50">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black text-xs">
              <AlertTriangle size={16} /> Urgent Medical Callout Configuration
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 block mb-1">
                Target Ward / Clinical Unit
              </label>
              <select
                value={emergencyWard}
                onChange={(e) => setEmergencyWard(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
              >
                <option value="ER / Trauma Unit">ER / Emergency Trauma Unit</option>
                <option value="ICU / Critical Care">ICU / Intensive Care Unit</option>
                <option value="Surgical Operating Theater">Surgical Operating Theater (OR)</option>
                <option value="Labor & Delivery">Labor & Delivery Ward</option>
                <option value="On-Call Physician Callout">On-Call Physician Callout</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 block mb-1">
                Dispatch Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["STAT High Priority", "Urgent Response", "Standard Rotation"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEmergencyPriority(p)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      emergencyPriority === p
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 block mb-1">
                Case ID / Emergency Brief (Optional)
              </label>
              <input
                type="text"
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                placeholder="e.g., Code Blue Response Room 402"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* 2. LUNCH / BREAK START */}
        {actionType === "BREAK_START" && (
          <div className="space-y-4 bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-black text-xs">
              <Coffee size={16} /> Select Official Break Allowance
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { mins: 30, label: "30 Mins", desc: "Express Rest" },
                { mins: 45, label: "45 Mins", desc: "Standard Meal" },
                { mins: 60, label: "60 Mins", desc: "Full Lunch" },
              ].map((b) => (
                <button
                  key={b.mins}
                  type="button"
                  onClick={() => setBreakDuration(b.mins)}
                  className={`p-3 rounded-2xl text-center transition-all ${
                    breakDuration === b.mins
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="text-base font-black">{b.label}</div>
                  <div className="text-[9px] font-semibold opacity-80">{b.desc}</div>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
              ⚠️ Live break timer will display on your top header. Click <strong>RESUME DUTY</strong> when returning to active clinical shift.
            </p>
          </div>
        )}

        {/* 3. CLOCK OUT SHIFT SUMMARY RECEIPT */}
        {actionType === "CLOCK_OUT" && (
          <div className="space-y-4 bg-rose-50/50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/50">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-xs">
              <FileText size={16} /> Today's Completed Shift Receipt Breakdown
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Total Shift</span>
                <span className="text-sm font-black text-gray-900 dark:text-white">{stats.totalHours}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Meal Break</span>
                <span className="text-sm font-black text-amber-600">{stats.breakHours}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Net Payable</span>
                <span className="text-sm font-black text-emerald-600">{stats.netHours}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 block mb-1">
                End-of-Shift Clinical Handover Notes (Optional)
              </label>
              <textarea
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="e.g., Handed over ICU Ward Bed 12-16 to Nurse Sothea. All patient vitals stable."
                rows={2}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-xs font-bold text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            className={`flex-1 py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              actionType === "CLOCK_IN"
                ? "bg-blue-600 hover:bg-blue-700"
                : actionType === "BREAK_START"
                ? "bg-amber-600 hover:bg-amber-700"
                : actionType === "BREAK_END"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : actionType === "CLOCK_OUT"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <ShieldCheck size={16} /> Confirm & Log Authorization
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
