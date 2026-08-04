import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";

export interface AccessLog {
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

export interface AnalyticsData {
  totalLogs: number;
  osDistribution: Record<string, number>;
  browserDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

export interface StorageStats {
  accessLogsCount: number;
  auditLogsCount: number;
  usersCount: number;
  rolesCount: number;
  permissionsCount: number;
  estimatedLogSizeKb: number;
  lastCleanedTimestamp: string;
}

export function useTelemetryAndDataCleanState() {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<"TRACKING" | "ANALYTICS" | "CLEANUP">("TRACKING");

  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
    } catch {
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
    } catch {} finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/data-clean/stats");
      setStorageStats(res.data);
    } catch {} finally {
      setLoadingStats(false);
    }
  };

  const formatTimeSafely = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy hh:mm a");
    } catch {
      return dateStr;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (log.loggedBy && log.loggedBy.toLowerCase().includes(query)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
      (log.location && log.location.toLowerCase().includes(query)) ||
      (log.os && log.os.toLowerCase().includes(query)) ||
      (log.browser && log.browser.toLowerCase().includes(query));

    const matchesDevice =
      deviceFilter === "all" || log.deviceType?.toLowerCase() === deviceFilter.toLowerCase();

    return matchesSearch && matchesDevice;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

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
      toast.error(err.response?.data?.message || "Failed to execute cleanup operation");
    } finally {
      setProcessingCleanup(false);
    }
  };

  const openCleanupModal = (target: "access" | "audit" | "orphan") => {
    setCleanupTarget(target);
    setShowCleanupModal(true);
  };

  return {
    t,
    activeSubTab,
    setActiveSubTab,
    logs,
    loadingLogs,
    searchTerm,
    setSearchTerm,
    deviceFilter,
    setDeviceFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    analytics,
    loadingAnalytics,
    storageStats,
    loadingStats,
    showCleanupModal,
    setShowCleanupModal,
    cleanupTarget,
    setCleanupTarget,
    cleanupRange,
    setCleanupRange,
    processingCleanup,
    fetchLogs,
    fetchAnalytics,
    fetchStats,
    formatTimeSafely,
    filteredLogs,
    totalPages,
    paginatedLogs,
    executeCleanup,
    openCleanupModal,
  };
}
