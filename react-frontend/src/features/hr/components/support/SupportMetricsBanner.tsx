import React from "react";
import { LifeBuoy, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Props {
  state: any;
}

export default function SupportMetricsBanner({ state }: Props) {
  const { totalCount, inProgressCount, criticalCount, resolvedCount, resolutionRate } = state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tickets</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{totalCount}</h3>
          <p className="text-[10px] text-gray-400 font-semibold mt-1">Cross-Departmental Queue</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <LifeBuoy size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active / In Progress</p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{inProgressCount}</h3>
          <p className="text-[10px] text-amber-500 font-semibold mt-1">Assigned Technicians Working</p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
          <Clock size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Critical Priority</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{criticalCount}</h3>
          <p className="text-[10px] text-rose-500 font-semibold mt-1">Urgent Hardware / Network SLA</p>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl">
          <ShieldAlert size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolution Rate</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolutionRate}%</h3>
          <p className="text-[10px] text-emerald-500 font-semibold mt-1">{resolvedCount} Tickets Successfully Closed</p>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
          <CheckCircle2 size={24} />
        </div>
      </div>
    </div>
  );
}
