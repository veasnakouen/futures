import React from "react";
import { motion } from "framer-motion";
import { Button, Spinner } from "@/lib/flowbite-compat";
import { HardDrive, Trash2, ShieldAlert, Sparkles, Zap } from "lucide-react";

interface Props {
  state: any;
}

export default function DataCleanupSubTab({ state }: Props) {
  const { loadingStats, storageStats, openCleanupModal } = state;

  if (loadingStats) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <motion.div
      key="CLEANUP"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Storage Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
              <HardDrive size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Access Telemetry Logs</p>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                {storageStats?.accessLogsCount || 0}
              </h4>
            </div>
          </div>
          <Button
            size="xs"
            color="light"
            onClick={() => openCleanupModal("access")}
            className="w-full font-bold uppercase tracking-wider text-xs border-indigo-200 text-indigo-600"
          >
            <Trash2 size={12} className="mr-1.5" /> Purge Access Logs
          </Button>
        </div>

        <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl">
              <ShieldAlert size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Audit History Records</p>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                {storageStats?.auditLogsCount || 0}
              </h4>
            </div>
          </div>
          <Button
            size="xs"
            color="light"
            onClick={() => openCleanupModal("audit")}
            className="w-full font-bold uppercase tracking-wider text-xs border-purple-200 text-purple-600"
          >
            <Trash2 size={12} className="mr-1.5" /> Purge Audit History
          </Button>
        </div>

        <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Orphaned Tokens & Cache</p>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">Clean Status</h4>
            </div>
          </div>
          <Button
            size="xs"
            color="light"
            onClick={() => openCleanupModal("orphan")}
            className="w-full font-bold uppercase tracking-wider text-xs border-amber-200 text-amber-600"
          >
            <Zap size={12} className="mr-1.5" /> Sweep Temp Records
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
