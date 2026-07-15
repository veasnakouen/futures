import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  User,
  Search,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Zap,
  Activity,
  Monitor,
  Cpu,
  MapPin,
  ShieldCheck,
  Plus,
  LayoutGrid,
  List,
  X,
  ChevronRight
} from "lucide-react";
import { Button, Badge, Avatar, Select, TextInput, Checkbox, Label, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Spinner } from '@/lib/flowbite-compat';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

import HolidayModal from "./HolidayModal";
import toast from "react-hot-toast";
import { TimetableFormModal } from "./TimetableFormModal";
import { ScheduleAssignmentModal } from "./ScheduleAssignmentModal";
import { HolidayFormModal } from "./HolidayFormModal";
import { useTimetable } from "@/hooks/useTimetable";
import { useHoliday } from "@/hooks/useHoliday";
import { DataTable, ColumnDef } from "@/components/common/DataTable";

interface AttendanceModuleProps {
  globalAttendance: any[];
  onManualLog: () => void;
  onOpenDeviceManager: () => void;
}

/* ── Design System Helpers ── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] mb-4">
    {children}
  </p>
);

const InfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/60 rounded-2xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300 dark:text-gray-600">
    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-800">{icon}</div>
    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
  </div>
);

const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  globalAttendance,
  onManualLog,
  onOpenDeviceManager,
}) => {
  const [subTab, setSubTab] = React.useState<"MATRIX" | "SCHEDULE" | "REPORTS">("MATRIX");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unmappedOnly, setUnmappedOnly] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = React.useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("clockIn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isAssignScheduleModalOpen, setIsAssignScheduleModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const { useTimetables } = useTimetable();
  const { data: timetables = [] } = useTimetables();

  const { useHolidays } = useHoliday();
  const { data: holidays = [] } = useHolidays();

  // Real-time Analytics Calculations
  const onPremisesCount = React.useMemo(() => {
    return globalAttendance.filter((a) => a.status === "Present" && !a.clockOut).length;
  }, [globalAttendance]);

  const punctualityScore = React.useMemo(() => {
    if (!globalAttendance.length) return 100;
    const late = globalAttendance.filter((a) => a.status === "Late").length;
    return (100 - (late / globalAttendance.length) * 100).toFixed(1);
  }, [globalAttendance]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── Sub Navigation ── */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100/80 dark:bg-gray-900 rounded-full p-1.5 flex items-center gap-1 shadow-inner max-w-max border border-gray-200/50 dark:border-gray-700/50">
          {(["MATRIX", "SCHEDULE", "REPORTS"] as const).map((tab) => {
            const active = subTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`relative px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  active
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeSubTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#7a2323] to-[#c53030] rounded-full shadow-md shadow-red-900/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MATRIX TAB ── */}
      {subTab === "MATRIX" && (
        <div className="space-y-6 animate-fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InfoCard className="!p-5 flex flex-col justify-center relative overflow-hidden border-l-4 border-l-[#c53030]">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">On Premises</p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">12</h4>
            </InfoCard>
            
            <InfoCard className="!p-5 flex flex-col justify-center">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">OT Hours</p>
              <h4 className="text-3xl font-black text-[#c53030] dark:text-red-400">42.5h</h4>
            </InfoCard>
            
            <InfoCard className="!p-5 flex flex-col justify-center">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">OT Payout</p>
              <h4 className="text-3xl font-black text-emerald-500">$850</h4>
            </InfoCard>

            <div className="md:col-span-1 bg-gradient-to-br from-gray-900 via-slate-800 to-[#7a2323] text-white rounded-2xl shadow-lg border border-gray-700/50 flex flex-col justify-center p-5 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Zap size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/70">Biometric Sync</p>
                </div>
                <h4 className="text-lg font-black tracking-tight">Nodes Online</h4>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 text-[9px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded-lg transition-all backdrop-blur-sm">
                    Sync
                  </button>
                  <button onClick={onOpenDeviceManager} className="flex-1 text-[9px] font-bold uppercase tracking-wider bg-white hover:bg-gray-100 text-[#7a2323] px-2 py-1.5 rounded-lg transition-all">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onManualLog}
                className="flex-1 bg-gradient-to-r from-[#7a2323] to-[#c53030] hover:from-[#5c1a1a] hover:to-[#a32828] text-white rounded-xl shadow-md shadow-red-900/20 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <Clock size={14} /> Manual Log
              </button>
              <button className="flex-1 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all">
                <FileText size={14} /> Audit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InfoCard className="lg:col-span-2 h-[340px]">
              <div className="flex justify-between items-center mb-6">
                <SectionLabel><span className="flex items-center gap-2 text-gray-500"><TrendingUp size={14} className="text-[#c53030]" /> Weekly Presence Trends</span></SectionLabel>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest">Last 7 Days</span>
              </div>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { day: "Mon", count: 42 }, { day: "Tue", count: 38 }, { day: "Wed", count: 45 },
                  { day: "Thu", count: 40 }, { day: "Fri", count: 35 }, { day: "Sat", count: 12 }, { day: "Sun", count: 8 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }} dy={10} />
                  <Tooltip cursor={{ fill: "#f1f5f9", opacity: 0.4 }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {[42, 38, 45, 40, 35, 12, 8].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry > 30 ? "#c53030" : "#cbd5e1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </div>
            </InfoCard>

            <div className="flex flex-col gap-4">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#7a2323] via-[#9b2c2c] to-[#c53030] text-white border-none shadow-lg shadow-red-900/20 flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Punctuality Score</p>
                <h3 className="text-5xl font-black tracking-tight">{punctualityScore}%</h3>
                <p className="text-xs font-semibold mt-4 text-white/80">
                  +2.1% improvement from last week's aggregate
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '94.8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InfoCard className="!p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <h4 className="font-black text-base dark:text-white whitespace-nowrap">Attendance Matrix</h4>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Present</span>
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Late</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {(() => {
                const columns: ColumnDef<any>[] = [
                  {
                    header: "Personnel",
                    accessorKey: "employee",
                    sortable: true,
                    cell: (log) => (
                      <div className="flex items-center gap-3">
                        <Avatar rounded size="sm" />
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {log.employee ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}` : log.employeeName}
                        </span>
                      </div>
                    )
                  },
                  {
                    header: "Shift",
                    accessorKey: "shift",
                    cell: () => <span className="text-[10px] font-bold text-gray-400 uppercase">Day Shift</span>
                  },
                  {
                    header: "Clock In",
                    accessorKey: "clockIn",
                    sortable: true,
                    cell: (log) => log.clockIn ? (
                      <span className="font-mono text-gray-800 dark:text-gray-200 font-bold text-xs">{format(new Date(log.clockIn), "hh:mm a")}</span>
                    ) : (<span className="text-gray-300 font-mono text-xs">—</span>)
                  },
                  {
                    header: "Method",
                    accessorKey: "method",
                    cell: () => (
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <Zap size={12} fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Verified</span>
                      </div>
                    )
                  },
                  {
                    header: "Status",
                    accessorKey: "status",
                    sortable: true,
                    cell: (log) => (
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        log.status === "Present" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                      }`}>
                        {log.status}
                      </span>
                    )
                  },
                  {
                    header: "Location",
                    accessorKey: "location",
                    sortable: true,
                    cell: (log) => (
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                        <MapPin size={12} /> {log.location}
                      </div>
                    )
                  }
                ];

                const handleSort = (field: string) => {
                  if (sortField === field) {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  } else {
                    setSortField(field);
                    setSortDir("desc");
                  }
                };

                const filteredAttendance = (globalAttendance || [])
                  .filter((log) => {
                    const fullName = log.employee ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}` : log.employeeName || "";
                    return fullName.toLowerCase().includes(matrixSearch.toLowerCase());
                  })
                  .filter((log) => statusFilter === "" || log.status === statusFilter)
                  .filter((log) => !unmappedOnly || !log.employee);

                const sortedAttendance = [...filteredAttendance].sort((a, b) => {
                  if (sortField === "clockIn") {
                    const valA = a.clockIn ? new Date(a.clockIn).getTime() : 0;
                    const valB = b.clockIn ? new Date(b.clockIn).getTime() : 0;
                    return sortDir === "asc" ? valA - valB : valB - valA;
                  }
                  if (sortField === "status") {
                    return sortDir === "asc" ? (a.status || "").localeCompare(b.status || "") : (b.status || "").localeCompare(a.status || "");
                  }
                  if (sortField === "employee") {
                    const nameA = a.employee ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}` : a.employeeName || "";
                    const nameB = b.employee ? `${b.employee.firstNameEnglish} ${b.employee.lastNameEnglish}` : b.employeeName || "";
                    return sortDir === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                  }
                  if (sortField === "location") {
                    const locA = a.location || "";
                    const locB = b.location || "";
                    return sortDir === "asc" ? locA.localeCompare(locB) : locB.localeCompare(locA);
                  }
                  return 0;
                });

                const totalItems = sortedAttendance.length;
                const totalPages = Math.ceil(totalItems / pageSize);
                const paginatedAttendance = sortedAttendance.slice((currentPage - 1) * pageSize, currentPage * pageSize);

                const renderGridCard = (log: any) => (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar rounded size="md" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight line-clamp-1">
                            {log.employee ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}` : log.employeeName}
                          </h4>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Day Shift</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-3">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span className="text-gray-400 flex items-center gap-1"><Clock size={12} /> In</span>
                        <span className="text-gray-800 dark:text-gray-200">{log.clockIn ? format(new Date(log.clockIn), "hh:mm a") : "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span className="text-gray-400 flex items-center gap-1"><MapPin size={12} /> Loc</span>
                        <span className="text-gray-800 dark:text-gray-200">{log.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <Zap size={10} fill="currentColor" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Biometric</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                        log.status === "Present" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                );

                return (
                  <DataTable
                    data={paginatedAttendance}
                    columns={columns}
                    searchQuery={matrixSearch}
                    onSearchChange={setMatrixSearch}
                    searchPlaceholder="Search personnel..."
                    filters={
                      <Select sizing="sm" className="w-full sm:w-36 h-9" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                      </Select>
                    }
                    enableViewToggle={true}
                    enableColumnToggle={true}
                    renderGridCard={renderGridCard}
                    gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1); // Reset to first page
                    }}
                    totalItems={totalItems}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                );
              })()}
            </div>
          </InfoCard>
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {subTab === "SCHEDULE" && (
        <div className="space-y-6 animate-fade-in">
          <InfoCard className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/80">
            <div>
              <h3 className="text-lg font-black dark:text-white tracking-tight">Shift & Schedule Management</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Manage employee schedules, shifts, and system holidays</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setIsAssignScheduleModalOpen(true)} className="px-3 py-1.5 bg-[#c53030] hover:bg-[#a32828] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-red-900/20">
                <Calendar size={13} /> Assign
              </button>
              <button onClick={() => setIsTimetableModalOpen(true)} className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                <Clock size={13} /> Timetable
              </button>
              <button onClick={() => setIsHolidayModalOpen(true)} className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                <LayoutGrid size={13} /> Holidays
              </button>
            </div>
          </InfoCard>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {timetables.length > 0 ? (
              timetables.map((shift, i) => (
                <div key={i} className="p-5 bg-white rounded-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#c53030]"></div>
                  <div className="flex justify-between items-start pl-2">
                    <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#c53030]">
                      <Clock size={16} />
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">Active</span>
                  </div>
                  <h5 className="mt-4 pl-2 text-sm font-black dark:text-white uppercase tracking-tight">{shift.name}</h5>
                  <p className="pl-2 text-[10px] font-bold text-gray-500 mt-0.5 uppercase">{shift.onDutyTime} - {shift.offDutyTime}</p>
                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center pl-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Personnel</span>
                    <span className="text-base font-black dark:text-white">—</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 py-12 text-center text-gray-400 dark:text-gray-500 font-bold bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                No timetables configured.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InfoCard className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <SectionLabel><span className="mb-0">Operational Duty Roster</span></SectionLabel>
                  <p className="text-[10px] font-bold text-[#c53030] uppercase mt-0.5">Week 18 • May 2024</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Prev</button>
                  <button className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Next</button>
                </div>
              </div>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-8 text-[10px] font-black text-gray-400 uppercase tracking-wider">{day}</div>
                    <div className="flex-1 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl relative overflow-hidden flex items-center px-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c53030] opacity-70"></div>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {[1, 2, 3].map((id) => (
                          <div key={id} className="h-6 w-6 rounded-lg bg-red-100 dark:bg-red-900/40 border border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-black text-[#c53030]">
                            {id}
                          </div>
                        ))}
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-2">+ {12 - i} Assigned</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard>
              <SectionLabel>Upcoming Holidays</SectionLabel>
              <div className="space-y-4">
                {holidays.length > 0 ? (
                  holidays.map((h, i) => (
                    <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex flex-col items-center justify-center border border-amber-100 dark:border-amber-900/30">
                        <span className="text-[9px] font-black uppercase leading-none">{format(new Date(h.eventDate), "MMM")}</span>
                        <span className="text-sm font-black leading-none mt-0.5">{format(new Date(h.eventDate), "dd")}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{h.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-gray-400">1 Day</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500">{h.category || "System"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={<LayoutGrid size={24} />} label="No upcoming holidays" />
                )}
                <button onClick={() => setIsHolidayModalOpen(true)} className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                  <Plus size={14} /> Add Holiday
                </button>
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {subTab === "REPORTS" && (
        <div className="space-y-6 animate-fade-in pb-12">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InfoCard className="!p-5 border-l-4 border-l-emerald-500">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Overall Punctuality</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">94.2%</h3>
              <div className="mt-2 flex items-center gap-1.5 text-emerald-500">
                <TrendingUp size={12} />
                <span className="text-[9px] font-bold uppercase">+2.1% this month</span>
              </div>
            </InfoCard>
            <InfoCard className="!p-5">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Average Delay</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">8.5m</h3>
              <div className="mt-2 flex items-center gap-1.5 text-amber-500">
                <Clock size={12} />
                <span className="text-[9px] font-bold uppercase">-1.2m vs last week</span>
              </div>
            </InfoCard>
            <InfoCard className="!p-5">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Unauthorized Absence</p>
              <h3 className="text-3xl font-black text-red-500">1.4%</h3>
              <div className="mt-2 flex items-center gap-1.5 text-gray-400">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-bold uppercase">Within safety limit</span>
              </div>
            </InfoCard>
            
            <div className="md:col-span-1 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-2xl shadow-lg shadow-blue-900/20 flex flex-col justify-center p-5 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-200 mb-1">Report Generation</p>
                <h3 className="text-lg font-black tracking-tight mb-3">Export Intelligence</h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white hover:bg-gray-50 text-blue-800 font-bold uppercase text-[9px] tracking-wider py-1.5 rounded-lg transition-colors shadow-sm">PDF</button>
                  <button className="flex-1 bg-blue-600/50 hover:bg-blue-500/50 text-white font-bold uppercase text-[9px] tracking-wider py-1.5 rounded-lg transition-colors border border-blue-400/30">Excel</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard className="h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <SectionLabel><span className="mb-0">Workforce Presence Heatmap</span></SectionLabel>
                  <p className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 tracking-wider">Monthly Aggregated Pulse</p>
                </div>
                <Select sizing="sm" className="w-32 h-8 text-[10px] font-bold uppercase bg-gray-50 dark:bg-gray-800/50">
                  <option>April 2024</option>
                  <option>March 2024</option>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height="80%" minWidth={1} minHeight={1}>
                <AreaChart data={[
                  { date: "01", present: 45 }, { date: "05", present: 42 }, { date: "10", present: 48 },
                  { date: "15", present: 38 }, { date: "20", present: 52 }, { date: "25", present: 45 }, { date: "30", present: 50 }
                ]}>
                  <defs>
                    <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }} dy={10} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPresence)" dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </InfoCard>

            <InfoCard className="h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <SectionLabel><span className="mb-0">Departmental Efficiency</span></SectionLabel>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mt-0.5 tracking-wider">Top Performers Analysis</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="80%" minWidth={1} minHeight={1}>
                <BarChart layout="vertical" data={[
                  { dept: "IT & Ops", score: 98 }, { dept: "Social", score: 92 },
                  { dept: "Admin", score: 95 }, { dept: "Finance", score: 88 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" strokeOpacity={0.4} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="dept" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "#64748b" }} width={60} />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "none" }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                    {[98, 92, 95, 88].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry > 94 ? "#10b981" : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </InfoCard>
          </div>

          <InfoCard className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
              <h4 className="font-black text-sm text-gray-800 dark:text-white uppercase tracking-wider">Anomalous Attendance Audit</h4>
              <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Review Required</span>
            </div>
            <div className="overflow-x-auto">
              <Table hoverable className="border-none w-full min-w-[700px]">
                <TableHead className="bg-white dark:bg-gray-900">
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Personnel</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Anomaly Type</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Frequency</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Impact</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3 text-right">Action</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {[
                    { name: "Elena Gilbert", type: "Consistent Late-In", freq: "4/7 days", impact: "Medium" },
                    { name: "Tony Stark", type: "Unmapped Location", freq: "2/7 days", impact: "Low" },
                  ].map((row, i) => (
                    <TableRow key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="py-3 font-bold text-sm text-gray-900 dark:text-white">{row.name}</TableCell>
                      <TableCell className="py-3"><span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">{row.type}</span></TableCell>
                      <TableCell className="py-3 text-xs font-medium text-gray-500">{row.freq}</TableCell>
                      <TableCell className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${row.impact === "Medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20"}`}>
                          {row.impact}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <button className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[10px] font-black uppercase tracking-widest transition-colors">Investigate</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </InfoCard>
          
          <InfoCard className="!p-0 overflow-hidden">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-black text-sm text-gray-800 dark:text-white uppercase tracking-wider">Attendance Audit Ledger</h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Export verified clock-in/out records for compliance</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success("Exporting Excel...")}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download size={14} /> Excel
                </button>
                <button
                  onClick={() => toast.success("Exporting PDF...")}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 font-black uppercase text-[10px] tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText size={14} /> PDF
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
              <Table hoverable className="border-none w-full min-w-[700px] relative">
                <TableHead className="bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-800">
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Personnel</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Method</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Date & Time</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3">Status</TableHeadCell>
                  <TableHeadCell className="text-[9px] font-black text-gray-400 uppercase tracking-widest py-3 text-right">Verification</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {!globalAttendance || globalAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16">
                        <EmptyState icon={<Clock size={24} />} label="No Records Found" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    (globalAttendance || []).map((log, i) => (
                      <TableRow key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar rounded size="xs" />
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {log.employee ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}` : "External Node"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${log.attendanceType === "Biometric" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20"}`}>
                            {log.attendanceType || "Standard"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-medium text-gray-500">
                          {log.clockIn ? format(new Date(log.clockIn), "MMM dd, yyyy • HH:mm:ss") : (log.timestamp ? format(new Date(log.timestamp), "MMM dd, yyyy • HH:mm:ss") : "N/A")}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[9px] uppercase tracking-wider">
                            <CheckCircle size={12} /> Sync
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <button className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors">View Trace</button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </InfoCard>
        </div>
      )}

      {/* ── Modals ── */}
      <TimetableFormModal isOpen={isTimetableModalOpen} onClose={() => setIsTimetableModalOpen(false)} />
      <ScheduleAssignmentModal isOpen={isAssignScheduleModalOpen} onClose={() => setIsAssignScheduleModalOpen(false)} onSave={() => setIsAssignScheduleModalOpen(false)} />
      <HolidayFormModal isOpen={isHolidayModalOpen} onClose={() => setIsHolidayModalOpen(false)} />
    </div>
  );
};

export default AttendanceModule;
