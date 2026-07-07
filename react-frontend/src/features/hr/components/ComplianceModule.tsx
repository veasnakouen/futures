import React, { useState, useEffect } from "react";
import {Button, Badge, Spinner} from '@/lib/flowbite-compat';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import api from '@/services/api';
import { format } from "date-fns";

const ComplianceModule: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      setLoadingStats(true);
      const resStats = await api.get("/compliance/stats");
      setStats(resStats.data);
    } catch (err) {
      console.error("Failed to fetch compliance stats", err);
    } finally {
      setLoadingStats(false);
    }

    try {
      setLoadingLogs(true);
      const resLogs = await api.get("/compliance/logs");
      setLogs(resLogs.data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleExecuteScan = async () => {
    try {
      setScanning(true);
      const res = await api.post("/compliance/scan");
      setStats(res.data);

      // Refetch logs to include the newly appended cybersecurity scan log
      const resLogs = await api.get("/compliance/logs");
      setLogs(resLogs.data || []);
    } catch (err) {
      console.error("Failed to run compliance scan", err);
    } finally {
      setScanning(false);
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

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const diffMs = new Date().getTime() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} mins ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Governance Status */}
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-l-[12px] border-l-emerald-500">
          {loadingStats ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-md">
                  <ShieldCheck size={32} />
                </div>
                <Badge
                  color={stats?.status === "Compliant" ? "success" : "warning"}
                  className="rounded-md px-4 font-black uppercase text-[10px]"
                >
                  {stats?.status || "Compliant"}
                </Badge>
              </div>
              <h4 className="font-black dark:text-white text-xl">
                Governance Status
              </h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Compliance Rating:{" "}
                <span className="text-blue-600 font-extrabold">
                  {stats?.score || 100}%
                </span>
              </p>

              <div className="mt-8 pt-8 border-t flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-gray-400">GDPR Compliance</span>
                <span className="text-emerald-500">Active</span>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-gray-400">Local Labor Laws</span>
                <span className="text-emerald-500">Active</span>
              </div>
            </>
          )}
        </div>

        {/* Immutable Audit Trail */}
        <div className="lg:col-span-2 p-10 rounded-md dark:bg-gray-800 border-none shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-xl dark:text-white flex items-center gap-3">
              <FileText className="text-blue-600" /> Immutable Audit Trail
            </h4>
            <div className="flex gap-2">
              <Button
                color="light"
                size="xs"
                onClick={fetchComplianceData}
                className="rounded-md font-black uppercase text-[9px]"
              >
                Refresh Logs
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
            {loadingLogs ? (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center rounded-md text-gray-400">
                No activity audit logs found in the database.
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center border-transparent hover: dark:hover: transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-md ${log.type ==="critical"?"bg-red-500": log.type ==="warning"?"bg-amber-500":"bg-blue-500"}`}
                    ></div>
                    <div>
                      <p className="text-xs font-black dark:text-white">
                        {log.action}
                      </p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {log.loggedUser} • {log.target}
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {getRelativeTime(log.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RBAC Control Matrix */}
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-blue-600">
          <h4 className="font-black text-xl dark:text-white mb-6">
            RBAC Control Matrix
          </h4>
          <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8">
            Manage role-based access control across all HR modules. Ensure that
            only authorized personnel can view sensitive financial, payroll, and
            personal data nodes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              color="blue"
              className="rounded-md h-12 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20"
            >
              Permission Grid
            </Button>
            <Button
              color="light"
              className="rounded-md h-12 font-black uppercase text-[10px]"
            >
              MFA Health Check
            </Button>
          </div>
        </div>

        {/* Security Fortification */}
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-rose-600">
          <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3">
            <ShieldAlert className="text-rose-600" /> Security Fortification
          </h4>

          {loadingStats ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-8 bg-rose-50 dark:bg-rose-900/10 p-6 rounded-md border-rose-100 dark:border-rose-900/20">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center text-rose-600 shadow-sm">
                  {stats?.score >= 90 ? (
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={32} />
                  )}
                </div>
                <div>
                  <p className="text-lg font-black dark:text-white leading-tight">
                    {stats?.score >= 90
                      ? "Workforce Audited"
                      : "System Audit Due"}
                  </p>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">
                    Last Scan: {formatTimeSafely(stats?.lastSecurityReview)}
                  </p>
                </div>
              </div>

              <Button
                color="blue"
                onClick={handleExecuteScan}
                disabled={scanning}
                className="w-full mt-6 rounded-md h-12 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20"
              >
                {scanning ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Auditing Workforce
                    Files...
                  </>
                ) : (
                  "Execute Security Scan"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceModule;
