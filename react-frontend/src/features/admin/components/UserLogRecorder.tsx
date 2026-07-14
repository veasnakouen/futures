import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {Button, Badge, TextInput, Select, Spinner} from '@/lib/flowbite-compat';
import {
  FileText,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";
import api from '@/services/api';
import { format } from "date-fns";
import toast from "react-hot-toast";
import ModernPagination from '@/components/common/ModernPagination';
import SearchInput from "@/components/common/SearchInput";

const UserLogRecorder: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/compliance/logs");
      setLogs(res.data || []);
    } catch (err: any) {
      console.error("Failed to load audit logs", err);
      toast.error(t("failedToLoadUserLogs"));
    } finally {
      setLoading(false);
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

  // Filter logs based on search query and type
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.loggedUser &&
        log.loggedUser.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.action &&
        log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.target &&
        log.target.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "all" || log.type === selectedType;

    return matchesSearch && matchesType;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header and Controls */}
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-100/50 dark:shadow-black/40 border border-white/20 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
                {t("userLogRecorder")}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                {t("userLogRecorderDesc")}
              </p>
            </div>
          </div>

          <Button
            color="light"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
            className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 font-bold uppercase tracking-wide text-xs"
          >
            <RefreshCw
              size={12}
              className={`mr-1.5 ${loading ?"animate-spin":""}`}
            />{" "}
            {t("refreshLogs")}
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-6">
          <div className="relative">
            <SearchInput
                        placeholder={t("searchUserActionTarget")}
                        value={searchTerm}
                        onChange={setSearchTerm}
                        containerClassName="w-full"
                      />
          </div>

          <div className="relative">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              icon={Filter}
              className="w-full"
            >
              <option value="all">{t("allWarningLevels")}</option>
              <option value="info">{t("infoOperational")}</option>
              <option value="warning">{t("warningErrors")}</option>
              <option value="critical">{t("criticalCoreChanges")}</option>
            </Select>
          </div>

          <div className="flex items-center justify-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-3 py-1.5 rounded-md">
              {filteredLogs.length} {t("matchingLogs")}
            </span>
          </div>
        </div>
      </div>

      {/* Audit Logs List Card */}
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/40 border border-white/20 dark:border-gray-700/50">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center rounded-md text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest">
              {t("noMatchingLogsFound")}
            </div>
          ) : (
            paginatedLogs.map((logItem, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50/80 dark:bg-gray-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {logItem.type === "critical" ? (
                      <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-md shadow-sm border-red-100/50 dark:border-red-900/20">
                        <ShieldAlert size={16} />
                      </div>
                    ) : logItem.type === "warning" ? (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md shadow-sm border-amber-100/50 dark:border-amber-900/20">
                        <AlertTriangle size={16} />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md shadow-sm border-blue-100/50 dark:border-blue-900/20">
                        <Info size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                      {logItem.action}
                    </h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {t("target")}{" "}
                      <span className="text-gray-600 dark:text-gray-300 normal-case select-all">
                        {logItem.target}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  <Badge
                    color={
                      logItem.type === "critical"
                        ? "failure"
                        : logItem.type === "warning"
                          ? "warning"
                          : "info"
                    }
                    className="rounded-md px-2.5 font-bold uppercase text-[9px]"
                  >
                    {logItem.loggedUser || t("system")}
                  </Badge>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 select-none font-mono uppercase">
                    {formatTimeSafely(logItem.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-2 flex justify-center">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredLogs.length}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default UserLogRecorder;
