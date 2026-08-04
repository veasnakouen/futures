import React, { useState } from "react";
import { Button } from '@/lib/flowbite-compat';
import {
  Download,
  FileText,
  PieChart as PieIcon,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Filter,
  CheckCircle2,
  Table as TableIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToExcel, exportToPDF } from "@/utils/reportExport";
import toast from "react-hot-toast";

interface ReportsModuleProps {
  employees?: any[];
  attendance?: any[];
  payroll?: any[];
}

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Rose
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

const ReportsModule: React.FC<ReportsModuleProps> = ({
  employees = [],
  attendance = [],
  payroll = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("July 2026");
  const [reportType, setReportType] = useState<"DEPT" | "ATTENDANCE" | "TICKETS" | "PAYROLL">("DEPT");
  const [chartStyle, setChartStyle] = useState<"donut" | "pie" | "table">("pie");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sample Datasets for Monthly Reports
  const departmentData = [
    { name: "IT & Engineering", value: 35, count: 42 },
    { name: "Operations & Logistics", value: 25, count: 30 },
    { name: "Clinic & Healthcare", value: 20, count: 24 },
    { name: "Human Resources", value: 12, count: 14 },
    { name: "Finance & Admin", value: 8, count: 10 },
  ];

  const attendanceData = [
    { name: "On-Time Present", value: 72, count: 864 },
    { name: "Late Clock-In", value: 14, count: 168 },
    { name: "Approved Leave", value: 9, count: 108 },
    { name: "Unexcused Absence", value: 5, count: 60 },
  ];

  const ticketsData = [
    { name: "IT & Infrastructure", value: 40, count: 96 },
    { name: "Facilities & Maintenance", value: 28, count: 67 },
    { name: "Community Outreach", value: 18, count: 43 },
    { name: "Clinic Systems", value: 14, count: 34 },
  ];

  const payrollData = [
    { name: "Engineering Salaries", value: 42, count: 45000 },
    { name: "Medical Personnel", value: 26, count: 28000 },
    { name: "Operations Staff", value: 18, count: 19000 },
    { name: "HR & Management", value: 14, count: 15000 },
  ];

  const activeData =
    reportType === "DEPT"
      ? departmentData
      : reportType === "ATTENDANCE"
      ? attendanceData
      : reportType === "TICKETS"
      ? ticketsData
      : payrollData;

  const activeTitle =
    reportType === "DEPT"
      ? "Workforce Department Distribution"
      : reportType === "ATTENDANCE"
      ? "Monthly Attendance & Punctuality Breakdown"
      : reportType === "TICKETS"
      ? "Helpdesk Ticket Category Volume"
      : "Monthly Payroll Budget Allocation";

  const totalSum = activeData.reduce((acc, curr) => acc + curr.count, 0);

  const exportWorkforceExcel = () => {
    try {
      const headers = ["firstName", "lastName", "clientCode", "status", "branch"];
      exportToExcel(employees, headers, "WORKFORCE DIRECTORY REPORT", "Active Employee Roster");
      toast.success("Workforce Excel exported!");
    } catch {
      toast.error("Failed to export Excel");
    }
  };

  const exportWorkforcePDF = () => {
    try {
      const headers = ["firstName", "lastName", "clientCode", "status", "branch"];
      exportToPDF(employees, headers, "WORKFORCE DIRECTORY REPORT", "Active Employee Roster", "portrait");
      toast.success("Workforce PDF exported!");
    } catch {
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Exports */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm">
        <div>
          <h4 className="font-black text-sm uppercase dark:text-white flex items-center gap-2">
            <PieIcon size={18} className="text-blue-600" />
            Enterprise Analytics & Monthly Executive Reports
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
            Interactive visual charts, monthly trend segmentation, and formal export ledgers
          </p>
        </div>

        <div className="flex gap-2">
          <Button color="blue" size="xs" onClick={exportWorkforceExcel} className="font-black uppercase text-[9px] rounded-xl">
            <Download size={12} className="mr-1" /> Export Excel
          </Button>
          <Button color="success" size="xs" onClick={exportWorkforcePDF} className="font-black uppercase text-[9px] rounded-xl bg-emerald-600">
            <FileText size={12} className="mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Monthly Pie Chart Report Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "DEPT", label: "Departments", icon: <Users size={14} /> },
              { id: "ATTENDANCE", label: "Attendance", icon: <Calendar size={14} /> },
              { id: "TICKETS", label: "Tickets & Support", icon: <PieIcon size={14} /> },
              { id: "PAYROLL", label: "Payroll Budget", icon: <DollarSign size={14} /> },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setReportType(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  reportType === btn.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100"
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Month Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-gray-400 uppercase">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-xs h-9 border border-gray-200 dark:border-gray-600 px-3 font-bold cursor-pointer"
              >
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="May 2026">May 2026</option>
                <option value="April 2026">April 2026</option>
                <option value="March 2026">March 2026</option>
              </select>
            </div>

            {/* Chart Style Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setChartStyle("donut")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartStyle === "donut" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Donut
              </button>
              <button
                onClick={() => setChartStyle("pie")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartStyle === "pie" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Solid Pie
              </button>
              <button
                onClick={() => setChartStyle("table")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartStyle === "table" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Data Table
              </button>
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">{activeTitle}</h3>
            <p className="text-xs font-bold text-gray-400">Monthly breakdown report for {selectedMonth}</p>
          </div>
          <span className="text-xs font-black bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl">
            Total Aggregate: {totalSum.toLocaleString()} {reportType === "PAYROLL" ? "USD" : "Units"}
          </span>
        </div>

        {/* Visual Chart vs Data Table Content */}
        {chartStyle === "table" ? (
          <div className="border border-gray-100 dark:border-gray-700/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900 text-[10px] font-black uppercase text-gray-400">
                <tr>
                  <th className="py-3.5 px-4">Segment Category</th>
                  <th className="py-3.5 px-4">Share %</th>
                  <th className="py-3.5 px-4 text-right">Metric Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {activeData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-bold dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {item.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.value}%</td>
                    <td className="py-3 px-4 text-right font-mono font-bold dark:text-white">
                      {reportType === "PAYROLL" ? `$${item.count.toLocaleString()}` : item.count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Recharts Pie Component */}
            <div className="h-[300px] w-full flex items-center justify-center relative">
              {isMounted ? (
                <PieChart width={320} height={280}>
                  <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={chartStyle === "donut" ? 65 : 0}
                    outerRadius={105}
                    paddingAngle={chartStyle === "donut" ? 4 : 0}
                    dataKey="value"
                  >
                    {activeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% Share`, "Ratio"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Segment Details & Legend Cards */}
            <div className="space-y-3">
              {activeData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50/60 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-md shadow-sm shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div>
                      <h5 className="text-xs font-bold dark:text-white">{item.name}</h5>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {reportType === "PAYROLL" ? `$${item.count.toLocaleString()}` : `${item.count} Record Units`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono block">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsModule;
