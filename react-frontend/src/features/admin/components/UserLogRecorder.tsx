import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  TextInput,
  Select,
  Spinner,
} from '@/lib/flowbite-compat';
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

const UserLogRecorder: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

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
      toast.error("Failed to load user log recorder logs");
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

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header and Controls */}
      <Card className="p-6 rounded-md dark:bg-gray-800/40 dark:backdrop-blur-md border border-gray-100 dark:border-gray-850 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h3 className="text-lg font-black dark:text-white flex items-center gap-3">
              <FileText className="text-blue-600 dark:text-blue-400" />
              User Log Recorder (Audit Trail)
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
              Real-time immutable log of administrative actions, user role
              modifications, and system triggers.
            </p>
          </div>

          <Button
            color="light"
            size="xs"
            onClick={fetchLogs}
            disabled={loading}
            className="rounded-md font-black uppercase text-[10px]"
          >
            <RefreshCw
              size={12}
              className={`mr-1.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh Logs
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t dark:border-gray-700/40 pt-6">
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search user, action, target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-full"
            />
          </div>

          <div className="relative">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              icon={Filter}
              className="w-full"
            >
              <option value="all">All Warning Levels</option>
              <option value="info">Info / Operational</option>
              <option value="warning">Warning / Errors</option>
              <option value="critical">Critical / Core Changes</option>
            </Select>
          </div>

          <div className="flex items-center justify-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-3 py-1.5 rounded-md border border-gray-100 dark:border-gray-700/50">
              {filteredLogs.length} matching logs
            </span>
          </div>
        </div>
      </Card>

      {/* Audit Logs List Card */}
      <Card className="p-6 rounded-md dark:bg-gray-800/40 dark:backdrop-blur-md border border-gray-100 dark:border-gray-850 shadow-md">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center border border-dashed dark:border-gray-700/80 rounded-md text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest">
              No matching audit logs found in database.
            </div>
          ) : (
            filteredLogs.map((logItem, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50/50 dark:bg-gray-800/25 border border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {logItem.type === "critical" ? (
                      <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-md shadow-sm border border-red-100/50 dark:border-red-900/20">
                        <ShieldAlert size={16} />
                      </div>
                    ) : logItem.type === "warning" ? (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md shadow-sm border border-amber-100/50 dark:border-amber-900/20">
                        <AlertTriangle size={16} />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md shadow-sm border border-blue-100/50 dark:border-blue-900/20">
                        <Info size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                      {logItem.action}
                    </h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      Target:{" "}
                      <span className="text-gray-600 dark:text-gray-300 normal-case select-all">
                        {logItem.target}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-gray-750/30 pt-3 md:pt-0">
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
                    {logItem.loggedUser || "System"}
                  </Badge>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 select-none font-mono uppercase">
                    {formatTimeSafely(logItem.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserLogRecorder;
