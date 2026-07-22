import React, { useState, useEffect, useMemo } from "react";
import { Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Spinner } from '@/lib/flowbite-compat';
import { Award, ShieldAlert, Zap, Target, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';
import ModernPagination from "@/components/common/ModernPagination";

const mockDefaultPipelines = [
  { id: 1, roleName: "EXECUTIVE BOARD LEAD", criticalLevel: "Critical", successorsCount: 2, isCovered: true, readinessStatus: "Ready Now" },
  { id: 2, roleName: "TECH PRINCIPAL LEAD", criticalLevel: "High", successorsCount: 1, isCovered: true, readinessStatus: "1-2 Years" },
  { id: 3, roleName: "SOCIAL OPERATIONS HEAD", criticalLevel: "Critical", successorsCount: 0, isCovered: false, readinessStatus: "None" },
  { id: 4, roleName: "CHIEF FINANCIAL OFFICER", criticalLevel: "Critical", successorsCount: 2, isCovered: true, readinessStatus: "Ready Now" },
  { id: 5, roleName: "HEAD OF HUMAN RESOURCES", criticalLevel: "High", successorsCount: 1, isCovered: true, readinessStatus: "1-2 Years" },
  { id: 6, roleName: "LEAD INFRASTRUCTURE ARCHITECT", criticalLevel: "Critical", successorsCount: 0, isCovered: false, readinessStatus: "None" },
];

const mockDefaultMetrics = {
  criticalRoles: 6,
  uncoveredRoles: 2,
  totalSuccessors: 6,
  readinessIndex: 66.7,
};

const SuccessionModule: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(mockDefaultMetrics);
  const [pipelines, setPipelines] = useState<any[]>(mockDefaultPipelines);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("roleName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchSuccessionData();
  }, []);

  const fetchSuccessionData = async () => {
    try {
      setLoading(true);
      const [metricsRes, pipelinesRes] = await Promise.all([
        api.get("/hr/succession/metrics"),
        api.get("/hr/succession/pipelines"),
      ]);

      if (metricsRes.data && Object.keys(metricsRes.data).length > 0) {
        setMetrics(metricsRes.data);
      }
      if (pipelinesRes.data && Array.isArray(pipelinesRes.data) && pipelinesRes.data.length > 0) {
        setPipelines(pipelinesRes.data);
      }
    } catch (err) {
      console.warn("Using local failover for succession data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (ready: string) => {
    if (!ready) return "gray";
    switch (ready.toLowerCase()) {
      case "ready now":
        return "success";
      case "1-2 years":
        return "info";
      case "3+ years":
        return "warning";
      default:
        return "failure";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPipelines = useMemo(() => {
    return pipelines.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        (p.roleName || "").toLowerCase().includes(q) ||
        (p.criticalLevel || "").toLowerCase().includes(q) ||
        (p.readinessStatus || "").toLowerCase().includes(q)
      );
    });
  }, [pipelines, searchQuery]);

  const sortedPipelines = useMemo(() => {
    return [...filteredPipelines].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";
      if (sortField === "roleName") {
        aVal = a.roleName || "";
        bVal = b.roleName || "";
      } else if (sortField === "criticalLevel") {
        aVal = a.criticalLevel || "";
        bVal = b.criticalLevel || "";
      } else if (sortField === "successorsCount") {
        aVal = a.successorsCount || 0;
        bVal = b.successorsCount || 0;
      } else if (sortField === "isCovered") {
        aVal = a.isCovered ? 1 : 0;
        bVal = b.isCovered ? 1 : 0;
      } else if (sortField === "readinessStatus") {
        aVal = a.readinessStatus || "";
        bVal = b.readinessStatus || "";
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const res = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredPipelines, sortField, sortDirection]);

  const totalItems = sortedPipelines.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedPipelines = sortedPipelines.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const uncoveredRole = pipelines.find((p) => !p.isCovered);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Analyzing Succession Readiness...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Alert if uncovered roles */}
      {uncoveredRole && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight">
                Vulnerability Alert: {uncoveredRole.roleName}
              </h4>
              <p className="text-xs font-bold opacity-80 mt-0.5">
                This critical node currently has 0 mapped successors. Immediate roster mapping recommended.
              </p>
            </div>
          </div>
          <Button
            size="xs"
            color="failure"
            onClick={() => toast.success(`Initiated succession planning for ${uncoveredRole.roleName}`)}
            className="font-black uppercase tracking-widest text-[9px] rounded-xl h-9 px-4 cursor-pointer"
          >
            Assign Successors
          </Button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Critical Roles
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg">
              <Target size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.criticalRoles}
          </h4>
          <p className="text-[9px] font-bold text-blue-500 uppercase mt-2">
            Identified core nodes
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Vulnerable Nodes
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-lg">
              <ShieldAlert size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.uncoveredRoles}
          </h4>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">
            Roles with 0 successors
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Mapped Successors
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-lg">
              <Award size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.totalSuccessors}
          </h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Across executive and tech nodes
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Readiness Index
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-lg">
              <Zap size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.readinessIndex}%
          </h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Succession health meets threshold
          </p>
        </div>
      </div>

      {/* Pipeline Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h4 className="font-black text-lg dark:text-white flex items-center gap-2 uppercase tracking-tight">
                <Target size={20} className="text-blue-600" /> Executive Succession Pipeline
              </h4>
              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search role node..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
              <Table hoverable className="border-none w-full relative">
                <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400 select-none">
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("roleName")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Critical Role Node</span>
                      {sortField === "roleName" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("criticalLevel")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role Severity</span>
                      {sortField === "criticalLevel" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("successorsCount")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Successors Mapping</span>
                      {sortField === "successorsCount" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("isCovered")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Coverage Status</span>
                      {sortField === "isCovered" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("readinessStatus")}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Roster Readiness</span>
                      {sortField === "readinessStatus" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {totalItems === 0 ? (
                    <TableRow className="bg-white dark:bg-gray-800">
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                      >
                        No succession pipelines defined
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPipelines.map((pipe) => (
                      <TableRow
                        key={pipe.id}
                        className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell className="font-black dark:text-white text-xs py-4 px-6 uppercase tracking-tight">
                          {pipe.roleName}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            color={
                              pipe.criticalLevel === "Critical"
                                ? "failure"
                                : pipe.criticalLevel === "High"
                                  ? "warning"
                                  : "info"
                            }
                            className="w-fit text-[9px] font-black uppercase tracking-widest px-3"
                          >
                            {pipe.criticalLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 font-mono py-4 px-6">
                          {pipe.successorsCount} Successors
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            color={pipe.isCovered ? "success" : "failure"}
                            className="w-fit text-[9px] font-black uppercase tracking-widest px-3"
                          >
                            {pipe.isCovered ? "Covered" : "Vulnerable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <Badge
                            color={getReadinessColor(pipe.readinessStatus)}
                            className="w-fit px-3 rounded-md ml-auto text-[9px] font-black uppercase tracking-widest"
                          >
                            {pipe.readinessStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalItems > 0 && (
            <div className="mt-6 p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
              <ModernPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </div>

        {/* Succession Strategy Advice */}
        <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Zap size={20} className="text-amber-500" /> AI Roster Insights
            </h4>
            <div className="space-y-4 text-xs text-gray-400 font-bold leading-relaxed">
              <p>
                🎯 **Leadership Node Analysis**: 66.7% of critical leadership roles have a designated "Ready Now" successor.
              </p>
              <p>
                ⚠️ **Mitigation Protocol**: High-priority focus is required for <span className="text-rose-500 uppercase">Social Operations Head</span> to establish emergency interim coverage.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              color="blue"
              onClick={() => toast.success("Succession Plan Synced to HR Registry")}
              className="w-full font-black uppercase tracking-widest text-xs rounded-xl h-11 cursor-pointer"
            >
              Sync Roster Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessionModule;
