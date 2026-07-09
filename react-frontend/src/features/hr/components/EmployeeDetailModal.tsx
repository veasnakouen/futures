import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Badge, Progress, Spinner, Tooltip } from '@/lib/flowbite-compat';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  Monitor,
  FileText,
  Award,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Briefcase,
  GraduationCap,
  History,
  X,
  Download,
  UserCircle,
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
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  AreaChart,
  Area,
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

  const formatDateSafely = (dateStr: string | undefined, formatStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), formatStr);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 border-b rounded-t-md">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 group/avatar">
            <Avatar
              img={selectedEmployee?.photo}
              rounded
              size="md"
              className="transition-all duration-300 group-hover/avatar:scale-110 ring-2 ring-gray-100 dark:ring-gray-700 group-hover/avatar:ring-blue-200 dark:group-hover/avatar:ring-blue-900 cursor-pointer"
            />
            {selectedEmployee?.status === "Active" && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 rounded-full z-10"></div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-black dark:text-white leading-tight">
              Personnel Dossier: {selectedEmployee?.firstNameEnglish}{" "}
              {selectedEmployee?.lastNameEnglish}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              System Record ID: {selectedEmployee?.idNo || "TEMPORARY"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-md shadow-sm"
        >
          <X size={20} />
        </button>
      </div>
      <ModalBody className="p-0 dark:bg-gray-800">

        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50/50 dark:bg-gray-900/50 h-[85vh] overflow-hidden">
          <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">
            <EmployeeSidebar
              employee={selectedEmployee}
              activeMenu={portalTab}
              setActiveMenu={setPortalTab}
            />
          </div>
          <div className="flex-1 w-full min-w-0 h-full overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-black dark:text-white capitalize">
                {portalTab} Information
              </h2>
              <Button color="light" size="sm" onClick={() => window.print()} className="rounded-md">
                <FileText size={16} className="mr-2" /> Export Report
              </Button>
            </div>

            <div className="w-full space-y-6 pb-10">
              {portalTab === "profile" && <EmployeeProfileTab employee={selectedEmployee} />}
              {portalTab === "performance" && (
                <div className="space-y-10 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm h-[400px]">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                        Competency Radar
                      </h5>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={[
                            { subject: "Technical", A: 92, fullMark: 100 },
                            { subject: "Soft Skills", A: 88, fullMark: 100 },
                            { subject: "Punctuality", A: 95, fullMark: 100 },
                            { subject: "Leadership", A: 78, fullMark: 100 },
                            { subject: "Innovation", A: 85, fullMark: 100 },
                          ]}
                        >
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                              fill: "#64748b",
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          />
                          <Radar
                            name="Performance"
                            dataKey="A"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-6">
                      <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm bg-blue-600 text-white">
                        <h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">
                          Strategic Performance Note
                        </h5>
                        <p className="text-sm font-bold leading-relaxed italic">
                          "Exceeded all targets for Q1. Consistently
                          demonstrates high levels of initiative and technical
                          leadership. Recommended for senior-tier mentorship
                          roles."
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center font-black">
                            M
                          </div>
                          <p className="text-[10px] font-black uppercase">
                            Reviewed by Director of Operations
                          </p>
                        </div>
                      </div>
                      <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                          Quarterly KPI Growth
                        </h5>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { month: "Jan", val: 75 },
                                { month: "Feb", val: 82 },
                                { month: "Mar", val: 92 },
                              ]}
                            >
                              <defs>
                                <linearGradient
                                  id="colorVal"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <RechartsTooltip />
                              <Area
                                type="monotone"
                                dataKey="val"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorVal)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {portalTab === "attendance" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black dark:text-white">
                      Recent Attendance Logs
                    </h4>
                    {attendanceData.length > 0 && (
                      <Badge color="info">Historical Data Active</Badge>
                    )}
                  </div>

                  {loadingData ? (
                    <div className="flex justify-center py-12">
                      <Spinner size="xl" />
                    </div>
                  ) : attendanceData.length === 0 ? (
                    <div className="py-20 text-center rounded-md">
                      <Clock className="mx-auto text-gray-400 mb-4" size={40} />
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        No Attendance Records Found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attendanceData.map((log, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-5 bg-gray-50 dark:bg-gray-700/30 rounded-md border-transparent hover:border-blue-500/30 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                              <Clock size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black dark:text-white">
                                {formatDateSafely(log.clockIn, "MMM dd, yyyy")}
                              </p>
                              <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1">
                                <MapPin size={10} />{" "}
                                {log.location || "Central Office"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black dark:text-white">
                              {formatDateSafely(log.clockIn, "hh:mm a")} -{" "}
                              {log.clockOut
                                ? formatDateSafely(log.clockOut, "hh:mm a")
                                : "Active"}
                            </p>
                            <p
                              className={`text-[8px] font-black uppercase ${log.status === "Present" ? "text-emerald-500" : "text-amber-500"}`}
                            >
                              {log.status || "Active Session"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {portalTab === "leave" && (
                <div className="space-y-10 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        label: "Annual Leave",
                        val: 14,
                        total: 18,
                        color: "blue",
                      },
                      { label: "Sick Leave", val: 2, total: 10, color: "rose" },
                      { label: "Emergency", val: 0, total: 5, color: "amber" },
                    ].map((l, i) => (
                      <div
                        key={i}
                        className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-md text-center"
                      >
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-2">
                          {l.label}
                        </p>
                        <h5 className={`text-2xl font-black text-blue-600`}>
                          {l.val} / {l.total}
                        </h5>
                      </div>
                    ))}
                  </div>
                  <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                      Leave Request History
                    </h5>

                    {loadingData ? (
                      <div className="flex justify-center py-8">
                        <Spinner size="lg" />
                      </div>
                    ) : leaveData.length === 0 ? (
                      <div className="py-12 text-center rounded-md">
                        <Calendar
                          className="mx-auto text-gray-400 mb-3"
                          size={32}
                        />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          No Leave History Available
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leaveData.map((leave, i) => (
                          <div
                            key={i}
                            className="p-5 bg-gray-50 dark:bg-gray-700/20 rounded-md flex justify-between items-center"
                          >
                            <div>
                              <p className="text-xs font-black dark:text-white uppercase">
                                {leave.leaveType || "General Leave"}
                              </p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                                {formatDateSafely(leave.startDate, "MMM dd")} -{" "}
                                {formatDateSafely(
                                  leave.endDate,
                                  "MMM dd, yyyy",
                                )}
                              </p>
                            </div>
                            <Badge
                              color={
                                leave.status === "Approved"
                                  ? "success"
                                  : leave.status === "Pending"
                                    ? "warning"
                                    : "failure"
                              }
                            >
                              {leave.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {portalTab === "payroll" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-60">
                            Current Base Salary
                          </p>
                          <h5 className="text-4xl font-black">
                            ${selectedEmployee?.basicSalary?.toLocaleString()}
                          </h5>
                        </div>
                        <Badge color="info">Pay Grade E-4</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/10 rounded-md border-white/10">
                          <p className="text-[8px] font-black uppercase opacity-60">
                            Bank Account
                          </p>
                          <p className="text-xs font-black">
                            {selectedEmployee?.bankName} •{" "}
                            {selectedEmployee?.bankAccountNumber
                              ?.slice(-4)
                              .padStart(
                                selectedEmployee?.bankAccountNumber?.length ||
                                0,
                                "*",
                              ) || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-md border-white/10">
                          <p className="text-[8px] font-black uppercase opacity-60">
                            Last Disbursement
                          </p>
                          <p className="text-xs font-black">April 30, 2024</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 rounded-md dark:bg-gray-800 shadow-sm">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex justify-between">
                        <span>Detailed Earnings Preview</span>
                        <span className="text-blue-600">Q2 2024</span>
                      </h5>
                      <div className="space-y-4">
                        {[
                          {
                            label: "Basic Monthly Salary",
                            val: selectedEmployee?.basicSalary,
                            type: "plus",
                          },
                          {
                            label: "Technical Allowance",
                            val: 150,
                            type: "plus",
                          },
                          { label: "Seniority Bonus", val: 50, type: "plus" },
                          {
                            label: "Standard Tax Deductions",
                            val: -(selectedEmployee?.basicSalary * 0.05),
                            type: "minus",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="font-bold text-gray-500">
                              {item.label}
                            </span>
                            <span
                              className={`font-mono font-black ${item.type === "plus" ? "text-emerald-500" : "text-red-500"}`}
                            >
                              {item.val < 0 ? "-" : "+"}$
                              {Math.abs(item.val).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="pt-4 border-t-2 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase dark:text-white">
                            Estimated Net Payable
                          </span>
                          <span className="text-xl font-black text-blue-600">
                            $
                            {(
                              selectedEmployee?.basicSalary +
                              200 -
                              selectedEmployee?.basicSalary * 0.05
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {portalTab === "assets" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {[
                    {
                      name: 'MacBook Pro 16"',
                      sn: "MP2024-X82",
                      date: "Jan 2024",
                    },
                    {
                      name: 'Dell UltraSharp 27"',
                      sn: "DS27-9021",
                      date: "Jan 2024",
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-md flex items-center gap-6"
                    >
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-md flex items-center justify-center">
                        <Monitor size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black dark:text-white">
                          {a.name}
                        </p>
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          S/N: {a.sn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === "documents" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-black dark:text-white">
                      Employee Repository
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Photo ID",
                        icon: <UserCircle size={20} />,
                        color: "blue",
                        field: "photoIdAttachment",
                      },
                      {
                        label: "Contract",
                        icon: <FileText size={20} />,
                        color: "emerald",
                        field: "contractAttachment",
                      },
                      {
                        label: "ID Poor",
                        icon: <Award size={20} />,
                        color: "orange",
                        field: "idPoorAttachment",
                      },
                      {
                        label: "CV",
                        icon: <Briefcase size={20} />,
                        color: "violet",
                        field: "cvAttachment",
                      },
                    ].map((doc, i) => {
                      const fileUrl = selectedEmployee?.[doc.field];
                      return (
                        <div key={i} className="relative">
                          <div
                            onClick={() => {
                              if (fileUrl) {
                                window.open(fileUrl, "_blank");
                              }
                            }}
                            className={`p-4 rounded-lg flex flex-col items-center gap-2 group cursor-pointer transition-all ${fileUrl ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 hover:border-green-400" : "bg-gray-50 dark:bg-gray-700/50 "}`}
                          >
                            {fileUrl && (
                              <div className="absolute top-2 right-2 flex gap-1 z-10">
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const filename = `${doc.label.replace(/\\s+/g, "_")}_attachment`;
                                    if (
                                      fileUrl.includes("res.cloudinary.com") &&
                                      fileUrl.includes("/upload/")
                                    ) {
                                      const downloadUrl = fileUrl.replace(
                                        "/upload/",
                                        `/upload/fl_attachment:${filename}/`,
                                      );
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
                                  className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded bg-white dark:bg-gray-800 shadow-sm"
                                  title="Download Attachment"
                                >
                                  <Download size={12} />
                                </button>
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110 ${fileUrl ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
                            >
                              {doc.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              {doc.label}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${fileUrl ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}
                            >
                              {fileUrl
                                ? "Attached (Click to view)"
                                : "Not Attached"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {portalTab === "previous_position" &&
                (() => {
                  const prevPos = parsedCustomFields.find(
                    (f: any) => f.key === "legacyPreviousPosition",
                  )?.value;
                  return (
                    <div className="animate-fade-in space-y-8">
                      <div className="p-8 bg-gray-50 dark:bg-gray-700/20 rounded-md">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          Historical Placements
                        </h4>
                        {prevPos ? (
                          <div className="flex gap-4 items-start">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md">
                              <History size={20} />
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-sm font-bold whitespace-pre-wrap dark:text-white leading-relaxed">
                              {prevPos}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <History
                              size={48}
                              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                            />
                            <p className="text-xs font-bold text-gray-400 uppercase">
                              No previous position data recorded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {portalTab === "education" &&
                (() => {
                  const eduRaw = parsedCustomFields.find(
                    (f: any) => f.key === "legacyEducation",
                  )?.value;
                  let eduList: any[] = [];
                  if (eduRaw) {
                    try {
                      const parsed = JSON.parse(eduRaw);
                      eduList = Array.isArray(parsed) ? parsed : [];
                    } catch {
                      eduList = [
                        { institution: eduRaw, degree: "N/A", year: "N/A" },
                      ];
                    }
                  }
                  return (
                    <div className="animate-fade-in space-y-8">
                      <div className="p-8 bg-gray-50 dark:bg-gray-700/20 rounded-md">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          Academic Background
                        </h4>
                        {eduList.length > 0 ? (
                          <div className="space-y-6">
                            {eduList.map((edu, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-start pb-6 border-b last:border-b-0"
                              >
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                                  <GraduationCap size={20} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-black dark:text-white">
                                    {edu.institution}
                                  </h5>
                                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                                    {edu.degree || "Degree/Qualification"}
                                  </p>
                                  <Badge
                                    color="info"
                                    className="mt-2 inline-block rounded-md"
                                  >
                                    {edu.year || "Year"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <GraduationCap
                              size={48}
                              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                            />
                            <p className="text-xs font-bold text-gray-400 uppercase">
                              No academic records found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {portalTab === "work_experience" &&
                (() => {
                  const workRaw = parsedCustomFields.find(
                    (f: any) => f.key === "legacyWorkExperience",
                  )?.value;
                  let workList: any[] = [];
                  if (workRaw) {
                    try {
                      const parsed = JSON.parse(workRaw);
                      workList = Array.isArray(parsed) ? parsed : [];
                    } catch {
                      workList = [
                        {
                          company: workRaw,
                          position: "N/A",
                          duration: "N/A",
                          description: "",
                        },
                      ];
                    }
                  }
                  return (
                    <div className="animate-fade-in space-y-8">
                      <div className="p-8 bg-gray-50 dark:bg-gray-700/20 rounded-md">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          Professional Experience
                        </h4>
                        {workList.length > 0 ? (
                          <div className="space-y-6">
                            {workList.map((work, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-start pb-6 border-b last:border-b-0"
                              >
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md">
                                  <Briefcase size={20} />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-black dark:text-white">
                                    {work.company}
                                  </h5>
                                  <p className="text-xs font-bold text-blue-600 mt-1">
                                    {work.position}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                                    {work.description}
                                  </p>
                                  <Badge
                                    color="success"
                                    className="mt-3 inline-block rounded-md"
                                  >
                                    {work.duration || "Duration"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <Briefcase
                              size={48}
                              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                            />
                            <p className="text-xs font-bold text-gray-400 uppercase">
                              No prior work experience recorded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EmployeeDetailModal;
