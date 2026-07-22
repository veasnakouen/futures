import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { LabOrderDto } from "@/services/clinicService";
import { Edit2, Trash2, Activity, CheckCircle2, Clock, AlertTriangle, FileCode } from "lucide-react";

interface UseLabOrderColumnsProps {
  onEdit: (labOrder: LabOrderDto) => void;
  onDelete: (labOrder: LabOrderDto) => void;
}

export const useLabOrderColumns = ({ onEdit, onDelete }: UseLabOrderColumnsProps) => {
  return useMemo<ColumnDef<LabOrderDto>[]>(
    () => [
      {
        accessorKey: "testName",
        header: "Laboratory Test & LOINC",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20 shrink-0">
                <Activity size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-gray-900 dark:text-white text-sm block truncate max-w-[220px]">
                  {order.testName || "Complete Blood Count (CBC)"}
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-0.5">
                  <FileCode size={11} /> LOINC: {order.loincCode || "58410-2"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Test Status",
        cell: ({ row }) => {
          const st = (row.original.status || "PENDING").toUpperCase();
          let badgeStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50";
          let Icon = Clock;

          if (st === "COMPLETED") {
            badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50";
            Icon = CheckCircle2;
          }

          return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-black uppercase tracking-wider ${badgeStyle}`}>
              <Icon size={13} />
              {st}
            </span>
          );
        },
      },
      {
        accessorKey: "resultValue",
        header: "Result & Reference",
        cell: ({ row }) => {
          const order = row.original;
          const isAbnormal = order.abnormalFlag === "HIGH" || order.abnormalFlag === "LOW" || order.abnormalFlag === "CRITICAL";

          return (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                  {order.resultValue || "Pending Lab Processing"}
                </span>
                {isAbnormal && (
                  <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-md flex items-center gap-0.5">
                    <AlertTriangle size={10} /> {order.abnormalFlag}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 font-medium block">
                Ref: {order.referenceRange || "4.5 - 11.0 k/uL"}
              </span>
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
              title="Edit Lab Order"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Lab Order"
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
