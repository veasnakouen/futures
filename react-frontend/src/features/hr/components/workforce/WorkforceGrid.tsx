import React from "react";
import { Badge, Avatar, Button } from '@/lib/flowbite-compat';
import { Mail, Phone, MapPin, Edit3, Trash2, ExternalLink, MessageSquare, Briefcase, Building, ShieldCheck } from "lucide-react";

interface WorkforceGridProps {
  employees: any[];
  searchQuery?: string;
  onSelectEmployee?: (emp: any) => void;
  onEditEmployee?: (emp: any) => void;
  handleEdit?: (emp: any) => void;
  onDeleteEmployee?: (id: number) => void;
  handleDelete?: (id: number) => void;
  [key: string]: any;
}

const AVATAR_FALLBACKS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
];

const getStatusBadge = (status?: string) => {
  const s = (status || "Active").toLowerCase();
  if (s.includes("active") || s.includes("placed")) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {status || "Active"}
      </span>
    );
  }
  if (s.includes("leave") || s.includes("searching")) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {status || "Searching"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
      {status || "Personnel"}
    </span>
  );
};

const WorkforceGrid: React.FC<WorkforceGridProps> = ({
  employees = [],
  searchQuery = "",
  onSelectEmployee = () => {},
  onEditEmployee,
  handleEdit,
  onDeleteEmployee,
  handleDelete,
}) => {
  const actualEdit = onEditEmployee || handleEdit || (() => {});
  const actualDelete = onDeleteEmployee || handleDelete || (() => {});

  const filtered = employees.filter((e) => {
    const fn = e.firstName || e.firstNameEnglish || "";
    const ln = e.lastName || e.lastNameEnglish || "";
    const code = e.clientCode || e.employeeId || e.idNo || "";
    const dept = e.departmentName || e.department?.name || "";
    const pos = e.positionName || e.position?.name || e.title || "";
    const full = `${fn} ${ln} ${code} ${dept} ${pos}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filtered.length === 0 ? (
        <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-500 mx-auto flex items-center justify-center mb-3">
            <Briefcase size={22} />
          </div>
          <p className="text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide">No Personnel Match Your Filter</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        filtered.map((emp, idx) => {
          const fn = emp.firstName || emp.firstNameEnglish || "Staff";
          const ln = emp.lastName || emp.lastNameEnglish || "Member";
          const empCode = emp.clientCode || emp.employeeId || `EMP-${1000 + emp.id}`;
          const dept = emp.departmentName || emp.department?.name || emp.department || "General Administration";
          const pos = emp.positionName || emp.position?.name || emp.title || "Operations Specialist";
          const branch = emp.branch || emp.address || "Phnom Penh HQ";
          const email = emp.email || `${fn.toLowerCase()}.${ln.toLowerCase()}@mtp.org`;
          const phone = emp.contactPhone || emp.phoneNumber || "+855 12 345 678";
          const photoUrl = emp.photo || emp.avatarUrl || AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length];

          return (
            <div
              key={emp.id}
              className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

              {/* Action Buttons Top Bar (Always Visible) */}
              <div className="absolute right-3 top-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-1 rounded-xl shadow-sm z-10 border border-gray-100 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actualEdit(emp);
                  }}
                  title="Edit Staff Record"
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actualDelete(emp.id);
                  }}
                  title="Decommission Staff"
                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="relative cursor-pointer shrink-0"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    <img
                      src={photoUrl}
                      alt={`${fn} ${ln}`}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-gray-800 w-4 h-4 rounded-full shadow-sm"></div>
                  </div>

                  <div className="min-w-0 flex-1 pr-12">
                    <h4
                      className="font-black text-gray-900 dark:text-white text-base leading-tight truncate cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-tight"
                      onClick={() => onSelectEmployee(emp)}
                      title={`${fn} ${ln}`}
                    >
                      {fn} {ln}
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                      {empCode}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(emp.status)}
                    </div>
                  </div>
                </div>

                {/* Job Title & Department Badges */}
                <div className="space-y-1.5 mb-4 bg-gray-50/70 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100/80 dark:border-gray-700/50">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 dark:text-gray-200 truncate">
                    <Briefcase size={12} className="text-blue-500 shrink-0" />
                    <span className="truncate">{pos}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">
                    <Building size={12} className="text-indigo-400 shrink-0" />
                    <span className="truncate">{dept}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-4 px-1">
                  <div className="flex items-center gap-2 truncate" title={email}>
                    <Mail size={12} className="text-blue-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate" title={phone}>
                    <Phone size={12} className="text-emerald-400 shrink-0" />
                    <span className="truncate font-mono">{phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate" title={branch}>
                    <MapPin size={12} className="text-rose-400 shrink-0" />
                    <span className="truncate">{branch}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center">
                <Button
                  size="xs"
                  color="light"
                  onClick={() => onSelectEmployee(emp)}
                  className="w-full font-black uppercase text-[10px] tracking-wider rounded-xl py-2 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <ExternalLink size={12} className="mr-1.5 text-blue-500" />
                  View Dossier
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default WorkforceGrid;
