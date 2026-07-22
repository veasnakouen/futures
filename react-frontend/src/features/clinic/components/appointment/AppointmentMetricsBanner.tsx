import React from "react";
import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

interface AppointmentMetricsBannerProps {
  counts: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

export const AppointmentMetricsBanner: React.FC<AppointmentMetricsBannerProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
          <CalendarCheck size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Visits</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{counts.total}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Confirmed / Completed</p>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{counts.confirmed}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Pending Confirmation</p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{counts.pending}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
          <XCircle size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Cancelled Roster</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">{counts.cancelled}</h3>
        </div>
      </div>
    </div>
  );
};
