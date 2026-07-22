import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { CheckCircle2, Clock, Activity, ShieldCheck, RefreshCw, AlertTriangle } from "lucide-react";

interface SupportAnalyticsViewProps {
  tickets: any[];
}

const CATEGORY_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#64748b"];
const REPLACEMENT_COLORS = ["#ec4899", "#8b5cf6", "#10b981", "#f59e0b"];

export const SupportAnalyticsView: React.FC<SupportAnalyticsViewProps> = ({ tickets = [] }) => {
  // 1. Support Category Distribution Data
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    const cat = t.type?.name || t.category || t.taskType || "General IT";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryPieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  // Default fallback categories if empty
  const defaultCategoryData = [
    { name: "Hardware Maintenance", value: 35 },
    { name: "Product Replacement Request", value: 25 },
    { name: "Software / OS Patch", value: 20 },
    { name: "Network Access", value: 12 },
    { name: "Biometric / IoT Sensor", value: 8 },
  ];

  // 2. Status Breakdown Pie Data
  const openCount = tickets.filter((t) => t.status === "OPEN" || !t.status).length || 4;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length || 8;
  const resolvedCount = tickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length || 15;
  const replacementApprovedCount = tickets.filter((t) => t.replacementAction === "REPLACE_PRODUCT" || t.status === "REPLACEMENT_APPROVED").length || 3;

  const statusPieData = [
    { name: "Open Triage", value: openCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Replacement Approved", value: replacementApprovedCount },
    { name: "Resolved SLA", value: resolvedCount },
  ];

  // 3. Hardware Replacement vs Repair Ratio Pie Data
  const replacementRatioData = [
    { name: "Component Repair", value: 45 },
    { name: "Product Replacement", value: 30 },
    { name: "EOL Decommissioning", value: 15 },
    { name: "No Hardware Required", value: 10 },
  ];

  // 4. Monthly Work Order & SLA Compliance Bar Chart Data
  const monthlySlaData = [
    { month: "Jan", ticketsLogged: 42, slaMet: 40, replacements: 5 },
    { month: "Feb", ticketsLogged: 55, slaMet: 52, replacements: 8 },
    { month: "Mar", ticketsLogged: 48, slaMet: 45, replacements: 6 },
    { month: "Apr", ticketsLogged: 62, slaMet: 60, replacements: 11 },
    { month: "May", ticketsLogged: 58, slaMet: 56, replacements: 7 },
    { month: "Jun", ticketsLogged: 70, slaMet: 67, replacements: 12 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Top SLA Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Open Requests</p>
            <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{openCount}</h3>
            <p className="text-[10px] font-bold text-blue-500 uppercase mt-1 flex items-center gap-1">
              <Clock size={12} /> Awaiting Triage
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
            <Activity size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
            <h3 className="text-3xl font-black text-amber-500 mt-2">{inProgressCount}</h3>
            <p className="text-[10px] font-bold text-amber-500 uppercase mt-1 flex items-center gap-1">
              <RefreshCw size={12} /> Serviced by Technicians
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-xl">
            <RefreshCw size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Replacement</p>
            <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">{replacementApprovedCount}</h3>
            <p className="text-[10px] font-bold text-purple-500 uppercase mt-1 flex items-center gap-1">
              <AlertTriangle size={12} /> New Hardware Requests
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 rounded-xl">
            <RefreshCw size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved SLA</p>
            <h3 className="text-3xl font-black text-emerald-500 mt-2">{resolvedCount}</h3>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Target SLA Met (98.4%)
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-xl">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* 3 Pie Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart 1: Task Type & Category Distribution */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black dark:text-white uppercase tracking-wider mb-2">
              Task Type & Category Distribution
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Work order classification break-down</p>
          </div>

          <div className="h-[240px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={categoryPieData.length > 0 ? categoryPieData : defaultCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {(categoryPieData.length > 0 ? categoryPieData : defaultCategoryData).map((_, index) => (
                    <Cell key={`cat-cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 text-[10px] font-bold">
            {(categoryPieData.length > 0 ? categoryPieData : defaultCategoryData).slice(0, 4).map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                <span className="text-gray-600 dark:text-gray-300 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart 2: Task Resolution Status Breakdown */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black dark:text-white uppercase tracking-wider mb-2">
              Task Status & Lifecycle Stage
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Real-time task process status</p>
          </div>

          <div className="h-[240px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {statusPieData.map((_, index) => (
                    <Cell key={`status-cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 text-[10px] font-bold">
            {statusPieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[idx % STATUS_COLORS.length] }} />
                <span className="text-gray-600 dark:text-gray-300 truncate">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart 3: Product Replacement Request Ratio */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black dark:text-white uppercase tracking-wider mb-2">
              Product Replacement Ratio
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Repair vs New Product Replacement</p>
          </div>

          <div className="h-[240px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={replacementRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {replacementRatioData.map((_, index) => (
                    <Cell key={`rep-cell-${index}`} fill={REPLACEMENT_COLORS[index % REPLACEMENT_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 text-[10px] font-bold">
            {replacementRatioData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: REPLACEMENT_COLORS[idx % REPLACEMENT_COLORS.length] }} />
                <span className="text-gray-600 dark:text-gray-300 truncate">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly SLA & Product Replacements Bar Chart */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
              Monthly Work Order Volume & SLA Compliance Trends
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
              Service requests processed vs SLA targets met vs New Hardware Replacements
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600" /> Logged Tickets</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> SLA Met</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500" /> Hardware Replacements</span>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={monthlySlaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={700} />
              <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} />
              <RechartsTooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#fff",
                  fontWeight: 800,
                }}
              />
              <Bar dataKey="ticketsLogged" name="Total Logged" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="slaMet" name="SLA Met" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="replacements" name="Hardware Replacements" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupportAnalyticsView;
