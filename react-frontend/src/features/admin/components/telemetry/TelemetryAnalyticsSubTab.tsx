import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/lib/flowbite-compat";
import { Activity, MapPin, Monitor, Laptop, Globe, HardDrive } from "lucide-react";

interface Props {
  state: any;
}

export default function TelemetryAnalyticsSubTab({ state }: Props) {
  const { loadingAnalytics, analytics } = state;

  if (loadingAnalytics) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-8 text-center text-gray-500 font-bold">No telemetry analytics available</div>;
  }

  return (
    <motion.div
      key="ANALYTICS"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Analytics Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-5 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Total Access Logs</span>
            <Activity className="w-5 h-5 opacity-90" />
          </div>
          <h3 className="text-3xl font-black">{analytics.totalLogs}</h3>
          <p className="text-[10px] font-semibold mt-2 opacity-80">Database telemetry records</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-xl shadow-purple-500/20 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Top Geo Location</span>
            <MapPin className="w-5 h-5 opacity-90" />
          </div>
          <h3 className="text-2xl font-black truncate">
            {Object.keys(analytics.locationDistribution || {})[0] || "Phnom Penh, KH"}
          </h3>
          <p className="text-[10px] font-semibold mt-2 opacity-80">Primary access origin</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Primary Device</span>
            <Monitor className="w-5 h-5 opacity-90" />
          </div>
          <h3 className="text-2xl font-black capitalize">
            {Object.keys(analytics.deviceDistribution || {})[0] || "Desktop"}
          </h3>
          <p className="text-[10px] font-semibold mt-2 opacity-80">Dominant client hardware</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-amber-500/20 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Dominant OS</span>
            <Laptop className="w-5 h-5 opacity-90" />
          </div>
          <h3 className="text-2xl font-black truncate">
            {Object.keys(analytics.osDistribution || {})[0] || "Windows 11"}
          </h3>
          <p className="text-[10px] font-semibold mt-2 opacity-80">Most active platform</p>
        </motion.div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-500" /> Platform & OS Distribution
          </h4>
          <div className="space-y-3">
            {Object.entries(analytics.osDistribution || {}).map(([os, count]) => {
              const pct = Math.round(((count as number) / (analytics.totalLogs || 1)) * 100);
              return (
                <div key={os} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>{os}</span>
                    <span>{count as number} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-500" /> Browser Engines Distribution
          </h4>
          <div className="space-y-3">
            {Object.entries(analytics.browserDistribution || {}).map(([browser, count]) => {
              const pct = Math.round(((count as number) / (analytics.totalLogs || 1)) * 100);
              return (
                <div key={browser} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>{browser}</span>
                    <span>{count as number} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
