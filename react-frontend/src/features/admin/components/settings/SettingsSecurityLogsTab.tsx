import React from "react";
import { Avatar, Spinner, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import DatePicker from "@/components/common/DatePicker";
import ModernPagination from "@/components/common/ModernPagination";
import { format } from "date-fns";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  ShieldAlert,
  Trash2,
  ChevronDown,
  Search,
  X,
  Calendar,
  Globe,
  Smartphone,
  Tablet,
  Server,
  Monitor,
} from "lucide-react";

export default function SettingsSecurityLogsTab({ state }: { state: any }) {
  const {
    accessLogs,
    auditLogs,
    loadingLogs,
    handleClearLogs,
    securitySubTab,
    setSecuritySubTab,
    refetchAccessLogs,
    refetchAuditLogs,
    logsSearch,
    setLogsSearch,
    logsStartDate,
    setLogsStartDate,
    logsEndDate,
    setLogsEndDate,
    filteredLogs,
    paginatedLogs,
    logsCurrentPage,
    setLogsCurrentPage,
    totalPages,
    totalItems,
    logsPageSize,
    setLogsPageSize,
  } = state;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Events",
            value: accessLogs.length,
            icon: <Activity size={16} />,
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Successful",
            value: accessLogs.filter((l: any) => l.status === "Success").length,
            icon: <CheckCircle size={16} />,
            color: "from-emerald-500 to-green-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Suspicious",
            value: accessLogs.filter((l: any) => l.status === "Suspicious").length,
            icon: <AlertCircle size={16} />,
            color: "from-amber-400 to-orange-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Failed",
            value: accessLogs.filter((l: any) => l.status === "Failed").length,
            icon: <XCircle size={16} />,
            color: "from-rose-500 to-red-600",
            bg: "bg-rose-50 dark:bg-rose-900/20",
            text: "text-rose-600 dark:text-rose-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-4 flex items-center gap-3 border-white/60 shadow-sm`}
          >
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm`}
            >
              {stat.icon}
            </div>
            <div>
              <div className={`text-xl font-black ${stat.text}`}>
                {loadingLogs ? "—" : stat.value}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b bg-gray-50/80 dark:bg-gray-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                Security & Access Audit Logs
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Monitor sessions, device footprint, and data access patterns.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-lg transition-all duration-200 group">
                  <Trash2 size={12} /> Clear Logs{" "}
                  <ChevronDown
                    size={12}
                    className="opacity-50 group-hover:opacity-100"
                  />
                </div>
              }
            >
              <DropdownItem
                onClick={() => handleClearLogs("7days")}
                className="text-xs font-semibold hover:text-blue-600"
              >
                Older than 7 days
              </DropdownItem>
              <DropdownItem
                onClick={() => handleClearLogs("30days")}
                className="text-xs font-semibold hover:text-blue-600"
              >
                Older than 30 days
              </DropdownItem>
              <DropdownItem
                onClick={() => handleClearLogs("success")}
                className="text-xs font-semibold hover:text-blue-600"
              >
                Successful logs only
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={() => handleClearLogs("all")}
                className="text-xs font-black text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Clear all logs
              </DropdownItem>
            </Dropdown>

            <button
              onClick={() =>
                securitySubTab === "session"
                  ? refetchAccessLogs()
                  : refetchAuditLogs()
              }
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700/50 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all duration-200"
            >
              <Activity size={12} /> Refresh
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex px-5 border-b bg-white dark:bg-gray-800">
          <button
            onClick={() => setSecuritySubTab("session")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors ${securitySubTab === "session" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
          >
            Session Logs
          </button>
          <button
            onClick={() => setSecuritySubTab("activity")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors ${securitySubTab === "activity" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
          >
            Activity Logs
          </button>
        </div>

        {/* Filters Bar */}
        <div className="px-5 py-3 border-b bg-white dark:bg-gray-800 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                id="logsSearch"
                placeholder="Search by user, IP, location, browser, status…"
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-700/40 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none dark:text-white dark:placeholder-gray-500 transition-all"
              />
              {logsSearch && (
                <button
                  onClick={() => setLogsSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Date Range */}
            <div className="flex items-center gap-2 shrink-0">
              <DatePicker
                className="w-40"
                value={logsStartDate ? new Date(logsStartDate + "T00:00:00") : null}
                onChange={(date) => setLogsStartDate(format(date, "yyyy-MM-dd"))}
                placeholder="Start Date"
              />
              <span className="text-xs text-gray-400 font-medium">to</span>
              <DatePicker
                className="w-40"
                value={logsEndDate ? new Date(logsEndDate + "T00:00:00") : null}
                onChange={(date) => setLogsEndDate(format(date, "yyyy-MM-dd"))}
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {(logsSearch || logsStartDate || logsEndDate) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Active filters:
              </span>
              {logsSearch && (
                <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-full border-blue-200 dark:border-blue-700/50">
                  <Search size={10} /> "{logsSearch}"
                  <button
                    onClick={() => setLogsSearch("")}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700/50 rounded-full p-0.5 transition-colors"
                  >
                    <XCircle size={11} />
                  </button>
                </span>
              )}
              {logsStartDate && (
                <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[11px] font-bold rounded-full border-violet-200 dark:border-violet-700/50">
                  <Calendar size={10} /> From {logsStartDate}
                  <button
                    onClick={() => setLogsStartDate("")}
                    className="hover:bg-violet-200 dark:hover:bg-violet-700/50 rounded-full p-0.5 transition-colors"
                  >
                    <XCircle size={11} />
                  </button>
                </span>
              )}
              {logsEndDate && (
                <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[11px] font-bold rounded-full border-violet-200 dark:border-violet-700/50">
                  <Calendar size={10} /> To {logsEndDate}
                  <button
                    onClick={() => setLogsEndDate("")}
                    className="hover:bg-violet-200 dark:hover:bg-violet-700/50 rounded-full p-0.5 transition-colors"
                  >
                    <XCircle size={11} />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setLogsSearch("");
                  setLogsStartDate("");
                  setLogsEndDate("");
                }}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Log Entries */}
        <div className="overflow-y-auto" style={{ maxHeight: "52vh" }}>
          {loadingLogs ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner size="xl" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Loading audit logs…
              </p>
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-2xl text-gray-400">
                <ShieldAlert size={32} />
              </div>
              <div className="text-center">
                <p className="font-black text-gray-500 dark:text-gray-400 text-sm">
                  {accessLogs.length === 0
                    ? "No audit logs available"
                    : "No results found"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {accessLogs.length === 0
                    ? "Logs will appear here as users access the system."
                    : "Try adjusting your search or date range filters."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {paginatedLogs?.map((log: any) => {
                if (securitySubTab === "activity") {
                  const isCritical = log.type === "critical";
                  const isWarning = log.type === "warning";
                  const isSuccess = log.type === "success";
                  const borderColor = isCritical
                    ? "border-l-rose-500"
                    : isWarning
                      ? "border-l-amber-400"
                      : isSuccess
                        ? "border-l-emerald-500"
                        : "border-l-blue-500";
                  return (
                    <div
                      key={`audit-${log.id}`}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-l-4 ${borderColor} hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-150`}
                    >
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <Avatar
                          rounded
                          size="sm"
                          placeholderInitials={
                            log.loggedUser?.substring(0, 2).toUpperCase() || "U"
                          }
                        />
                        <div>
                          <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                            {log.loggedUser || "System"}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {format(new Date(log.timestamp), "M/d/yyyy, h:mm:ss a")}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {log.action}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="font-semibold">Target:</span> {log.target}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${isCritical ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700/50" : isWarning ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/50" : isSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/50" : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/50"}`}
                        >
                          {log.type}
                        </span>
                      </div>
                    </div>
                  );
                }

                const isSuccess = log.status === "Success";
                const isSuspicious = log.status === "Suspicious";
                const borderColor = isSuccess
                  ? "border-l-emerald-500"
                  : isSuspicious
                    ? "border-l-amber-400"
                    : "border-l-rose-500";
                const DeviceIcon =
                  log.deviceType === "Mobile"
                    ? Smartphone
                    : log.deviceType === "Tablet"
                      ? Tablet
                      : log.deviceType === "Server"
                        ? Server
                        : Monitor;
                return (
                  <div
                    key={`access-${log.id}`}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-l-4 ${borderColor} hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-150`}
                  >
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Avatar
                        rounded
                        size="sm"
                        placeholderInitials={
                          log.loggedBy?.substring(0, 2).toUpperCase() || "U"
                        }
                      />
                      <div>
                        <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                          {log.loggedBy || "Unknown"}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {isSuccess ? (
                            <span className="text-emerald-500 font-bold">✓ Success</span>
                          ) : isSuspicious ? (
                            <span className="text-amber-500 font-bold">⚠ Suspicious</span>
                          ) : (
                            <span className="text-rose-500 font-bold">✕ Failed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-[150px]">
                      <Globe size={13} className="text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
                          {log.location || "Unknown"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {log.ipAddress}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-[140px]">
                      <div className="p-1.5 bg-gray-100 dark:bg-gray-700/70 rounded-lg text-gray-500 dark:text-gray-400 shrink-0">
                        <DeviceIcon size={13} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 leading-tight">
                          {log.os || "—"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {log.browser || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${log.dataUsageType?.includes("Heavy") ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-700/50" : log.dataUsageType?.includes("API") ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-700/50" : "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-700/50"}`}
                      >
                        {log.dataUsageType || "Standard"}
                      </span>
                    </div>

                    <div className="sm:ml-auto text-right shrink-0">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Logged
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-mono mt-0.5">
                        {log.loggedDate ? new Date(log.loggedDate).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredLogs?.length > 0 && (
          <div className="border-t bg-gray-50/50 dark:bg-gray-900/20 rounded-b-xl">
            <ModernPagination
              currentPage={logsCurrentPage}
              totalPages={totalPages}
              onPageChange={setLogsCurrentPage}
              totalItems={totalItems}
              pageSize={logsPageSize}
              onPageSizeChange={setLogsPageSize}
              className="!border-none !bg-transparent !shadow-none !backdrop-blur-none hover:!shadow-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
