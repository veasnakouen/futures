import React from "react";
import { Users, ShieldCheck, User, Activity } from "lucide-react";

interface PatientMetricsBannerProps {
  counts: {
    total: number;
    male: number;
    female: number;
    other: number;
    poorIdCount: number;
    regularCount: number;
    bloodTypes: Record<string, number>;
  };
}

export const PatientMetricsBanner: React.FC<PatientMetricsBannerProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Total Registry
          </p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {counts.total}
          </h3>
          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase mt-0.5 block">
            Active Demographics
          </span>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl">
          <Users size={22} />
        </div>
      </div>

      <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Poor ID Equity
          </p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {counts.poorIdCount}
          </h3>
          <span className="text-[9px] font-bold text-amber-500 uppercase mt-0.5 block">
            {counts.total > 0
              ? `${Math.round((counts.poorIdCount / counts.total) * 100)}% Beneficiaries`
              : "0% Covered"}
          </span>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
          <ShieldCheck size={22} />
        </div>
      </div>

      <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Male Patients
          </p>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {counts.male}
          </h3>
          <span className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 block">
            {counts.total > 0 ? `${Math.round((counts.male / counts.total) * 100)}% of total` : "0%"}
          </span>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl">
          <User size={22} />
        </div>
      </div>

      <div className="p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Female Patients
          </p>
          <h3 className="text-2xl font-black text-pink-600 dark:text-pink-400 mt-1">
            {counts.female}
          </h3>
          <span className="text-[9px] font-bold text-pink-500 uppercase mt-0.5 block">
            {counts.total > 0 ? `${Math.round((counts.female / counts.total) * 100)}% of total` : "0%"}
          </span>
        </div>
        <div className="p-3 bg-pink-50 dark:bg-pink-950/50 text-pink-600 rounded-2xl">
          <Activity size={22} />
        </div>
      </div>
    </div>
  );
};
