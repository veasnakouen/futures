import React from "react";
import { ShieldCheck, Flame, Clock, Zap, Coffee, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ScannerHeaderBannerProps {
  user: any;
  employeeId?: number | null;
  currentTime: Date;
  shiftStartTime: Date | null;
  dutyStatus?: "ON_DUTY" | "OFF_DUTY" | "ON_BREAK" | "ON_EMERGENCY";
  breakStartTime?: Date | null;
  emergencyStartTime?: Date | null;
  emergencyDetails?: string | null;
}

export default function ScannerHeaderBanner({
  user,
  employeeId,
  currentTime,
  shiftStartTime,
  dutyStatus = "ON_DUTY",
  breakStartTime,
  emergencyStartTime,
  emergencyDetails,
}: ScannerHeaderBannerProps) {
  const getElapsedShiftTimeString = () => {
    if (dutyStatus === "OFF_DUTY" || !shiftStartTime) return "Shift Off-Duty";
    const diffMs = currentTime.getTime() - shiftStartTime.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getElapsedBreakTimeString = () => {
    if (!breakStartTime) return "00m 00s";
    const diffMs = currentTime.getTime() - breakStartTime.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getElapsedEmergencyTimeString = () => {
    if (!emergencyStartTime) return "00m 00s";
    const diffMs = currentTime.getTime() - emergencyStartTime.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-gradient-to-r from-gray-950 via-indigo-950 to-gray-950 rounded-3xl p-6 text-white shadow-2xl border border-gray-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-3 relative z-10 max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30 flex items-center gap-1.5">
            <ShieldCheck size={12} /> Enterprise Attendance & Geofence Terminal
          </span>

          {/* Dynamic Real-time Duty Status Badge */}
          {dutyStatus === "ON_DUTY" && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
              <Zap size={12} /> Duty Shift Active
            </span>
          )}
          {dutyStatus === "ON_BREAK" && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
              <Coffee size={12} /> On Meal Break
            </span>
          )}
          {dutyStatus === "ON_EMERGENCY" && (
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest border border-purple-500/30 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={12} /> Emergency Callout Active
            </span>
          )}
          {dutyStatus === "OFF_DUTY" && (
            <span className="px-3 py-1 rounded-full bg-gray-700/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-600 flex items-center gap-1.5">
              Shift Completed
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Workforce Attendance Scanner
        </h2>
        <p className="text-xs text-gray-400 font-bold leading-relaxed">
          {dutyStatus === "ON_BREAK"
            ? "⚠️ Currently on official meal/rest break. Timer active on header. Click RESUME DUTY when returning to clinical shift."
            : dutyStatus === "ON_EMERGENCY"
            ? `🚨 Emergency Callout Active ${emergencyDetails ? `(${emergencyDetails})` : ""}. Emergency dispatch timestamp registered.`
            : "Multi-mode biometric, dynamic TOTP badge, and WebRTC camera scanner for automated time-in, meal breaks, and shift completion tracking."}
        </p>
      </div>

      {/* Real-time Clock & Dynamic Shift / Break Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto relative z-10">
        {/* Clock */}
        <div className="bg-gray-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800 text-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center justify-center gap-1">
            <Clock size={11} className="text-blue-400" /> Current Time
          </div>
          <div className="text-base font-black text-white font-mono">
            {format(currentTime, "HH:mm:ss")}
          </div>
          <div className="text-[9px] font-bold text-gray-400">{format(currentTime, "EEE, MMM dd")}</div>
        </div>

        {/* Primary Shift / Break Counter */}
        <div className="bg-gray-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800 text-center">
          {dutyStatus === "ON_BREAK" ? (
            <>
              <div className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center justify-center gap-1">
                <Coffee size={11} className="text-amber-400" /> Break Elapsed
              </div>
              <div className="text-base font-black text-amber-300 font-mono truncate">
                {getElapsedBreakTimeString()}
              </div>
              <div className="text-[9px] font-bold text-amber-400/80 uppercase">Meal Rest</div>
            </>
          ) : dutyStatus === "ON_EMERGENCY" ? (
            <>
              <div className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-1 flex items-center justify-center gap-1">
                <Flame size={11} className="text-purple-400" /> Emergency Call
              </div>
              <div className="text-base font-black text-purple-300 font-mono truncate">
                {getElapsedEmergencyTimeString()}
              </div>
              <div className="text-[9px] font-bold text-purple-400/80 uppercase">STAT Response</div>
            </>
          ) : (
            <>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center justify-center gap-1">
                <Zap size={11} className="text-emerald-400" /> Shift Duration
              </div>
              <div className="text-base font-black text-emerald-400 font-mono truncate">
                {getElapsedShiftTimeString()}
              </div>
              <div className="text-[9px] font-bold text-emerald-500/80 uppercase">
                {dutyStatus === "ON_DUTY" ? "Duty Active" : "Off Duty"}
              </div>
            </>
          )}
        </div>

        {/* Punctuality Record */}
        <div className="bg-gray-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800 text-center col-span-2 sm:col-span-1">
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center justify-center gap-1">
            <Flame size={11} className="text-purple-400" /> Punctuality
          </div>
          <div className="text-base font-black text-purple-300">
            99.2%
          </div>
          <div className="text-[9px] font-bold text-purple-400/80 uppercase">Punctual Record</div>
        </div>
      </div>
    </div>
  );
}
