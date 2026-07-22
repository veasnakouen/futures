import React from "react";
import { Plus, Filter, RotateCcw, CalendarCheck } from "lucide-react";

interface AppointmentFilterToolbarProps {
  filteredCount: number;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onAddAppointment: () => void;
  counts: {
    total: number;
    confirmed: number;
    pending: number;
  };
}

export const AppointmentFilterToolbar: React.FC<AppointmentFilterToolbarProps> = ({
  filteredCount,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  onResetFilters,
  onAddAppointment,
  counts,
}) => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-7 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
            <CalendarCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Appointment Schedule
              </h2>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black rounded-full">
                {filteredCount} Records
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              CLINICAL APPOINTMENTS, VISITS & OUTPATIENT SCHEDULING
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Visit Statuses ({counts.total})</option>
              <option value="CONFIRMED">Confirmed ({counts.confirmed})</option>
              <option value="PENDING">Pending ({counts.pending})</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />
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

          {/* Schedule Button */}
          <button
            onClick={onAddAppointment}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <Plus size={16} /> Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
};
