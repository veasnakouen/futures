import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/lib/flowbite-compat";
import { Globe, RefreshCw, Activity, BarChart3, Trash2 } from "lucide-react";

interface Props {
  state: any;
}

export default function TelemetryHeaderBar({ state }: Props) {
  const {
    activeSubTab,
    setActiveSubTab,
    logs,
    loadingLogs,
    loadingAnalytics,
    fetchLogs,
    fetchAnalytics,
    fetchStats,
  } = state;

  const SUB_TABS = [
    { id: "TRACKING", label: `User Location & Device Telemetry (${logs.length})`, icon: Activity },
    { id: "ANALYTICS", label: "Telemetry Analytics", icon: BarChart3 },
    { id: "CLEANUP", label: "Admin Data Cleanup Suite", icon: Trash2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/60"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="p-3.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            <Globe size={28} />
          </motion.div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-800 dark:from-white dark:via-gray-100 dark:to-indigo-200 bg-clip-text text-transparent flex items-center gap-3">
              Telemetry Tracking & Data Governance
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 leading-snug">
              Real-time user location & device telemetry, database-bound analytics, and database cleanup suite.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            color="light"
            size="sm"
            onClick={() => {
              fetchLogs();
              fetchAnalytics();
              fetchStats();
            }}
            disabled={loadingLogs || loadingAnalytics}
            className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 font-bold uppercase tracking-wider text-xs border-gray-200 dark:border-gray-700"
          >
            <RefreshCw size={14} className={`mr-2 ${loadingLogs || loadingAnalytics ? "animate-spin" : ""}`} />
            Refresh Database
          </Button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth mt-6 py-1">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 dark:bg-gray-900/60 rounded-2xl border border-gray-200/60 dark:border-gray-800 relative w-max min-w-full">
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-colors z-10 whitespace-nowrap ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="telemetrySubTabActivePill"
                    className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-md ring-1 ring-black/5 z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${tab.id === "CLEANUP" && !isActive ? "text-rose-500" : ""}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
