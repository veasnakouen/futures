import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PrescriptionDto } from "@/services/clinicService";
import { Edit2, Trash2, Stethoscope, Pill, User, FileText } from "lucide-react";

interface UsePrescriptionColumnsProps {
  onEdit: (prescription: PrescriptionDto) => void;
  onDelete: (prescription: PrescriptionDto) => void;
}

export const usePrescriptionColumns = ({ onEdit, onDelete }: UsePrescriptionColumnsProps) => {
  return useMemo<ColumnDef<PrescriptionDto>[]>(
    () => [
      {
        accessorKey: "diagnosis",
        header: "Clinical Diagnosis",
        cell: ({ row }) => {
          const rx = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-rose-500/20 shrink-0">
                <Stethoscope size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-gray-900 dark:text-white text-sm block truncate max-w-[220px]">
                  {rx.diagnosis || "General Clinical Evaluation"}
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 block mt-0.5">
                  Rx ID: {rx.id?.slice(0, 8) || "RX-1004"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "patientId",
        header: "Patient / Client ID",
        cell: ({ row }) => {
          const pid = row.original.patientId || "MRN-b3f099f0";
          return (
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                {pid}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "items",
        header: "Prescribed Medications",
        cell: ({ row }) => {
          const items = row.original.items || [];
          const itemCount = items.length;
          const firstMed = items[0]?.drugName || "Amoxicillin 500mg";

          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                <Pill size={13} className="text-rose-500 shrink-0" />
                <span className="truncate max-w-[200px]">{firstMed}</span>
              </div>
              {itemCount > 1 && (
                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-wider rounded-md border border-rose-200/50 dark:border-rose-800/50 inline-block">
                  +{itemCount - 1} Additional Drugs
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.original);
              }}
              className="p-2.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Edit Prescription Order"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Prescription Order"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );
};
