import React from "react";
import { Plus, Filter, RotateCcw, Stethoscope } from "lucide-react";

interface DoctorFilterToolbarProps {
  filteredCount: number;
  specialtyFilter: string;
  setSpecialtyFilter: (val: string) => void;
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onAddDoctor: () => void;
  counts: {
    total: number;
    generalPractice: number;
    specialists: number;
  };
}

export const DoctorFilterToolbar: React.FC<DoctorFilterToolbarProps> = ({
  filteredCount,
  specialtyFilter,
  setSpecialtyFilter,
  shiftFilter,
  setShiftFilter,
  hasActiveFilters,
  onResetFilters,
  onAddDoctor,
  counts,
}) => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-7 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Provider Directory
              </h2>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-black rounded-full">
                {filteredCount} Records
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              MANAGE CLINICAL PROVIDERS, CREDENTIALS & PRACTICE SETTINGS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Specialty Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Specialties ({counts.total})</option>
              <option value="General Practice">General Practice ({counts.generalPractice})</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          </div>

          {/* Duty Shift Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Duty Shifts</option>
              <option value="Full Day">Full Day Work</option>
              <option value="Morning">Morning Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night On-Call</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
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

          {/* Add Provider Button */}
          <button
            onClick={onAddDoctor}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <Plus size={16} /> Add Provider
          </button>
        </div>
      </div>
    </div>
  );
};
