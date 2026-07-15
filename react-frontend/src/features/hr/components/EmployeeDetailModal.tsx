import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Avatar, Badge, Spinner } from '@/lib/flowbite-compat';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  Monitor,
  FileText,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  History,
  X,
  Download,
  UserCircle,
  Printer,
  ChevronRight,
} from "lucide-react";
import api from '@/services/api';
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeProfileTab from "./EmployeeProfileTab";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
} from "recharts";

export interface EmployeeData {
  id: number | string;
  idNo?: string;
  firstNameEnglish?: string;
  lastNameEnglish?: string;
  firstNameKhmer?: string;
  lastNameKhmer?: string;
  photo?: string;
  status?: string;
  customFields?: string | any[];
  department?: { id?: number; name?: string; location?: string } | string;
  workShift?: { id?: number; name?: string } | string;
  currentPosition?: string;
  [key: string]: any;
}

export interface AttendanceRecord {
  id?: number;
  date?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: string;
  [key: string]: any;
}

export interface LeaveRecord {
  id?: number;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: any;
}

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: EmployeeData | null;
  portalTab: string;
  setPortalTab: (tab: string) => void;
}

/* ── Helpers ──────────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] mb-4">
    {children}
  </p>
);

const EmptyState: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300 dark:text-gray-600">
    <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-800">{icon}</div>
    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
  </div>
);

const InfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/60 rounded-2xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

/* ── Main Component ───────────────────────────────────────── */
const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  selectedEmployee,
  portalTab,
  setPortalTab,
}) => {
  const { data: attendanceData = [], isLoading: isLoadingAttendance } = useQuery<AttendanceRecord[]>({
    queryKey: ['employeeAttendance', selectedEmployee?.id],
    queryFn: async () => {
      const res = await api.get(`/hr/attendance/employee/${selectedEmployee?.id}`);
      return res.data || [];
    },
    enabled: isOpen && !!selectedEmployee?.id && portalTab === "attendance",
  });

  const { data: leaveData = [], isLoading: isLoadingLeave } = useQuery<LeaveRecord[]>({
    queryKey: ['employeeLeave', selectedEmployee?.id],
    queryFn: async () => {
      const res = await api.get(`/hr/leaves/employee/${selectedEmployee?.id}`);
      return res.data || [];
    },
    enabled: isOpen && !!selectedEmployee?.id && portalTab === "leave",
  });

  const loadingData = isLoadingAttendance || isLoadingLeave;

  const parsedCustomFields = React.useMemo(() => {
    try {
      if (typeof selectedEmployee?.customFields === "string") {
        return JSON.parse(selectedEmployee.customFields);
      }
      if (Array.isArray(selectedEmployee?.customFields)) {
        return selectedEmployee.customFields;
      }
    } catch (e) {
      console.error("Failed to parse customFields", e);
    }
    return [];
  }, [selectedEmployee?.customFields]);

  const fmt = (dateStr: string | undefined, formatStr: string) => {
    if (!dateStr) return "N/A";
    try { return format(new Date(dateStr), formatStr); } catch { return dateStr; }
  };

  const tabLabel = (tab: string) => {
    const map: Record<string, string> = {
      profile: "Profile Overview",
      performance: "Performance",
      attendance: "Attendance",
      leave: "Leave Management",
      payroll: "Payroll",
      assets: "Assets & Equipment",
      documents: "Documents",
      history: "History & Experience",
      previous_position: "Previous Position",
      education: "Education",
      work_experience: "Work Experience",
    };
    return map[tab] ?? tab;
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="7xl"
      className="[&_.fixed.inset-0]:bg-black/60 [&_.fixed.inset-0]:backdrop-blur-sm"
    >
      {/* ── Modal Shell ── */}
      <div className="flex flex-col bg-gray-50 dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5 max-h-[92vh]">

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          {/* Left accent stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-[#7a2323] to-[#c53030]" />

          <div className="flex items-center gap-4 pl-3">
            {/* Avatar with status ring */}
            <div className="relative shrink-0">
              <div className="p-0.5 rounded-full bg-gradient-to-br from-[#7a2323] to-[#f87171]">
                <div className="p-0.5 rounded-full bg-white dark:bg-gray-900">
                  <Avatar
                    img={selectedEmployee?.photo}
                    rounded
                    size="md"
                    className="ring-0"
                  />
                </div>
              </div>
              {selectedEmployee?.status === "Active" && (
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-gray-900 rounded-full" />
              )}
            </div>

            {/* Name block */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {selectedEmployee?.firstNameEnglish} {selectedEmployee?.lastNameEnglish}
                </h3>
                {selectedEmployee?.status && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    selectedEmployee.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {selectedEmployee.status}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mt-0.5">
                Personnel Dossier &nbsp;·&nbsp; ID: {selectedEmployee?.idNo || "—"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer size={13} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col lg:flex-row gap-0 overflow-hidden flex-1 min-h-0">

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 overflow-y-auto bg-gray-50 dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-4 custom-scrollbar">
            <EmployeeSidebar
              employee={selectedEmployee}
              activeMenu={portalTab}
              setActiveMenu={setPortalTab}
            />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-950 custom-scrollbar">
            {/* Content header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Dossier</span>
                <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
                <span className="font-black text-gray-800 dark:text-white capitalize">{tabLabel(portalTab)}</span>
              </div>
            </div>

            <div className="p-6 space-y-6 pb-12">

              {/* ── PROFILE ── */}
              {portalTab === "profile" && <EmployeeProfileTab employee={selectedEmployee} />}

              {/* ── PERFORMANCE ── */}
              {portalTab === "performance" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard className="h-[360px]">
                      <SectionLabel>Competency Radar</SectionLabel>
                      <ResponsiveContainer width="100%" height="90%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%"
                          data={[
                            { subject: "Technical", A: 92, fullMark: 100 },
                            { subject: "Soft Skills", A: 88, fullMark: 100 },
                            { subject: "Punctuality", A: 95, fullMark: 100 },
                            { subject: "Leadership", A: 78, fullMark: 100 },
                            { subject: "Innovation", A: 85, fullMark: 100 },
                          ]}
                        >
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} />
                          <Radar name="Performance" dataKey="A" stroke="#c53030" fill="#c53030" fillOpacity={0.35} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </InfoCard>

                    <div className="flex flex-col gap-4">
                      {/* Performance note card */}
                      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#7a2323] via-[#9b2c2c] to-[#c53030] p-6 text-white shadow-lg shadow-red-900/20 flex-1">
                        <SectionLabel><span className="text-white/60">Strategic Performance Note</span></SectionLabel>
                        <p className="text-sm font-medium leading-relaxed italic text-white/90">
                          "Exceeded all targets for Q1. Consistently demonstrates high levels of initiative and technical leadership. Recommended for senior-tier mentorship roles."
                        </p>
                        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/20">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">M</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Director of Operations</p>
                        </div>
                      </div>

                      {/* KPI trend */}
                      <InfoCard>
                        <div className="flex justify-between items-center mb-3">
                          <SectionLabel><span className="mb-0">Quarterly KPI Growth</span></SectionLabel>
                          <span className="text-[10px] font-black text-[#c53030] uppercase tracking-widest">Q1 → Q3</span>
                        </div>
                        <div className="h-28">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{ month: "Jan", val: 75 }, { month: "Feb", val: 82 }, { month: "Mar", val: 92 }]}>
                              <defs>
                                <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#c53030" stopOpacity={0.25} />
                                  <stop offset="95%" stopColor="#c53030" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <RechartsTooltip />
                              <Area type="monotone" dataKey="val" stroke="#c53030" strokeWidth={2} fillOpacity={1} fill="url(#kpiGrad)" dot={{ r: 4, fill: "#c53030", strokeWidth: 0 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </InfoCard>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ATTENDANCE ── */}
              {portalTab === "attendance" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Recent Attendance Logs</SectionLabel>
                    {attendanceData.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest">
                        Historical Active
                      </span>
                    )}
                  </div>
                  {loadingData ? (
                    <div className="flex justify-center py-16"><Spinner size="xl" /></div>
                  ) : attendanceData.length === 0 ? (
                    <EmptyState icon={<Clock size={36} />} label="No Attendance Records Found" />
                  ) : (
                    <div className="space-y-2">
                      {attendanceData.map((log, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-[#c53030]/30 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#c53030] flex items-center justify-center flex-shrink-0">
                              <Clock size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-800 dark:text-white">{fmt(log.clockIn, "MMM dd, yyyy")}</p>
                              <p className="text-[9px] font-semibold text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={9} /> {log.location || "Central Office"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-gray-800 dark:text-white">
                              {fmt(log.clockIn, "hh:mm a")} — {log.clockOut ? fmt(log.clockOut, "hh:mm a") : "Active"}
                            </p>
                            <p className={`text-[9px] font-black uppercase mt-0.5 ${log.status === "Present" ? "text-emerald-500" : "text-amber-500"}`}>
                              {log.status || "Active Session"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── LEAVE ── */}
              {portalTab === "leave" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Annual Leave", val: 14, total: 18, color: "#3b82f6" },
                      { label: "Sick Leave", val: 2, total: 10, color: "#f43f5e" },
                      { label: "Emergency", val: 0, total: 5, color: "#f59e0b" },
                    ].map((l) => (
                      <div key={l.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-5 text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{l.label}</p>
                        <p className="text-2xl font-black" style={{ color: l.color }}>{l.val}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">of {l.total} days</p>
                        <div className="mt-2 w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(l.val / l.total) * 100}%`, backgroundColor: l.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <InfoCard>
                    <SectionLabel>Leave Request History</SectionLabel>
                    {loadingData ? (
                      <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                    ) : leaveData.length === 0 ? (
                      <EmptyState icon={<Calendar size={36} />} label="No Leave History Available" />
                    ) : (
                      <div className="space-y-3">
                        {leaveData.map((leave, i) => (
                          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-xs font-black text-gray-800 dark:text-white uppercase">{leave.leaveType || "General Leave"}</p>
                              <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase">
                                {fmt(leave.startDate, "MMM dd")} — {fmt(leave.endDate, "MMM dd, yyyy")}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              leave.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : leave.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {leave.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </InfoCard>
                </div>
              )}

              {/* ── PAYROLL ── */}
              {portalTab === "payroll" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Salary Card */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-blue-950 p-7 text-white shadow-xl shadow-blue-900/30">
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                      <div className="relative">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Current Base Salary</p>
                        <h4 className="text-4xl font-black tracking-tight">
                          ${selectedEmployee?.basicSalary?.toLocaleString() ?? "—"}
                        </h4>
                        <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase tracking-widest">Pay Grade E-4</span>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                          {[
                            { label: "Bank Account", value: `${selectedEmployee?.bankName || "—"} ·· ${selectedEmployee?.bankAccountNumber?.slice(-4) || "****"}` },
                            { label: "Last Disbursement", value: "April 30, 2024" },
                          ].map((f) => (
                            <div key={f.label} className="bg-white/10 rounded-xl p-3">
                              <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{f.label}</p>
                              <p className="text-xs font-bold mt-1 text-white/90">{f.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <InfoCard>
                      <div className="flex justify-between items-center mb-5">
                        <SectionLabel><span className="mb-0">Earnings Breakdown</span></SectionLabel>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Q2 2024</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Basic Monthly Salary", val: selectedEmployee?.basicSalary, type: "plus" },
                          { label: "Technical Allowance", val: 150, type: "plus" },
                          { label: "Seniority Bonus", val: 50, type: "plus" },
                          { label: "Tax Deductions (5%)", val: -(selectedEmployee?.basicSalary * 0.05), type: "minus" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{item.label}</span>
                            <span className={`text-xs font-black font-mono ${item.type === "plus" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                              {item.val < 0 ? "−" : "+"}${Math.abs(item.val ?? 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3">
                          <span className="text-xs font-black uppercase text-gray-700 dark:text-white tracking-wide">Net Payable</span>
                          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                            ${((selectedEmployee?.basicSalary ?? 0) + 200 - (selectedEmployee?.basicSalary ?? 0) * 0.05).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </InfoCard>
                  </div>
                </div>
              )}

              {/* ── ASSETS ── */}
              {portalTab === "assets" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  {[
                    { name: 'MacBook Pro 16"', sn: "MP2024-X82", date: "Jan 2024" },
                    { name: 'Dell UltraSharp 27"', sn: "DS27-9021", date: "Jan 2024" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Monitor size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800 dark:text-white">{a.name}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">S/N: {a.sn}</p>
                        <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">Issued {a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {portalTab === "documents" && (
                <div className="space-y-4 animate-fade-in">
                  <SectionLabel>Employee Repository</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Photo ID", icon: <UserCircle size={22} />, field: "photoIdAttachment", color: "blue" },
                      { label: "Contract", icon: <FileText size={22} />, field: "contractAttachment", color: "emerald" },
                      { label: "ID Poor", icon: <Award size={22} />, field: "idPoorAttachment", color: "orange" },
                      { label: "CV", icon: <Briefcase size={22} />, field: "cvAttachment", color: "violet" },
                    ].map((doc, i) => {
                      const fileUrl = selectedEmployee?.[doc.field];
                      return (
                        <div
                          key={i}
                          onClick={() => { if (fileUrl) window.open(fileUrl, "_blank"); }}
                          className={`relative group cursor-pointer rounded-2xl border p-5 flex flex-col items-center gap-3 transition-all duration-200 ${
                            fileUrl
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700/40 hover:shadow-lg hover:border-emerald-400"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-70"
                          }`}
                        >
                          {fileUrl && (
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const filename = `${doc.label.replace(/\s+/g, "_")}_attachment`;
                                if (fileUrl.includes("res.cloudinary.com") && fileUrl.includes("/upload/")) {
                                  const downloadUrl = fileUrl.replace("/upload/", `/upload/fl_attachment:${filename}/`);
                                  const link = document.createElement("a");
                                  link.href = downloadUrl;
                                  link.download = filename;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  return;
                                }
                                window.open(fileUrl, "_blank");
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-gray-800 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 shadow-sm transition-colors"
                              title="Download"
                            >
                              <Download size={12} />
                            </button>
                          )}
                          <div className={`p-3 rounded-2xl transition-transform duration-200 group-hover:scale-110 ${
                            fileUrl
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                              : "bg-white dark:bg-gray-800 text-gray-400"
                          }`}>
                            {doc.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">{doc.label}</span>
                          <span className={`text-[9px] font-bold ${fileUrl ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                            {fileUrl ? "Attached · Click to view" : "Not Attached"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── HISTORY / PREVIOUS POSITION ── */}
              {(portalTab === "previous_position" || portalTab === "history") &&
                (() => {
                  const prevPos = parsedCustomFields.find((f: any) => f.key === "legacyPreviousPosition")?.value;
                  return (
                    <div className="animate-fade-in space-y-4">
                      <InfoCard>
                        <SectionLabel>Historical Placements</SectionLabel>
                        {prevPos ? (
                          <div className="flex gap-4 items-start">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex-shrink-0">
                              <History size={20} />
                            </div>
                            <div className="prose dark:prose-invert text-sm font-semibold whitespace-pre-wrap dark:text-white leading-relaxed">{prevPos}</div>
                          </div>
                        ) : (
                          <EmptyState icon={<History size={36} />} label="No previous position data recorded" />
                        )}
                      </InfoCard>
                    </div>
                  );
                })()}

              {/* ── EDUCATION ── */}
              {portalTab === "education" &&
                (() => {
                  const eduRaw = parsedCustomFields.find((f: any) => f.key === "legacyEducation")?.value;
                  let eduList: any[] = [];
                  if (eduRaw) {
                    try {
                      const parsed = JSON.parse(eduRaw);
                      eduList = Array.isArray(parsed) ? parsed : [];
                    } catch {
                      eduList = [{ institution: eduRaw, degree: "N/A", year: "N/A" }];
                    }
                  }
                  return (
                    <div className="animate-fade-in">
                      <InfoCard>
                        <SectionLabel>Academic Background</SectionLabel>
                        {eduList.length > 0 ? (
                          <div className="space-y-5">
                            {eduList.map((edu, idx) => (
                              <div key={idx} className="flex gap-4 items-start pb-5 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex-shrink-0">
                                  <GraduationCap size={20} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-black text-gray-800 dark:text-white">{edu.institution}</h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{edu.degree || "Degree/Qualification"}</p>
                                  <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest">
                                    {edu.year || "Year"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState icon={<GraduationCap size={36} />} label="No academic records found" />
                        )}
                      </InfoCard>
                    </div>
                  );
                })()}

              {/* ── WORK EXPERIENCE ── */}
              {portalTab === "work_experience" &&
                (() => {
                  const workRaw = parsedCustomFields.find((f: any) => f.key === "legacyWorkExperience")?.value;
                  let workList: any[] = [];
                  if (workRaw) {
                    try {
                      const parsed = JSON.parse(workRaw);
                      workList = Array.isArray(parsed) ? parsed : [];
                    } catch {
                      workList = [{ company: workRaw, position: "N/A", duration: "N/A", description: "" }];
                    }
                  }
                  return (
                    <div className="animate-fade-in">
                      <InfoCard>
                        <SectionLabel>Professional Experience</SectionLabel>
                        {workList.length > 0 ? (
                          <div className="space-y-5">
                            {workList.map((work, idx) => (
                              <div key={idx} className="flex gap-4 items-start pb-5 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex-shrink-0">
                                  <Briefcase size={20} />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-black text-gray-800 dark:text-white">{work.company}</h5>
                                  <p className="text-xs font-bold text-[#c53030] dark:text-red-400 mt-1">{work.position}</p>
                                  {work.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium leading-relaxed">{work.description}</p>
                                  )}
                                  <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                    {work.duration || "Duration"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState icon={<Briefcase size={36} />} label="No prior work experience recorded" />
                        )}
                      </InfoCard>
                    </div>
                  );
                })()}

            </div>
          </main>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetailModal;
