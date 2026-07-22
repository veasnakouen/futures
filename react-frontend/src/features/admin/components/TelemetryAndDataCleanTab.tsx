import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Select, Spinner, Modal, ModalBody } from "@/lib/flowbite-compat";
import {
  Globe,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  Server,
  Monitor,
  Activity,
  Trash2,
  ShieldAlert,
  RefreshCw,
  Filter,
  AlertTriangle,
  HardDrive,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";
import api from "@/services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ModernPagination from "@/components/common/ModernPagination";
import SearchInput from "@/components/common/SearchInput";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

interface AccessLog {
  id: number;
  loggedBy: string;
  loggedDate: string;
  ipAddress: string;
  hostName: string;
  deviceType: string;
  os: string;
  browser: string;
  location: string;
  dataUsageType: string;
  status: string;
}

interface AnalyticsData {
  totalLogs: number;
  osDistribution: Record<string, number>;
  browserDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

interface StorageStats {
  accessLogsCount: number;
  auditLogsCount: number;
  usersCount: number;
  rolesCount: number;
  permissionsCount: number;
  estimatedLogSizeKb: number;
  lastCleanedTimestamp: string;
}

const TelemetryAndDataCleanTab: React.FC = () => {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<"TRACKING" | "ANALYTICS" | "CLEANUP">("TRACKING");

  // State - Telemetry Tracking
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State - Analytics & Data Cleanup
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Modal Cleanup state
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [cleanupTarget, setCleanupTarget] = useState<"access" | "audit" | "orphan">("access");
  const [cleanupRange, setCleanupRange] = useState("30days");
  const [processingCleanup, setProcessingCleanup] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchAnalytics();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await api.get("/access-logs");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load telemetry logs", err);
      toast.error("Failed to load access telemetry logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await api.get("/access-logs/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load telemetry analytics", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/data-clean/stats");
      setStorageStats(res.data);
    } catch (err) {
      console.error("Failed to load storage stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatTimeSafely = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy hh:mm a");
    } catch (e) {
      return dateStr;
    }
  };

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

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (log.loggedBy && log.loggedBy.toLowerCase().includes(query)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
      (log.location && log.location.toLowerCase().includes(query)) ||
      (log.os && log.os.toLowerCase().includes(query)) ||
      (log.browser && log.browser.toLowerCase().includes(query));

    const matchesDevice = deviceFilter === "all" || log.deviceType?.toLowerCase() === deviceFilter.toLowerCase();

    return matchesSearch && matchesDevice;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // Execute Cleanup Operation
  const executeCleanup = async () => {
    try {
      setProcessingCleanup(true);
      if (cleanupTarget === "access") {
        await api.post(`/admin/data-clean/purge-access-logs?range=${cleanupRange}`);
        toast.success(`Access logs (${cleanupRange}) purged successfully from database!`);
      } else if (cleanupTarget === "audit") {
        await api.post(`/admin/data-clean/purge-audit-logs?range=${cleanupRange}`);
        toast.success(`Audit logs (${cleanupRange}) purged successfully from database!`);
      } else if (cleanupTarget === "orphan") {
        await api.post("/admin/data-clean/clean-orphans");
        toast.success("Orphaned tokens and temporary session records cleaned!");
      }
      setShowCleanupModal(false);
      fetchLogs();
      fetchAnalytics();
      fetchStats();
    } catch (err: any) {
      console.error("Cleanup error:", err);
      toast.error(err.response?.data?.message || "Failed to execute cleanup operation");
    } finally {
      setProcessingCleanup(false);
    }
  };

  const openCleanupModal = (target: "access" | "audit" | "orphan") => {
    setCleanupTarget(target);
    setShowCleanupModal(true);
  };

  const SUB_TABS = [
    { id: "TRACKING", label: `User Location & Device Telemetry (${logs.length})`, icon: Activity },
    { id: "ANALYTICS", label: "Telemetry Analytics", icon: BarChart3 },
    { id: "CLEANUP", label: "Admin Data Cleanup Suite", icon: Trash2 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Animated Header Component */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 dark:shadow-black/50 border border-white/20 dark:border-gray-700/60"
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

        {/* Animated Sub-Tabs Navigation with Horizontal Scroll & Layout Pill Slider */}
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

      {/* Animated Active Sub-Tab View Container */}
      <AnimatePresence mode="wait">
        {/* SUB-TAB 1: USER LOCATION & DEVICE TELEMETRY TRACKING */}
        {activeSubTab === "TRACKING" && (
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
                  onChange={setSearchTerm}
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
                      {paginatedLogs.map((log, index) => (
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
        )}

        {/* SUB-TAB 2: TELEMETRY ANALYTICS */}
        {activeSubTab === "ANALYTICS" && (
          <motion.div
            key="ANALYTICS"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6"
          >
            {loadingAnalytics ? (
              <div className="flex justify-center py-20">
                <Spinner size="xl" />
              </div>
            ) : !analytics ? (
              <div className="p-8 text-center text-gray-500 font-bold">No telemetry analytics available</div>
            ) : (
              <>
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

                {/* Detailed Animated Breakdown Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Operating System Distribution */}
                  <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h4 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-indigo-500" />
                      Operating System Breakdown
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(analytics.osDistribution || {}).map(([osName, count]) => {
                        const percentage = Math.round((count / (analytics.totalLogs || 1)) * 100);
                        return (
                          <div key={osName} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-extrabold text-gray-700 dark:text-gray-300">
                              <span>{osName}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Browser Share */}
                  <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h4 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-500" />
                      Browser Market Share
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(analytics.browserDistribution || {}).map(([browser, count]) => {
                        const percentage = Math.round((count / (analytics.totalLogs || 1)) * 100);
                        return (
                          <div key={browser} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-extrabold text-gray-700 dark:text-gray-300">
                              <span>{browser}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Geographic Locations */}
                  <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h4 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-500" />
                      Top Geo Access Locations
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(analytics.locationDistribution || {}).map(([loc, count]) => {
                        const percentage = Math.round((count / (analytics.totalLogs || 1)) * 100);
                        return (
                          <div key={loc} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-extrabold text-gray-700 dark:text-gray-300">
                              <span>{loc}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Device Categories */}
                  <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h4 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-amber-500" />
                      Device Category Ratio
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(analytics.deviceDistribution || {}).map(([dev, count]) => {
                        const percentage = Math.round((count / (analytics.totalLogs || 1)) * 100);
                        return (
                          <div key={dev} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-extrabold text-gray-700 dark:text-gray-300">
                              <span>{dev}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* SUB-TAB 3: ADMIN DATA CLEANUP SUITE */}
        {activeSubTab === "CLEANUP" && (
          <motion.div
            key="CLEANUP"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Storage Stats Banner */}
            <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50">
              <h4 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                Database & Telemetry Storage Overview (Bound to Database)
              </h4>

              {loadingStats ? (
                <div className="flex justify-center py-6">
                  <Spinner size="md" />
                </div>
              ) : storageStats ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Access Telemetry Logs</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{storageStats.accessLogsCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Audit Records</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{storageStats.auditLogsCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Registered Users</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{storageStats.usersCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Security Roles</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{storageStats.rolesCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700 col-span-2 lg:col-span-1">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Estimated Log Size</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{storageStats.estimatedLogSizeKb} KB</p>
                  </motion.div>
                </div>
              ) : null}
            </div>

            {/* Cleanup Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Purge Access Logs Card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <Activity size={24} />
                  </div>
                  <h4 className="text-base font-black text-gray-900 dark:text-white">Purge Telemetry Logs</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                    Safely remove user device and IP access tracking entries from database older than selected retention duration.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <Button
                    color="blue"
                    onClick={() => openCleanupModal("access")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-extrabold shadow-md hover:shadow-lg transition-all active:scale-98"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Purge Access Logs
                  </Button>
                </div>
              </motion.div>

              {/* Purge Audit Logs Card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                    <ShieldAlert size={24} />
                  </div>
                  <h4 className="text-base font-black text-gray-900 dark:text-white">Purge System Audit Trail</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                    Clean operational audit logs to satisfy compliance policies and optimize database storage.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <Button
                    color="purple"
                    onClick={() => openCleanupModal("audit")}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-extrabold shadow-md hover:shadow-lg transition-all active:scale-98"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Purge Audit Records
                  </Button>
                </div>
              </motion.div>

              {/* Clean Orphan & Expired Data */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                    <Zap size={24} />
                  </div>
                  <h4 className="text-base font-black text-gray-900 dark:text-white">Orphan & Session Clean</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                    Clear evicted security session entries, orphaned temporary files, and obsolete tracking states.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <Button
                    color="failure"
                    onClick={() => openCleanupModal("orphan")}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-extrabold shadow-md hover:shadow-lg transition-all active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Execute Orphan Clean
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION CLEANUP MODAL */}
      <Modal show={showCleanupModal} onClose={() => setShowCleanupModal(false)} size="md">
        <CustomModalHeader
          title={
            cleanupTarget === "access"
              ? "Purge Access Telemetry Logs"
              : cleanupTarget === "audit"
              ? "Purge System Audit Trail"
              : "Execute Orphan & Temporary Clean"
          }
          subtitle="Admin Database Maintenance"
          onClose={() => setShowCleanupModal(false)}
        />
        <ModalBody className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-3 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold">
                <p className="font-extrabold">Permanent Database Operation</p>
                <p className="mt-1">
                  This action will permanently delete selected records from the database. This operation cannot be undone.
                </p>
              </div>
            </div>

            {cleanupTarget !== "orphan" && (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Select Retention Period / Range:
                </label>
                <Select
                  value={cleanupRange}
                  onChange={(e) => setCleanupRange(e.target.value)}
                  className="w-full font-bold text-xs"
                >
                  <option value="7days">Older than 7 Days</option>
                  <option value="30days">Older than 30 Days</option>
                  <option value="90days">Older than 90 Days</option>
                  <option value="all">ALL Records (Complete Purge)</option>
                </Select>
              </div>
            )}
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={() => setShowCleanupModal(false)}
          isEditMode={false}
          submitText={processingCleanup ? "Purging..." : "Confirm Purge"}
          onSubmit={executeCleanup}
          cancelText="Cancel"
        />
      </Modal>
    </div>
  );
};

export default TelemetryAndDataCleanTab;
