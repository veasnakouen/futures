import React from "react";
import { Users, UserCheck, Clock } from "lucide-react";

interface Props {
  state: any;
}

export default function WorkforceMetricsHeader({ state }: Props) {
  const { totalCount, activeCount, leaveCount } = state;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Personnel</p>
          <h4 className="text-2xl font-black dark:text-white mt-1">{totalCount} Members</h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
          <Users size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Staff</p>
          <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount} Duty-Ready</h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
          <UserCheck size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Transition / Leave</p>
          <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{leaveCount} Pending</h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
          <Clock size={20} />
        </div>
      </div>
    </div>
  );
}
