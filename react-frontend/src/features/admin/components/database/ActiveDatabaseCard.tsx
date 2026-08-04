import React from "react";
import { Spinner } from "@/lib/flowbite-compat";
import { Database } from "lucide-react";

interface Props {
  state: any;
}

export default function ActiveDatabaseCard({ state }: Props) {
  const { t, dbInfo, loading } = state;

  return (
    <div className="lg:col-span-2 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-100/50 dark:shadow-black/40 border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-md blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 group-hover:scale-110 transition-transform duration-300">
          <Database size={24} />
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>{" "}
          {t("active")}
        </span>
      </div>

      <h3 className="text-lg font-black dark:text-white tracking-tight">
        {t("activeConnectionNode")}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
        {t("currentWorkspaceTargetDb")}
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {t("databaseName")}
            </p>
            <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5 select-all">
              {dbInfo?.currentDb || "unknown"}
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {t("hikariPool")}
            </p>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 select-all">
              {dbInfo?.poolName || "MtpHikariPool"}
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {t("jdbcString")}
            </p>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1 font-mono break-all line-clamp-2 select-all hover:line-clamp-none transition-all duration-300 cursor-pointer">
              {dbInfo?.jdbcUrl || "unknown"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
