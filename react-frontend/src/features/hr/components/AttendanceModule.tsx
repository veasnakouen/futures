import React, { useState } from "react";
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
} from "lucide-react";
import {Button, Badge, Avatar, Select, TextInput, Checkbox, Label, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell} from '@/lib/flowbite-compat';
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

interface AttendanceModuleProps {
  globalAttendance: any[];
  onManualLog: () => void;
  onOpenDeviceManager: () => void;
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  globalAttendance,
  onManualLog,
  onOpenDeviceManager,
}) => {
  const [subTab, setSubTab] = React.useState<"MATRIX" | "SCHEDULE" | "REPORTS">(
    "MATRIX",
  );
  const [matrixSearch, setMatrixSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unmappedOnly, setUnmappedOnly] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [itemsPerRow, setItemsPerRow] = useState("4");

  // Real-time Analytics Calculations
  const onPremisesCount = React.useMemo(() => {
    return globalAttendance.filter((a) => a.status === "Present" && !a.clockOut)
      .length;
  }, [globalAttendance]);

  const punctualityScore = React.useMemo(() => {
    if (!globalAttendance.length) return 100;
    const late = globalAttendance.filter((a) => a.status === "Late").length;
    return (100 - (late / globalAttendance.length) * 100).toFixed(1);
  }, [globalAttendance]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Sub-Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100/80 dark:bg-gray-900/60 p-1.5 rounded-md flex items-center gap-1.5 /50 shadow-inner w-full sm:w-max overflow-x-auto whitespace-nowrap no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap shrink-0">
          {(["MATRIX", "SCHEDULE", "REPORTS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`shrink-0 px-8 py-2.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${subTab === tab ?"bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-95 hover:scale-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {subTab === "MATRIX" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center border-l-4 border-l-blue-600 bg-white">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                On Premises
              </p>
              <h4 className="text-3xl font-black dark:text-white">12</h4>
            </div>
            <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center bg-white">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                OT Hours
              </p>
              <h4 className="text-3xl font-black text-blue-600">42.5h</h4>
            </div>
            <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center bg-white">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                OT Payout
              </p>
              <h4 className="text-3xl font-black text-emerald-500">$850</h4>
            </div>
            <div className="p-6 rounded-md bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-lg shadow-blue-500/20 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-md bg-emerald-400 animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    Biometric Sync
                  </p>
                </div>
                <h4 className="text-xl font-black">Nodes Online</h4>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-all">
                    Sync
                  </button>
                  <button
                    onClick={onOpenDeviceManager}
                    className="flex-1 text-[9px] font-black uppercase tracking-[0.2em] bg-white text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-all"
                  >
                    Manage Nodes
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                color="blue"
                onClick={onManualLog}
                className="rounded-md h-12 shadow-lg shadow-blue-500/20 font-black uppercase text-[10px]"
              >
                <Clock size={16} className="mr-2" /> Manual Log
              </Button>
              <Button
                color="light"
                className="rounded-md h-12 font-black uppercase text-[10px]"
              >
                <FileText size={16} className="mr-2" /> Attendance Audit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-md dark:bg-gray-800 border-none shadow-sm h-[300px] bg-white">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-600" /> Weekly
                  Presence Trends
                </h4>
                <Badge color="info">Last 7 Days</Badge>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: "Mon", count: 42 },
                    { day: "Tue", count: 38 },
                    { day: "Wed", count: 45 },
                    { day: "Thu", count: 40 },
                    { day: "Fri", count: 35 },
                    { day: "Sat", count: 12 },
                    { day: "Sun", count: 8 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {[42, 38, 45, 40, 35, 12, 8].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry > 30 ? "#3b82f6" : "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                  Punctuality Score
                </h5>
                <h3 className="text-4xl font-black">{punctualityScore}%</h3>
                <p className="text-[10px] font-bold mt-4 opacity-80">
                  +2.1% improvement from last week's aggregate
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-md overflow-hidden">
                    <div className="h-full bg-white w-[94.8%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
            <div className="p-8 border-b space-y-6 bg-gray-50/50 dark:bg-gray-700/20">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-xl dark:text-white">
                  Attendance Matrix
                </h4>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-md bg-blue-600"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Fingerprint Linked
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge color="success" className="rounded-md">
                      Present
                    </Badge>
                    <Badge color="warning" className="rounded-md">
                      Late
                    </Badge>
                    <Badge color="failure" className="rounded-md">
                      Absent
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    {viewMode === "grid" && (
                      <div className="flex-shrink-0">
                        <select
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                          value={itemsPerRow}
                          onChange={(e) => setItemsPerRow(e.target.value)}
                        >
                          <option value="3">3 per row</option>
                          <option value="4">4 per row</option>
                          <option value="5">5 per row</option>
                        </select>
                      </div>
                    )}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-md transition-all ${viewMode ==="grid"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-md transition-all ${viewMode ==="list"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search personnel or ID..."
                    className="w-full h-10 pl-10 pr-8 bg-white dark:bg-gray-800 rounded-md focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all text-xs font-semibold shadow-sm"
                    value={matrixSearch}
                    onChange={(e) => setMatrixSearch(e.target.value)}
                  />
                  {matrixSearch && (
                    <button
                      type="button"
                      onClick={() => setMatrixSearch("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <div className="flex gap-4 items-center h-10">
                  <div className="flex items-center gap-2 px-3 h-full bg-gray-50 dark:bg-gray-700/30 rounded-md">
                    <Checkbox
                      id="unmapped-only"
                      checked={unmappedOnly}
                      onChange={(e) => setUnmappedOnly(e.target.checked)}
                    />
                    <Label
                      htmlFor="unmapped-only"
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer"
                    >
                      Unmapped Only
                    </Label>
                  </div>
                  <Select
                    sizing="sm"
                    className="min-w-[150px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              {viewMode === "list" ? (
                <Table hoverable>
                  <TableHead>
                    <TableHeadCell>Personnel</TableHeadCell>
                    <TableHeadCell>Shift</TableHeadCell>
                    <TableHeadCell>Clock In</TableHeadCell>
                    <TableHeadCell>Biometric</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">
                      Location
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {(globalAttendance || [])
                      .filter((log) => {
                        const fullName = log.employee
                          ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}`
                          : log.employeeName || "";
                        return fullName
                          .toLowerCase()
                          .includes(matrixSearch.toLowerCase());
                      })
                      .filter(
                        (log) =>
                          statusFilter === "" || log.status === statusFilter,
                      )
                      .filter((log) => !unmappedOnly || !log.employee)
                      .map((log, i) => (
                        <TableRow key={i}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar rounded size="xs" />
                            <span className="font-black dark:text-white uppercase tracking-tight text-xs">
                              {log.employee
                                ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}`
                                : log.employeeName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-[9px] font-black text-gray-400 uppercase">
                              Day Shift
                            </span>
                          </TableCell>
                          <TableCell>
                            {log.clockIn ? (
                              <span className="font-mono text-blue-600 font-bold text-xs">
                                {format(new Date(log.clockIn), "hh:mm a")}
                              </span>
                            ) : (
                              <span className="text-gray-300 font-mono text-xs">
                                ---
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-emerald-500">
                              <Zap size={10} fill="currentColor" />
                              <span className="text-[9px] font-black uppercase">
                                Verified
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                log.status === "Present" ? "success" : "warning"
                              }
                              className="rounded-md text-[9px]"
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-500 text-[10px] font-bold">
                              <MapPin size={10} /> {log.location}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className={`grid gap-4 p-6 bg-gray-50/30 dark:bg-gray-900/10 ${itemsPerRow ==="3"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3": itemsPerRow ==="5"?"grid-cols-1 md:grid-cols-3 lg:grid-cols-5":"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
                  {(globalAttendance || [])
                    .filter((log) => {
                      const fullName = log.employee
                        ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}`
                        : log.employeeName || "";
                      return fullName
                        .toLowerCase()
                        .includes(matrixSearch.toLowerCase());
                    })
                    .filter(
                      (log) =>
                        statusFilter === "" || log.status === statusFilter,
                    )
                    .filter((log) => !unmappedOnly || !log.employee)
                    .slice(0, 12)
                    .map((log, i) => (
                      <div
                        key={i}
                        className="border-none shadow-sm hover:shadow-lg transition-all dark:bg-gray-800 p-0 overflow-hidden rounded-md bg-white"
                      >
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar rounded size="md" />
                              <div>
                                <h4 className="font-black dark:text-white uppercase tracking-tight text-sm">
                                  {log.employee
                                    ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}`
                                    : log.employeeName}
                                </h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  Day Shift
                                </p>
                              </div>
                            </div>
                            <Badge
                              color={
                                log.status === "Present" ? "success" : "warning"
                              }
                              size="xs"
                              className="rounded-md px-2 font-black uppercase text-[8px]"
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                              <Clock size={14} className="text-blue-500" /> In:{" "}
                              {log.clockIn
                                ? format(new Date(log.clockIn), "hh:mm a")
                                : "---"}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                              <MapPin size={14} className="text-rose-500" />{" "}
                              {log.location}
                            </div>
                          </div>
                          <div className="pt-2 border-t flex items-center gap-2 text-emerald-500">
                            <Zap size={10} fill="currentColor" />
                            <span className="text-[8px] font-black uppercase tracking-widest">
                              Biometric Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {subTab === "SCHEDULE" && (
        <div className="space-y-8 animate-fade-in pb-12">
          {/* Shift Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "Day Shift",
                time: "08:00 - 17:00",
                count: 12,
                color: "blue",
              },
              {
                name: "Swing Shift",
                time: "14:00 - 22:00",
                count: 5,
                color: "indigo",
              },
              {
                name: "Night Shift",
                time: "22:00 - 06:00",
                count: 3,
                color: "gray",
              },
              {
                name: "General Duty",
                time: "Flexible",
                count: 8,
                color: "emerald",
              },
            ].map((shift, i) => (
              <div
                key={i}
                className={`p-6 bg-white rounded-md dark:bg-gray-800  shadow-sm hover:shadow-lg transition-all group`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2 rounded-md bg-${shift.color}-100 dark:bg-${shift.color}-900/20 text-${shift.color}-600`}
                  >
                    <Clock size={18} />
                  </div>
                  <Badge
                    color={shift.name === "Day Shift" ? "success" : "gray"}
                    className="rounded-md"
                  >
                    Active
                  </Badge>
                </div>
                <h5 className="mt-4 text-sm font-black dark:text-white uppercase tracking-tight">
                  {shift.name}
                </h5>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                  {shift.time}
                </p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Personnel
                  </span>
                  <span className="text-lg font-black dark:text-white">
                    {shift.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Roster Timeline */}
            <div className="lg:col-span-2 p-8 rounded-md dark:bg-gray-800 border-none shadow-sm overflow-hidden bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">
                    Operational Duty Roster
                  </h4>
                  <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">
                    Week 18 • May 2024
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button color="light" size="xs" className="rounded-md">
                    Previous
                  </Button>
                  <Button color="light" size="xs" className="rounded-md">
                    Next
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 text-[10px] font-black text-gray-400 uppercase">
                        {day}
                      </div>
                      <div className="flex-1 h-10 bg-gray-50 dark:bg-gray-700/30 rounded-md relative overflow-hidden flex items-center px-4">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-50"></div>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                          {[1, 2, 3].map((id) => (
                            <div
                              key={id}
                              className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/40 border-white -ml-2 first:ml-0 flex items-center justify-center text-[8px] font-black text-blue-600"
                            >
                              {id}
                            </div>
                          ))}
                          <span className="text-[8px] font-black text-gray-500 uppercase ml-2">
                            + {12 - i} Staff Assigned
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Holiday & Event Registry */}
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm bg-white">
              <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em] mb-6">
                Upcoming Holidays
              </h4>
              <div className="space-y-6">
                {[
                  {
                    name: "Visak Bochea",
                    date: "May 22",
                    days: "1 Day",
                    status: "Mandatory",
                  },
                  {
                    name: "Royal Plowing Ceremony",
                    date: "May 24",
                    days: "1 Day",
                    status: "Mandatory",
                  },
                  {
                    name: "Queen Mother Birthday",
                    date: "June 18",
                    days: "1 Day",
                    status: "Corporate",
                  },
                ].map((h, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black uppercase leading-none">
                        {h.date.split(" ")[0]}
                      </span>
                      <span className="text-sm font-black leading-none">
                        {h.date.split(" ")[1]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black dark:text-white uppercase leading-tight">
                        {h.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          {h.days}
                        </span>
                        <div className="w-1 h-1 rounded-md bg-gray-300"></div>
                        <span className="text-[8px] font-black text-amber-600 uppercase">
                          {h.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  color="blue"
                  onClick={() => setIsHolidayModalOpen(true)}
                  className="w-full mt-6 rounded-md font-black uppercase text-[10px] h-12 shadow-lg shadow-blue-500/20"
                >
                  <Plus size={16} className="mr-2" /> Add Holiday
                </Button>
              </div>
            </div>
          </div>

          <HolidayModal
            isOpen={isHolidayModalOpen}
            onClose={() => setIsHolidayModalOpen(false)}
            onSubmit={(data) => {
              toast.success(`${data.name} added to the operational roster`);
              // In a real app, this would call an API
            }}
          />
        </div>
      )}

      {subTab === "REPORTS" && (
        <div className="space-y-8 animate-fade-in pb-12">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Overall Punctuality
              </p>
              <h3 className="text-3xl font-black dark:text-white">94.2%</h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-500">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase">
                  +2.1% this month
                </span>
              </div>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Average Delay
              </p>
              <h3 className="text-3xl font-black dark:text-white">8.5m</h3>
              <div className="mt-4 flex items-center gap-2 text-amber-500">
                <Clock size={14} />
                <span className="text-[10px] font-black uppercase">
                  -1.2m vs last week
                </span>
              </div>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Unauthorized Absence
              </p>
              <h3 className="text-3xl font-black text-red-500">1.4%</h3>
              <div className="mt-4 flex items-center gap-2 text-gray-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase">
                  Within safety limit
                </span>
              </div>
            </div>
            <div className="p-8 bg-blue-600 rounded-md shadow-md shadow-blue-500/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">
                Report Generation
              </p>
              <h3 className="text-xl font-black mb-4">Export Intelligence</h3>
              <div className="flex gap-2">
                <Button
                  color="white"
                  size="xs"
                  className="flex-1 rounded-md font-black uppercase text-[8px] text-blue-600"
                >
                  PDF
                </Button>
                <Button
                  color="white"
                  size="xs"
                  className="flex-1 rounded-md font-black uppercase text-[8px] text-blue-600"
                >
                  Excel
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Presence Heatmap */}
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm h-[400px] bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">
                    Workforce Presence Heatmap
                  </h4>
                  <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">
                    Monthly Aggregated Pulse
                  </p>
                </div>
                <Select className="rounded-md text-[10px] font-black uppercase">
                  <option>April 2024</option>
                  <option>March 2024</option>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { date: "01", present: 45 },
                    { date: "05", present: 42 },
                    { date: "10", present: 48 },
                    { date: "15", present: 38 },
                    { date: "20", present: 52 },
                    { date: "25", present: 45 },
                    { date: "30", present: 50 },
                  ]}
                >
                  <defs>
                    <linearGradient
                      id="colorPresence"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPresence)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Departmental Efficiency */}
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm h-[400px] bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">
                    Departmental Efficiency
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">
                    Top Performers Analysis
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { dept: "IT & Ops", score: 98 },
                    { dept: "Social", score: 92 },
                    { dept: "Admin", score: 95 },
                    { dept: "Finance", score: 88 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="dept"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: "bold", fill: "#64748b" }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "12px", border: "none" }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                    {[98, 92, 95, 88].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry > 94 ? "#10b981" : "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Audit Table */}
          <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
              <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">
                Anomalous Attendance Audit
              </h4>
              <Badge color="warning" className="rounded-md">
                Review Required
              </Badge>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
              <Table
                hoverable
                className="border-none w-full min-w-[800px] relative"
              >
                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/90 dark:bg-gray-700/90 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b">
                  <TableHeadCell className="px-8 py-5">Personnel</TableHeadCell>
                  <TableHeadCell className="px-8 py-5">
                    Anomaly Type
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-5">Frequency</TableHeadCell>
                  <TableHeadCell className="px-8 py-5">
                    Impact Score
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-5 text-right">
                    Action
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {[
                    {
                      name: "Elena Gilbert",
                      type: "Consistent Late-In",
                      freq: "4/7 days",
                      impact: "Medium",
                    },
                    {
                      name: "Tony Stark",
                      type: "Unmapped Location",
                      freq: "2/7 days",
                      impact: "Low",
                    },
                  ].map((row, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors bg-white dark:bg-gray-800"
                    >
                      <TableCell className="px-8 py-5 font-black dark:text-white">
                        {row.name}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-[10px] font-black text-amber-600 uppercase">
                        {row.type}
                      </TableCell>
                      <TableCell className="px-8 py-5 font-bold dark:text-gray-400 text-xs">
                        {row.freq}
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <Badge
                          color={row.impact === "Medium" ? "warning" : "info"}
                          className="rounded-md"
                        >
                          {row.impact}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <Button
                          color="light"
                          size="xs"
                          className="rounded-md ml-auto"
                        >
                          Investigate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {subTab === "REPORTS" && (
        <div className="space-y-6 animate-fade-in pb-20">
          <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
              <div>
                <h4 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                  Attendance Audit Ledger
                </h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Export verified clock-in/out records for compliance
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    const ws = XLSX.utils.json_to_sheet(
                      (globalAttendance || []).map((a) => ({
                        Employee: a.employee
                          ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
                          : "Unknown",
                        Type: a.attendanceType || "Standard",
                        Timestamp: a.clockIn
                          ? format(new Date(a.clockIn), "yyyy-MM-dd HH:mm:ss")
                          : a.timestamp
                            ? format(
                              new Date(a.timestamp),
                              "yyyy-MM-dd HH:mm:ss",
                            )
                            : "N/A",
                        Status: a.status,
                      })),
                    );
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Attendance Logs");
                    XLSX.writeFile(
                      wb,
                      `Attendance_Audit_${new Date().toLocaleDateString()}.xlsx`,
                    );
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-md border-none shadow-lg shadow-emerald-500/20"
                >
                  <Download size={16} className="mr-2" /> Export to Excel
                </Button>
                <Button
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.text("Workforce Attendance Audit", 20, 10);
                    autoTable(doc, {
                      head: [["Employee", "Type", "Timestamp", "Status"]],
                      body: (globalAttendance || []).map((a) => [
                        a.employee
                          ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
                          : "Unknown",
                        a.attendanceType || "Standard",
                        a.clockIn
                          ? format(new Date(a.clockIn), "yyyy-MM-dd HH:mm:ss")
                          : a.timestamp
                            ? format(
                              new Date(a.timestamp),
                              "yyyy-MM-dd HH:mm:ss",
                            )
                            : "N/A",
                        a.status,
                      ]),
                    });
                    doc.save(`Attendance_Report_${new Date().getTime()}.pdf`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-md border-none shadow-lg shadow-blue-500/20"
                >
                  <FileText size={16} className="mr-2" /> Download PDF
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
              <Table
                hoverable
                className="border-none w-full min-w-[800px] relative"
              >
                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/90 dark:bg-gray-700/90 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b">
                  <TableHeadCell className="px-8 py-5">Personnel</TableHeadCell>
                  <TableHeadCell className="px-8 py-5">Method</TableHeadCell>
                  <TableHeadCell className="px-8 py-5">
                    Date & Time
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-5">Status</TableHeadCell>
                  <TableHeadCell className="px-8 py-5 text-right">
                    Verification
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {!globalAttendance || globalAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-24 text-center">
                        <Clock
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                          No Records Found
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (globalAttendance || []).map((log, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors border-none bg-white dark:bg-gray-800"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <Avatar rounded size="sm" />
                            <span className="font-black dark:text-white uppercase tracking-tight">
                              {log.employee
                                ? `${log.employee.firstNameEnglish} ${log.employee.lastNameEnglish}`
                                : "External Node"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <Badge
                            color={
                              log.attendanceType === "Biometric"
                                ? "indigo"
                                : "info"
                            }
                            className="rounded-md px-4 py-1 text-[9px] font-black uppercase tracking-widest"
                          >
                            {log.attendanceType || "Standard"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-6 font-bold dark:text-gray-400 text-xs">
                          {log.clockIn
                            ? format(
                              new Date(log.clockIn),
                              "MMM dd, yyyy • HH:mm:ss",
                            )
                            : log.timestamp
                              ? format(
                                new Date(log.timestamp),
                                "MMM dd, yyyy • HH:mm:ss",
                              )
                              : "N/A"}
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                            <CheckCircle size={14} /> Synchronized
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6 text-right">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer hover:underline">
                            View Trace
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
