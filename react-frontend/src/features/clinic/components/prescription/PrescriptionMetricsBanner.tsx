import React from "react";
import { Stethoscope, Pill, FileCheck, ShieldCheck } from "lucide-react";

interface PrescriptionMetricsBannerProps {
  counts: {
    total: number;
    medicationsCount: number;
    multiDrugOrders: number;
  };
}

export const PrescriptionMetricsBanner: React.FC<PrescriptionMetricsBannerProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
          <Stethoscope size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Rx Orders</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{counts.total}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
          <Pill size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Active Prescriptions</p>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{counts.medicationsCount}</h3>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <FileCheck size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Multi-Drug Orders</p>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{counts.multiDrugOrders}</h3>
        </div>
      </div>
    </div>
  );
};
