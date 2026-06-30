import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { HelpCircle, Activity } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface TrendChartProps {
  data: any[]; // Expects array of { name: string, value: number }
}

const COLORS = [
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#14B8A6",
];

const TrendChart: React.FC<TrendChartProps> = ({ data = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item.value > 0 &&
          item.name.toLowerCase().includes(nameFilter.toLowerCase()),
      )
    : [];

  const totalVacancies = filteredData.reduce(
    (sum: number, item: any) => sum + (item.value || 0),
    0,
  );

  return (
    <ScrollReveal
      className="h-full"
      animation="fade-in-up"
      delay={100}
      duration={600}
      triggerOnce={true}
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-800/40 dark:backdrop-blur-md border border-gray-100 dark:border-gray-800/80 p-8 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
        {/* Header and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-50 dark:border-gray-700/40 shrink-0">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Registered Vacancies
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                {totalVacancies} Total
              </span>
            </h3>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
              Status distribution of registered vacancies
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-gray-900/30 p-2 rounded-md border border-gray-100 dark:border-gray-750 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Filter by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full sm:w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-md px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Chart Content Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          {/* Pie Chart Visual */}
          <div className="md:col-span-3 h-[300px] flex items-center justify-center relative">
            {isMounted ? (
              filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(59, 130, 246, 0.04)" }}
                      contentStyle={{
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.05)",
                      }}
                      wrapperClassName="dark:!bg-gray-800/80 dark:!border-gray-700/50 dark:backdrop-blur-md"
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {filteredData.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3">
                  <HelpCircle size={40} className="opacity-30" />
                  <p className="text-xs font-black uppercase tracking-widest text-center">
                    No registered vacancies
                  </p>
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-md animate-spin"></span>
              </div>
            )}
          </div>

          {/* Slices Breakdowns & Legends */}
          <div className="md:col-span-2 space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-150/50 dark:hover:bg-gray-800/70 border border-gray-50 dark:border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 rounded-md transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                    <span className="text-xs font-black text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 uppercase tracking-widest transition-colors duration-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm border border-gray-100/50 dark:border-gray-700/50 group-hover:shadow group-hover:border-blue-500/20 transition-all duration-200">
                    {item.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default TrendChart;
