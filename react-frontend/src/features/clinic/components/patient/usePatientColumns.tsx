import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PatientDto } from "@/services/clinicService";
import { Edit2, Trash2, HeartPulse, Calendar, Phone } from "lucide-react";

interface UsePatientColumnsProps {
  onEdit: (patient: PatientDto) => void;
  onDelete: (patient: PatientDto) => void;
}

export const calculateAge = (dobString?: string) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const usePatientColumns = ({ onEdit, onDelete }: UsePatientColumnsProps) => {
  return useMemo<ColumnDef<PatientDto>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Patient Demographics",
        cell: ({ row }) => {
          const patient = row.original;
          const initials = `${patient.firstName?.charAt(0) || ""}${patient.lastName?.charAt(0) || ""}`.toUpperCase();
          const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();

          return (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/20 shrink-0">
                {initials || "PT"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 dark:text-white text-sm truncate">
                    {fullName}
                  </span>
                  {patient.poorId && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm shrink-0">
                      ID Poor #{patient.poorId}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 block mt-0.5">
                  MRN: {patient.medicalRecordNumber || `MRN-${patient.id?.slice(0, 8) || "N/A"}`}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "dateOfBirth",
        header: "Age / DOB",
        cell: ({ row }) => {
          const dob = row.original.dateOfBirth;
          const age = calculateAge(dob);
          return (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <div>
                <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 block">
                  {dob || "N/A"}
                </span>
                {age !== null && (
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    {age} Yrs Old
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
          const g = (row.original.gender || "UNKNOWN").toUpperCase();
          let badgeStyle = "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200";
          if (g === "MALE") {
            badgeStyle = "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50";
          } else if (g === "FEMALE") {
            badgeStyle = "bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50";
          } else if (g === "OTHER") {
            badgeStyle = "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50";
          }

          return (
            <span className={`px-3 py-1 border rounded-xl text-xs font-black uppercase tracking-wider ${badgeStyle}`}>
              {g}
            </span>
          );
        },
      },
      {
        accessorKey: "bloodType",
        header: "Blood Group",
        cell: ({ row }) => {
          const bt = row.original.bloodType || "N/A";
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 rounded-xl text-xs font-mono font-bold">
              <HeartPulse size={12} className="text-rose-500" />
              {bt}
            </span>
          );
        },
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Phone",
        cell: ({ row }) => {
          const phone = row.original.contactNumber;
          return phone ? (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
              <Phone size={13} className="text-gray-400" />
              <span>{phone}</span>
            </div>
          ) : (
            <span className="text-[10px] text-gray-400 italic">No Phone Recorded</span>
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
              title="Edit Patient Record"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
              className="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Delete Patient Record"
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
