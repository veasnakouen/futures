import React, { useState, useEffect } from "react";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Spinner} from '@/lib/flowbite-compat';
import { Award, ShieldAlert, Zap, Target } from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';

const SuccessionModule: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({
    criticalRoles: 0,
    uncoveredRoles: 0,
    totalSuccessors: 0,
    readinessIndex: 0.0,
  });
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      setMetrics(metricsRes.data || {});
      setPipelines(pipelinesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch succession data", err);
      toast.error("Failed to connect to succession AI engine");
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

  // Find the first uncovered role to highlight in the vulnerability alert
  const uncoveredRole = pipelines.find((p) => !p.isCovered);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Mapping Succession Paths...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Talent Succession Pipeline
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Identified Successors, Readiness Assessments & Critical Role Mapping
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="blue"
            size="sm"
            className="rounded-md shadow-lg shadow-blue-500/20 text-xs font-black uppercase transition-transform hover:scale-105"
            onClick={() =>
              toast.success("Gap analysis simulation complete", { icon: "🎯" })
            }
          >
            <Target size={14} className="mr-2" /> Perform Gap Analysis
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Critical Roles Defined
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-md">
              <ShieldAlert size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(metrics.criticalRoles).padStart(2, "0")} Roles
          </h4>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">
            Requires active backup mapping
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Uncovered Roles
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-md">
              <ShieldAlert size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(metrics.uncoveredRoles).padStart(2, "0")} Role
            {metrics.uncoveredRoles !== 1 ? "s" : ""}
          </h4>
          <p
            className={
              metrics.uncoveredRoles > 0
                ? "text-[9px] font-bold text-amber-500 uppercase mt-2"
                : "text-[9px] font-bold text-emerald-500 uppercase mt-2"
            }
          >
            {metrics.uncoveredRoles > 0
              ? "Zero active successors identified"
              : "All critical roles covered"}
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Successors Identified
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md">
              <Award size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(metrics.totalSuccessors).padStart(2, "0")} Successors
          </h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Across executive and tech nodes
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Readiness Index
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-md">
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
        <div className="lg:col-span-2 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Target size={20} className="text-blue-600" /> Executive Succession
            Pipeline
          </h4>
          <div className="overflow-x-auto">
            <Table hoverable className="border-none">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="py-4">
                  Critical Role Node
                </TableHeadCell>
                <TableHeadCell className="py-4">Role Severity</TableHeadCell>
                <TableHeadCell className="py-4">
                  Successors Mapping
                </TableHeadCell>
                <TableHeadCell className="py-4">Coverage Status</TableHeadCell>
                <TableHeadCell className="py-4 text-right">
                  Roster Readiness
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {pipelines.length === 0 ? (
                  <TableRow className="bg-white dark:bg-gray-800">
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                    >
                      No succession pipelines defined
                    </TableCell>
                  </TableRow>
                ) : (
                  pipelines.map((pipe) => (
                    <TableRow
                      key={pipe.id}
                      className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                    >
                      <TableCell className="font-black dark:text-white text-xs py-4 uppercase tracking-tight">
                        {pipe.roleName}
                      </TableCell>
                      <TableCell className="py-4">
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
                      <TableCell className="text-xs text-gray-500 font-mono py-4">
                        {pipe.successorsCount} Successors
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={pipe.isCovered ? "success" : "failure"}
                          className="w-fit text-[9px] font-black uppercase tracking-widest px-3"
                        >
                          {pipe.isCovered ? "Covered" : "Vulnerable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
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

        {/* Gap Analysis */}
        <div className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
              <ShieldAlert size={20} className="text-rose-500" /> Vulnerability
              Alert Engine
            </h4>
            <div className="space-y-4 text-xs text-gray-400 font-bold leading-relaxed">
              {uncoveredRole ? (
                <>
                  <p>
                    ⚠️ **Operational Vulnerability**: The role **
                    {uncoveredRole.roleName}** has **0 Successors** assigned.
                  </p>
                  <p>
                    🔮 **Mitigation Strategy**: The AI succession engine
                    recommends identifying and mapping a high-potential
                    successor immediately to cover this vital post.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    ✅ **Operational Stability**: All tracked critical roles
                    currently have mapped successors.
                  </p>
                  <p>
                    🔮 **Mitigation Strategy**: Continue monitoring the
                    readiness index to ensure successors are developing toward
                    "Ready Now" status.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <Button
              color="blue"
              size="sm"
              className="w-full rounded-md shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02]"
              onClick={() =>
                toast.success("Auto-matching protocol active", { icon: "🤖" })
              }
            >
              Launch Successor Auto-Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessionModule;
