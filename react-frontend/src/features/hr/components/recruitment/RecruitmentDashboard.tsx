import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RecruitmentDashboardProps {
  vacanciesCount: number;
  candidatesCount: number;
  totalPlacements: number;
  trendData: any[];
  vacancyStatusData: any[];
  COLORS: string[];
}

const RecruitmentDashboard: React.FC<RecruitmentDashboardProps> = ({
  vacanciesCount,
  candidatesCount,
  totalPlacements,
  trendData,
  vacancyStatusData,
  COLORS,
}) => {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-blue-600 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Live Vacancies
          </p>
          <h4 className="text-4xl font-black dark:text-white text-blue-600">
            {vacanciesCount}
          </h4>
        </div>
        <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-indigo-600 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Talent Pool
          </p>
          <h4 className="text-4xl font-black dark:text-white text-indigo-600">
            {candidatesCount}
          </h4>
        </div>
        <div className="p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-emerald-500 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Success Hires
          </p>
          <h4 className="text-4xl font-black dark:text-white text-emerald-600">
            {totalPlacements}
          </h4>
        </div>
        <div className="p-5 rounded-md bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-cyan-400" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Pipeline Health
            </p>
          </div>
          <h4 className="text-2xl font-black uppercase tracking-tighter">
            Stable Sync
          </h4>
          <p className="text-[9px] font-bold mt-1 opacity-60 uppercase tracking-widest">
            Enterprise Talent Node Active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-md dark:bg-gray-800 border-none shadow-md">
          <h4 className="font-black text-xl dark:text-white uppercase tracking-tight mb-8">
            Hiring Velocity
          </h4>
          <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <BarChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: "#9CA3AF",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: "#9CA3AF",
                  }}
                />
                <ReTooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-md">
          <h4 className="font-black text-xl dark:text-white uppercase tracking-tight mb-8">
            Registered Vacancies
          </h4>
          <div className="h-[250px] w-full mb-8" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <BarChart
                data={vacancyStatusData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "#9CA3AF" }}
                  allowDecimals={false}
                />
                <ReTooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {vacancyStatusData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {vacancyStatusData.map((s: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-md"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></div>
                  <span className="text-gray-400">{s.name}</span>
                </div>
                <span className="dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecruitmentDashboard;
