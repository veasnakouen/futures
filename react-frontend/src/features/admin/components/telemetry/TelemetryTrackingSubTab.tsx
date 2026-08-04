import React from "react";
import { motion } from "framer-motion";
import { Badge, Select, Spinner } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import ModernPagination from "@/components/common/ModernPagination";
import { MapPin, Smartphone, Tablet, Server, Monitor, Filter } from "lucide-react";

interface Props {
  state: any;
}

export default function TelemetryTrackingSubTab({ state }: Props) {
  const {
    searchTerm,
    setSearchTerm,
    deviceFilter,
    setDeviceFilter,
    filteredLogs,
    loadingLogs,
    paginatedLogs,
    formatTimeSafely,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  } = state;

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case "tablet":
        return <Tablet className="w-4 h-4 text-amber-500" />;
      case "server":
        return <Server className="w-4 h-4 text-rose-500" />;
      default:
        return <Monitor className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <motion.div
      key="TRACKING"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Search & Filter Toolbar */}
      <div className="p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search user, IP, location, OS, browser..."
            value={searchTerm}
            onChange={(val: any) => setSearchTerm(typeof val === "string" ? val : val?.target?.value || "")}
            containerClassName="w-full"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            icon={Filter}
            className="w-full md:w-48"
          >
            <option value="all">All Device Types</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="server">Server</option>
          </Select>
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Showing {filteredLogs.length} entries
          </span>
        </div>
      </div>

      {/* Telemetry Logs Table */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {loadingLogs ? (
          <div className="flex justify-center py-20">
            <Spinner size="xl" />
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">
            No telemetry tracking logs found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-900/60 uppercase font-black tracking-wider text-[10px] text-gray-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-gray-700">
                <tr>
                  <th className="py-4 px-6">User / Account</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Device</th>
                  <th className="py-4 px-6">Operating System</th>
                  <th className="py-4 px-6">Browser</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedLogs.map((log: any, index: number) => (
                  <motion.tr
                    key={log.id || index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                          {(log.loggedBy || "U").substring(0, 1).toUpperCase()}
                        </div>
                        <span>{log.loggedBy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{log.location || "Phnom Penh, KH"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-gray-600 dark:text-gray-400 select-all">
                      {log.ipAddress}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {getDeviceIcon(log.deviceType)}
                        {log.deviceType || "Desktop"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300">
                      {log.os || "Windows 11"}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300">
                      {log.browser || "Chrome"}
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      {formatTimeSafely(log.loggedDate)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        color={log.status === "Success" ? "success" : log.status === "Suspicious" ? "failure" : "warning"}
                        className="rounded-md px-2 font-black uppercase text-[9px]"
                      >
                        {log.status || "Success"}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredLogs.length}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </motion.div>
  );
}
