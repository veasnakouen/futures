import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

interface SupportAnalyticsViewProps {
  tickets: any[];
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

export const SupportAnalyticsView: React.FC<SupportAnalyticsViewProps> = ({ tickets }) => {
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    const cat = t.type?.name || t.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  const openCount = tickets.filter((t) => t.status === "OPEN" || !t.status).length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Open Requests</p>
          <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{openCount}</h3>
          <p className="text-xs font-medium text-gray-500 mt-1">Awaiting technician triage</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
          <h3 className="text-3xl font-black text-amber-500 mt-2">{inProgressCount}</h3>
          <p className="text-xs font-medium text-gray-500 mt-1">Actively being serviced</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resolved SLA</p>
          <h3 className="text-3xl font-black text-emerald-500 mt-2">{resolvedCount}</h3>
          <p className="text-xs font-medium text-gray-500 mt-1">Closed within target SLA</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-4">
          Support Category Distribution
        </h4>
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ name: "General", value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupportAnalyticsView;
