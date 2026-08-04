import { useState, useEffect } from "react";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useUserSettingsLogs(
  activeTab: string,
  setSuccess: (msg: string | null) => void,
  setError: (msg: string | null) => void
) {
  const [securitySubTab, setSecuritySubTab] = useState<"session" | "activity">("session");
  const [logsSearch, setLogsSearch] = useState("");
  const [logsStartDate, setLogsStartDate] = useState("");
  const [logsEndDate, setLogsEndDate] = useState("");
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(10);

  const { data: accessLogs = [], isLoading: isLoadingAccessLogs, refetch: refetchAccessLogs } = useQuery({
    queryKey: ["accessLogs"],
    queryFn: async () => {
      const res = await api.get("/access-logs");
      return res.data;
    },
    enabled: activeTab === "security_logs" && securitySubTab === "session",
  });

  const { data: auditLogs = [], isLoading: isLoadingAuditLogs, refetch: refetchAuditLogs } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      const res = await api.get("/compliance/logs");
      return res.data;
    },
    enabled: activeTab === "security_logs" && securitySubTab === "activity",
  });

  const loadingLogs = isLoadingAccessLogs || isLoadingAuditLogs;

  useEffect(() => {
    setLogsCurrentPage(1);
  }, [logsSearch, logsStartDate, logsEndDate, logsPageSize, securitySubTab]);

  const handleClearLogs = async (type: string) => {
    try {
      await api.delete(`/access-logs/clear?type=${type}`);
      setSuccess("Logs cleared successfully.");
      setTimeout(() => setSuccess(null), 3000);
      refetchAccessLogs();
    } catch {
      setError("Failed to clear logs.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const sourceLogs = securitySubTab === "session" ? accessLogs : auditLogs;
  const filteredLogs = sourceLogs.filter((log: any) => {
    const searchLower = logsSearch.toLowerCase();

    let matchesSearch = true;
    if (securitySubTab === "session") {
      matchesSearch =
        !logsSearch ||
        log.loggedBy?.toLowerCase().includes(searchLower) ||
        log.ipAddress?.toLowerCase().includes(searchLower) ||
        log.location?.toLowerCase().includes(searchLower) ||
        log.os?.toLowerCase().includes(searchLower) ||
        log.browser?.toLowerCase().includes(searchLower) ||
        log.status?.toLowerCase().includes(searchLower) ||
        log.dataUsageType?.toLowerCase().includes(searchLower);
    } else {
      matchesSearch =
        !logsSearch ||
        log.loggedUser?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.target?.toLowerCase().includes(searchLower) ||
        log.type?.toLowerCase().includes(searchLower);
    }

    const logDateStr = securitySubTab === "session" ? log.loggedDate : log.timestamp;
    const matchesStartDate =
      !logsStartDate || new Date(logDateStr) >= new Date(logsStartDate + "T00:00:00");
    const matchesEndDate =
      !logsEndDate || new Date(logDateStr) <= new Date(logsEndDate + "T23:59:59");

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / logsPageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (logsCurrentPage - 1) * logsPageSize,
    logsCurrentPage * logsPageSize
  );

  return {
    accessLogs,
    auditLogs,
    loadingLogs,
    refetchAccessLogs,
    refetchAuditLogs,
    securitySubTab,
    setSecuritySubTab,
    logsSearch,
    setLogsSearch,
    logsStartDate,
    setLogsStartDate,
    logsEndDate,
    setLogsEndDate,
    logsCurrentPage,
    setLogsCurrentPage,
    logsPageSize,
    setLogsPageSize,
    handleClearLogs,
    filteredLogs,
    totalItems,
    totalPages,
    paginatedLogs,
  };
}
