import React from "react";
import { Plus, FileText } from "lucide-react";

interface MedicalRecordFilterToolbarProps {
  filteredCount: number;
  onAddRecord: () => void;
}

export const MedicalRecordFilterToolbar: React.FC<MedicalRecordFilterToolbarProps> = ({
  filteredCount,
  onAddRecord,
}) => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-7 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Medical Records Repository
              </h2>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-black rounded-full">
                {filteredCount} Records
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              ELECTRONIC HEALTH RECORDS (EHR), DIAGNOSES & TREATMENT PLANS
            </p>
          </div>
        </div>

        <button
          onClick={onAddRecord}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} /> New Record
        </button>
      </div>
    </div>
  );
};
