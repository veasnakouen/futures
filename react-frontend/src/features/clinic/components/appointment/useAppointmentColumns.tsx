import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppointmentDto } from "@/services/clinicService";
import { Edit2, Trash2, Calendar, Clock, User, Stethoscope, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface UseAppointmentColumnsProps {
  onEdit: (appointment: AppointmentDto) => void;
  onDelete: (appointment: AppointmentDto) => void;
}

export const useAppointmentColumns = ({ onEdit, onDelete }: UseAppointmentColumnsProps) => {
  return useMemo<ColumnDef<AppointmentDto>[]>(
    () => [
      {
        accessorKey: "appointmentDate",
        header: "Schedule Date & Time",
        cell: ({ row }) => {
          const appt = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-emerald-500/20 shrink-0">
                <Calendar size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-gray-900 dark:text-white text-sm block">
                  {appt.appointmentDate || "2026-07-23"}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Clock size={11} /> {appt.appointmentTime || "09:30 AM"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "patientId",
        header: "Patient / Client",
        cell: ({ row }) => {
          const patientId = row.original.patientId || "PAT-9901";
          return (
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                {patientId}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "doctorId",
        header: "Attending Doctor",
        cell: ({ row }) => {
          const docId = row.original.doctorId || "DOC-102";
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
        accessorKey: "status",
        header: "Visit Status",
        cell: ({ row }) => {
          const st = (row.original.status || "PENDING").toUpperCase();
          let badgeStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50";
          let Icon = AlertCircle;

          if (st === "CONFIRMED" || st === "COMPLETED") {
            badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50";
            Icon = CheckCircle2;
          } else if (st === "CANCELLED") {
            badgeStyle = "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50";
            Icon = XCircle;
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
        accessorKey: "notes",
        header: "Clinical Notes",
        cell: ({ row }) => {
          const notes = row.original.notes || "Standard Consultation Visit";
          return (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px] block">
              {notes}
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
              title="Edit Appointment"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Appointment"
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
