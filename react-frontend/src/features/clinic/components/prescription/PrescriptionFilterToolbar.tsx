import React from "react";
import { Plus, Stethoscope } from "lucide-react";

interface PrescriptionFilterToolbarProps {
  filteredCount: number;
  onAddPrescription: () => void;
}

export const PrescriptionFilterToolbar: React.FC<PrescriptionFilterToolbarProps> = ({
  filteredCount,
  onAddPrescription,
}) => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 md:p-7 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Prescription Management
              </h2>
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-black rounded-full">
                {filteredCount} Orders
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              MANAGE PATIENT PRESCRIPTIONS, DRUG DOSAGES & RX ORDERS
            </p>
          </div>
        </div>

        <button
          onClick={onAddPrescription}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/25 active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} /> New Prescription
        </button>
      </div>
    </div>
  );
};
