import React, { useState, useEffect } from "react";
import { Button } from '@/lib/flowbite-compat';
import { BarChart3, TrendingUp, Users, DollarSign, PieChart as PieIcon, Calendar, Filter } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToExcel } from "@/utils/reportExport";
import toast from "react-hot-toast";

interface AnalyticsModuleProps {
  stats?: any;
  employees?: any[];
  data?: any;
  [key: string]: any;
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

const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  stats = { activeStaff: 42, monthlyPayroll: 52300, attendanceRate: "97.4%" },
  employees = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("July 2026");
  const [reportDomain, setReportDomain] = useState<"DEPT" | "ATTENDANCE" | "TICKETS" | "PAYROLL">("DEPT");
  const [chartType, setChartType] = useState<"donut" | "pie">("pie");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const exportAnalyticsExcel = () => {
    try {
      const exportData = [
        { Metric: "Total Active Workforce", Value: stats.activeStaff || 42 },
        { Metric: "Monthly Payroll Expenditures", Value: `$${stats.monthlyPayroll || 52300}` },
        { Metric: "Average Attendance Compliance Rate", Value: stats.attendanceRate || "97.4%" },
      ];
      exportToExcel(exportData, ["Metric", "Value"], "HR ANALYTICS EXECUTIVE SUMMARY", "Workforce Metrics & Financial Insights");
      toast.success("Analytics report exported!");
    } catch {
      toast.error("Failed to export analytics");
    }
  };

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
    reportDomain === "DEPT"
      ? departmentData
      : reportDomain === "ATTENDANCE"
      ? attendanceData
      : reportDomain === "TICKETS"
      ? ticketsData
      : payrollData;

  const activeTitle =
    reportDomain === "DEPT"
      ? "Workforce Department Share"
      : reportDomain === "ATTENDANCE"
      ? "Monthly Attendance Ratio"
      : reportDomain === "TICKETS"
      ? "Service Ticket Category Distribution"
      : "Payroll Budget Expenditure";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm">
        <div>
          <h4 className="font-black text-sm uppercase dark:text-white flex items-center gap-2">
            <PieIcon size={18} className="text-blue-600" />
            Executive HR Intelligence & Monthly Pie Chart Analytics
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
            Real-time visual distribution, monthly trend segmentation, and key performance indicators
          </p>
        </div>
        <Button color="blue" size="xs" onClick={exportAnalyticsExcel} className="font-black uppercase text-[10px] rounded-xl">
          <BarChart3 size={14} className="mr-1" /> Export Report
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Active Workforce</p>
            <h4 className="text-2xl font-black dark:text-white">{stats.activeStaff || 42} Personnel</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Monthly Payroll</p>
            <h4 className="text-2xl font-black text-emerald-600">${(stats.monthlyPayroll || 52300).toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Attendance Rate</p>
            <h4 className="text-2xl font-black text-indigo-600">{stats.attendanceRate || "97.4%"}</h4>
          </div>
        </div>
      </div>

      {/* Visual Monthly Pie Chart Analytics Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "DEPT", label: "Departments", icon: <Users size={14} /> },
              { id: "ATTENDANCE", label: "Attendance Ratio", icon: <Calendar size={14} /> },
              { id: "TICKETS", label: "Support Tickets", icon: <PieIcon size={14} /> },
              { id: "PAYROLL", label: "Payroll Distribution", icon: <DollarSign size={14} /> },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setReportDomain(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  reportDomain === btn.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100"
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
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

            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setChartType("donut")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartType === "donut" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Donut
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartType === "pie" ? "bg-white dark:bg-gray-600 text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Pie
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-black dark:text-white uppercase tracking-tight">{activeTitle}</h3>
            <p className="text-xs font-bold text-gray-400">Monthly breakdown analysis for {selectedMonth}</p>
          </div>
        </div>

        {/* Pie Chart Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {isMounted ? (
              <PieChart width={320} height={280}>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={chartType === "donut" ? 65 : 0}
                  outerRadius={105}
                  paddingAngle={chartType === "donut" ? 4 : 0}
                  dataKey="value"
                >
                  {activeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Share"]}
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

          {/* Side Legend & Details */}
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
                      {reportDomain === "PAYROLL" ? `$${item.count.toLocaleString()}` : `${item.count} Units`}
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
      </div>
    </div>
  );
};

export default AnalyticsModule;
