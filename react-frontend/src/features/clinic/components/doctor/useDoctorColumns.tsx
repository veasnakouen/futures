import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DoctorDto } from "@/services/clinicService";
import { Eye, Edit2, Trash2, Award, Phone, Mail, Clock, DollarSign, Briefcase } from "lucide-react";

interface UseDoctorColumnsProps {
  onView: (doctor: DoctorDto) => void;
  onEdit: (doctor: DoctorDto) => void;
  onDelete: (doctor: DoctorDto) => void;
}

export const useDoctorColumns = ({ onView, onEdit, onDelete }: UseDoctorColumnsProps) => {
  return useMemo<ColumnDef<DoctorDto>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Practitioner Credentials",
        cell: ({ row }) => {
          const doc = row.original;
          const initials = `${doc.firstName?.charAt(0) || ""}${doc.lastName?.charAt(0) || ""}`.toUpperCase();
          const fullName = `${doc.firstName || ""} ${doc.lastName || ""}`.trim();

          return (
            <div className="flex items-center gap-3 py-1 cursor-pointer group" onClick={() => onView(doc)}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                {initials || "DR"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {fullName}
                  </span>
                  {doc.role && (
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider rounded-md border border-indigo-200/50 dark:border-indigo-800/50 shrink-0">
                      {doc.role}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 block mt-0.5">
                  ID: {doc.employeeId || `EMP-${doc.id?.slice(0, 6) || "N/A"}`}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "specialization",
        header: "Specialization",
        cell: ({ row }) => {
          const spec = row.original.specialization || "General Practice";
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 rounded-xl text-xs font-black tracking-tight">
              <Award size={13} className="text-purple-500 shrink-0" />
              {spec}
            </span>
          );
        },
      },
      {
        accessorKey: "contactNumber",
        header: "Contact & Email",
        cell: ({ row }) => {
          const phone = row.original.contactNumber;
          const email = row.original.email;
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                <Phone size={13} className="text-emerald-500 shrink-0" />
                <span>{phone || "N/A"}</span>
              </div>
              {email && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <Mail size={12} className="text-blue-500 shrink-0" />
                  <span className="truncate max-w-[180px]">{email}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "shift",
        header: "Shift Roster",
        cell: ({ row }) => {
          const shift = row.original.shift || "Full Day";
          let colorStyle = "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/50";
          if (shift.includes("Night")) {
            colorStyle = "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/50";
          } else if (shift.includes("Evening")) {
            colorStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50";
          }

          return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-bold ${colorStyle}`}>
              <Clock size={13} />
              {shift}
            </span>
          );
        },
      },
      {
        accessorKey: "consultationFee",
        header: "Fee / Exp",
        cell: ({ row }) => {
          const fee = row.original.consultationFee;
          const exp = row.original.yearOfExperience;
          return (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <DollarSign size={13} />
                <span>{fee ? `$${Number(fee).toFixed(2)}` : "$50.00"}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <Briefcase size={11} className="text-gray-400" />
                <span>{exp ? `${exp} Yrs Exp` : "Staff Physician"}</span>
              </div>
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
                onView(row.original);
              }}
              className="p-2.5 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="View Doctor Credentials & Profile"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.original);
              }}
              className="p-2.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Edit Provider Record"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Provider Record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );
};
