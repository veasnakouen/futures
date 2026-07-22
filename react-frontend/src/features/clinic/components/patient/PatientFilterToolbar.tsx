import React from "react";
import { User, Filter, ShieldCheck, HeartPulse, ChevronDown, RotateCcw, Plus } from "lucide-react";

interface PatientFilterToolbarProps {
  filteredCount: number;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  poorIdFilter: string;
  setPoorIdFilter: (val: string) => void;
  bloodTypeFilter: string;
  setBloodTypeFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onAddPatient: () => void;
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

export const PatientFilterToolbar: React.FC<PatientFilterToolbarProps> = ({
  filteredCount,
  genderFilter,
  setGenderFilter,
  poorIdFilter,
  setPoorIdFilter,
  bloodTypeFilter,
  setBloodTypeFilter,
  hasActiveFilters,
  onResetFilters,
  onAddPatient,
  counts,
}) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
          <User size={28} className="drop-shadow-sm" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Patient Directory</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
              {filteredCount} Records
            </span>
          </h2>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
            Manage clinical demographics & health equity records
          </p>
        </div>
      </div>

      {/* Dynamic Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Dynamic Gender Filter */}
        <div className="relative group min-w-[160px] flex-1 sm:flex-none">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none"
            size={16}
          />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/50 dark:text-white appearance-none cursor-pointer shadow-sm transition-all hover:bg-white dark:hover:bg-gray-800"
          >
            <option value="ALL">All Genders ({counts.total})</option>
            <option value="MALE">Male ({counts.male})</option>
            <option value="FEMALE">Female ({counts.female})</option>
            {counts.other > 0 && <option value="OTHER">Other ({counts.other})</option>}
          </select>
          {/* <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-hover:rotate-180"
          /> */}
        </div>

        {/* Dynamic Poor ID Equity Filter */}
        <div className="relative group min-w-[180px] flex-1 sm:flex-none">
          <ShieldCheck
            className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 transition-colors pointer-events-none"
            size={16}
          />
          <select
            value={poorIdFilter}
            onChange={(e) => setPoorIdFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-500/50 dark:text-white appearance-none cursor-pointer shadow-sm transition-all hover:bg-white dark:hover:bg-gray-800"
          >
            <option value="ALL">All Equity Statuses ({counts.total})</option>
            <option value="POOR_ID_ONLY">ID Poor Beneficiaries ({counts.poorIdCount})</option>
            <option value="REGULAR_ONLY">Regular Patients ({counts.regularCount})</option>
          </select>
          {/* <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-hover:rotate-180"
          /> */}
        </div>

        {/* Dynamic Blood Type Filter */}
        <div className="relative group min-w-[160px] flex-1 sm:flex-none">
          <HeartPulse
            className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 transition-colors pointer-events-none"
            size={16}
          />
          <select
            value={bloodTypeFilter}
            onChange={(e) => setBloodTypeFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-rose-500/50 dark:text-white appearance-none cursor-pointer shadow-sm transition-all hover:bg-white dark:hover:bg-gray-800"
          >
            <option value="ALL">All Blood Types ({counts.total})</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
              const cnt = counts.bloodTypes[type] || 0;
              return (
                <option key={type} value={type}>
                  Blood {type} ({cnt})
                </option>
              );
            })}
          </select>
          {/* <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-hover:rotate-180"
          /> */}
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
            title="Reset All Active Filters"
          >
            <RotateCcw size={14} className="text-gray-500" />
            <span>Reset</span>
          </button>
        )}

        {/* Add Patient Action Button */}
        <button
          onClick={onAddPatient}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={18} strokeWidth={3} /> Add Patient
        </button>
      </div>
    </div>
  );
};
