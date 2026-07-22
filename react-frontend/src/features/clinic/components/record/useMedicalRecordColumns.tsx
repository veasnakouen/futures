import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MedicalRecordDto } from "@/services/clinicService";
import { Edit2, Trash2, FileText, Calendar, User, Stethoscope } from "lucide-react";

interface UseMedicalRecordColumnsProps {
  onEdit: (record: MedicalRecordDto) => void;
  onDelete: (record: MedicalRecordDto) => void;
}

export const useMedicalRecordColumns = ({ onEdit, onDelete }: UseMedicalRecordColumnsProps) => {
  return useMemo<ColumnDef<MedicalRecordDto>[]>(
    () => [
      {
        accessorKey: "recordDate",
        header: "Record Date",
        cell: ({ row }) => {
          const rec = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20 shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-gray-900 dark:text-white text-xs font-mono block">
                  {rec.recordDate ? rec.recordDate.split("T")[0] : "2026-07-23"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                  EHR #{rec.id?.slice(0, 8) || "REC-8801"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "patientId",
        header: "Patient ID",
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
        accessorKey: "doctorId",
        header: "Attending Doctor",
        cell: ({ row }) => {
          const docId = row.original.doctorId || "DOC-101";
          return (
            <div className="flex items-center gap-2">
              <Stethoscope size={14} className="text-indigo-500 shrink-0" />
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {docId}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "diagnosis",
        header: "Clinical Diagnosis",
        cell: ({ row }) => {
          const diag = row.original.diagnosis || "Routine Outpatient Evaluation";
          return (
            <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px] block">
              {diag}
            </span>
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
              title="Edit Clinical Record"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Clinical Record"
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
