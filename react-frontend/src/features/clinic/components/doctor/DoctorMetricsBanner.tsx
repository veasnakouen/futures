import React from "react";
import { Stethoscope, Award, Clock, DollarSign } from "lucide-react";

interface DoctorMetricsBannerProps {
  counts: {
    total: number;
    generalPractice: number;
    specialists: number;
    fullDayShifts: number;
  };
}

export const DoctorMetricsBanner: React.FC<DoctorMetricsBannerProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
          <Stethoscope size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Practitioners</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{counts.total}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <Award size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">General Physicians</p>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{counts.generalPractice}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
          <Award size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Medical Specialists</p>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{counts.specialists}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Day Roster</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{counts.fullDayShifts}</h3>
        </div>
      </div>
    </div>
  );
};
