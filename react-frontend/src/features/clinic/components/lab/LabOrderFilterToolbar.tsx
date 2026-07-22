import React from "react";
import { Plus, Filter, RotateCcw, Activity } from "lucide-react";

interface LabOrderFilterToolbarProps {
  filteredCount: number;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onAddLabOrder: () => void;
  counts: {
    total: number;
    completed: number;
    pending: number;
  };
}

export const LabOrderFilterToolbar: React.FC<LabOrderFilterToolbarProps> = ({
  filteredCount,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  onResetFilters,
  onAddLabOrder,
  counts,
}) => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-7 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
            <Activity size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Laboratory Diagnostic Orders
              </h2>
              <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-black rounded-full">
                {filteredCount} Orders
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              MANAGE CLINICAL PATHOLOGY, LOINC TEST CODES & RESULTS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Test Statuses ({counts.total})</option>
              <option value="COMPLETED">Completed ({counts.completed})</option>
              <option value="PENDING">Pending ({counts.pending})</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={14} />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-all shadow-sm"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          )}

          {/* Add Lab Order Button */}
          <button
            onClick={onAddLabOrder}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> New Lab Order
          </button>
        </div>
      </div>
    </div>
  );
};
