import React from "react";
import { Select } from "@/lib/flowbite-compat";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { COLORS } from "@/features/hr/hooks/useSupportModuleState";
import { PieChart as PieIcon, BarChart3, Users, Building2, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Props {
  state: any;
}

export default function SupportPieAnalytics({ state }: Props) {
  const {
    analyticsDept,
    setAnalyticsDept,
    analyticsDatePeriod,
    setAnalyticsDatePeriod,
    analyticsTab,
    setAnalyticsTab,
    analyticsChartStyle,
    setAnalyticsChartStyle,
    activeAnalyticsData,
    activeAnalyticsTitle,
    isMounted,
  } = state;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm space-y-6">
      {/* Analytics Toolbar Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-700/60">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <PieIcon className="text-blue-600" size={22} /> Support Analytics & Distribution
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Real-time workload metrics and ticket ratio analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={analyticsDept} onChange={(e) => setAnalyticsDept(e.target.value)}>
            <option value="ALL">Scope: All Departments</option>
            <option value="IT">Department: IT & Network</option>
            <option value="MAINTENANCE">Department: Maintenance</option>
            <option value="OUTREACH">Department: Outreach</option>
            <option value="CLINIC">Department: Clinic</option>
            <option value="HR">Department: HR</option>
          </Select>

          <Select value={analyticsDatePeriod} onChange={(e) => setAnalyticsDatePeriod(e.target.value)}>
            <option value="ALL">Timeframe: All Time</option>
            <option value="TODAY">Timeframe: Today</option>
            <option value="THIS_WEEK">Timeframe: This Week</option>
            <option value="THIS_MONTH">Timeframe: This Month</option>
            <option value="LAST_MONTH">Timeframe: Last Month</option>
          </Select>

          <Select value={analyticsChartStyle} onChange={(e: any) => setAnalyticsChartStyle(e.target.value)}>
            <option value="pie">Chart: Solid Pie</option>
            <option value="donut">Chart: Donut Ring</option>
          </Select>
        </div>
      </div>

      {/* Analytics Dimension Selector Tabs */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/40 p-1.5 rounded-2xl w-fit">
        {[
          { id: "STAFF", label: "By Staff Member", icon: <Users size={14} /> },
          { id: "DEPT", label: "By Category", icon: <Building2 size={14} /> },
          { id: "PRIORITY", label: "By Priority", icon: <ShieldAlert size={14} /> },
          { id: "STATUS", label: "By Status", icon: <CheckCircle2 size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAnalyticsTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${analyticsTab === tab.id
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
          >
            {tab.icon} {tab.label}  
          </button>
        ))}
      </div>

      {/* Recharts Pie Visualization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
        <div className="lg:col-span-2 h-[350px] w-full flex items-center justify-center">
          {isMounted && activeAnalyticsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeAnalyticsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={analyticsChartStyle === "donut" ? 70 : 0}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {activeAnalyticsData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Tickets`, name]}
                  contentStyle={{ backgroundColor: "#1F2937", borderRadius: "12px", border: "none", color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 space-y-2">
              <BarChart3 size={40} className="mx-auto text-gray-300" />
              <p className="text-sm font-bold text-gray-400">No tickets found matching the selected timeframe.</p>
            </div>
          )}
        </div>

        {/* Dynamic Breakdown Legend List */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {activeAnalyticsTitle}
          </h4>
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {activeAnalyticsData.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="font-bold text-gray-700 dark:text-gray-200 truncate max-w-[160px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 dark:text-white">{item.count}</span>
                  <span className="text-[10px] text-gray-400 font-bold px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full border">
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
}
