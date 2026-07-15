"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  Activity,
  BriefcaseMedical,
  ArrowUpRight,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { clinicService } from "../../../services/clinicService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const mockStats = {
  totalPatients: 1245,
  patientsGrowth: "+12.5%",
  todayAppointments: 42,
  appointmentsGrowth: "+5.2%",
  pendingLabs: 18,
  labsGrowth: "-2.4%",
  activeDoctors: 15,
};

const mockChartData = [
  { name: "Mon", patients: 45 },
  { name: "Tue", patients: 52 },
  { name: "Wed", patients: 38 },
  { name: "Thu", patients: 65 },
  { name: "Fri", patients: 48 },
  { name: "Sat", patients: 25 },
  { name: "Sun", patients: 20 },
];

export default function ClinicDashboard() {
  // Real implementation will use these, falling back to mock data if API is not ready
  const { data: statsData } = useQuery({
    queryKey: ["clinicDashboardStats"],
    queryFn: () => clinicService.getDashboardStats().then((res) => res.data),
    retry: false,
  });

  const { data: chartDataReq } = useQuery({
    queryKey: ["clinicDashboardChart"],
    queryFn: () => clinicService.getDashboardChartData().then((res) => res.data),
    retry: false,
  });

  const stats = statsData || mockStats;
  const chartData = chartDataReq || mockChartData;

  const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold">
              <span
                className={`flex items-center ${trend.startsWith("+")
                  ? "text-emerald-500"
                  : "text-rose-500"
                  }`}
              >
                <TrendingUp
                  size={12}
                  className={trend.startsWith("-") ? "rotate-180" : ""}
                />
                {trend}
              </span>
              <span className="text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl shadow-inner ${colorClass}`}>
          <Icon size={24} className="drop-shadow-md" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner">
            <Stethoscope size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Hospital Command Center
            </h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              Real-time analytics & operations
            </p>
          </div>
        </div>
        <div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 whitespace-nowrap hover:scale-105 active:scale-95">
            <ArrowUpRight size={18} strokeWidth={2.5} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          trend={stats.patientsGrowth}
          icon={Users}
          colorClass="bg-blue-500/20 text-blue-600 dark:text-blue-400"
          delay={0.1}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          trend={stats.appointmentsGrowth}
          icon={Calendar}
          colorClass="bg-violet-500/20 text-violet-600 dark:text-violet-400"
          delay={0.2}
        />
        <StatCard
          title="Pending Lab Orders"
          value={stats.pendingLabs}
          trend={stats.labsGrowth}
          icon={Activity}
          colorClass="bg-rose-500/20 text-rose-600 dark:text-rose-400"
          delay={0.3}
        />
        <StatCard
          title="Doctors on Shift"
          value={stats.activeDoctors}
          icon={BriefcaseMedical}
          colorClass="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          delay={0.4}
        />
      </div>

      {/* Main Charts & Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Patient Inflow
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last 7 days admission & walk-in metrics
              </p>
            </div>
            <select className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions / Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Upcoming Appointments
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Next scheduled patients today
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700/50 transition-all cursor-pointer shadow-sm hover:shadow-md group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 border-2 border-white dark:border-gray-800 shadow-inner group-hover:scale-110 transition-transform">
                  PT
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Patient Name {i}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dr. Smith • General Checkup</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    10:{i}0 AM
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                    Confirmed
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 transition-all">
            View All Appointments
          </button>
        </motion.div>
      </div>
    </div>
  );
}
