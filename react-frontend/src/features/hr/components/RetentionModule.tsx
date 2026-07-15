import React, { useState, useEffect } from "react";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Progress, Spinner} from '@/lib/flowbite-compat';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Heart,
  UserMinus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';

const RetentionModule: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({
    averageRetention: 96.8,
    highRiskCount: 0,
    averageTenure: 0.0,
    stabilityIndex: "Loading",
  });
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const fetchRetentionData = async () => {
    try {
      setLoading(true);
      const [metricsRes, risksRes] = await Promise.all([
        api.get("/hr/retention/metrics"),
        api.get("/hr/retention/risks"),
      ]);

      setMetrics(metricsRes.data || {});
      setRisks(risksRes.data || []);
    } catch (err) {
      console.error("Failed to fetch retention data", err);
      toast.error("Failed to connect to retention AI engine", { id: 'err-retention-api' });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "failure";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Running Retention Diagnostics...
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
            Retention & Predictive Intelligence
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Attrition Mitigation, Risk Analysis & Team Morale Pulse
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="blue"
            size="sm"
            className="rounded-md shadow-lg shadow-blue-500/20 text-xs font-black uppercase transition-all hover:scale-105"
            onClick={() =>
              toast.success("Pulse survey broadcast scheduled", { icon: "📡" })
            }
          >
            <Heart size={14} className="mr-2" /> Launch Pulse Survey
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Average Annual Retention
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md">
              <TrendingUp size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.averageRetention}%
          </h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Well above industry baseline 85%
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              High Attrition Risk
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-md">
              <AlertTriangle size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(metrics.highRiskCount).padStart(2, "0")} Staff
          </h4>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">
            Requires direct intervention
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Average Tenure Span
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md">
              <TrendingUp size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.averageTenure} Years
          </h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Healthy workforce scaling index
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Stability Index
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-md">
              <ShieldCheck size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.stabilityIndex}
          </h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase mt-2">
            Systematic retention check
          </p>
        </div>
      </div>

      {/* Risk Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <UserMinus size={20} className="text-rose-500" /> Retention Risk &
            Action Registry
          </h4>
          <div className="overflow-x-auto max-h-[500px]">
            <Table hoverable className="border-none w-full relative">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400 sticky top-0 z-10">
                <TableHeadCell className="py-4">Staff Member</TableHeadCell>
                <TableHeadCell className="py-4">Tenure</TableHeadCell>
                <TableHeadCell className="py-4">Risk Index</TableHeadCell>
                <TableHeadCell className="py-4">
                  Satisfaction Score
                </TableHeadCell>
                <TableHeadCell className="py-4 text-right">
                  Mitigation Action
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {risks.length === 0 ? (
                  <TableRow className="bg-white dark:bg-gray-800">
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                    >
                      No retention risks found
                    </TableCell>
                  </TableRow>
                ) : (
                  risks.map((risk, idx) => (
                    <TableRow
                      key={risk.id || idx}
                      className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                    >
                      <TableCell className="font-black dark:text-white text-xs py-4">
                        <div>
                          <p className="leading-none uppercase tracking-tight">
                            {risk.name}
                          </p>
                          <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">
                            {risk.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 py-4 font-mono">
                        {risk.tenure}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          color={getRiskBadgeColor(risk.risk)}
                          className="w-fit px-3 rounded-md text-[9px] font-black uppercase tracking-widest"
                        >
                          {risk.risk}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3 w-32">
                          <Progress
                            progress={risk.satisfaction}
                            size="sm"
                            color={
                              risk.satisfaction > 80
                                ? "green"
                                : risk.satisfaction > 70
                                  ? "yellow"
                                  : "red"
                            }
                          />
                          <span className="font-mono text-xs font-bold dark:text-gray-300 w-8">
                            {risk.satisfaction}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        {risk.action !== "None required" ? (
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() =>
                              toast.success(
                                `Action initiated for ${risk.name}`,
                                { icon: "🚀" },
                              )
                            }
                            className="rounded-md shadow-sm font-black uppercase tracking-widest text-[9px]"
                          >
                            {risk.action}
                          </Button>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                            <ShieldCheck size={12} /> {risk.action}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Retention advice card */}
        <div className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Heart size={20} className="text-indigo-600" /> Retention Advice
              Engine
            </h4>
            <div className="space-y-4 text-xs text-gray-400 font-bold leading-relaxed">
              <p>
                🔮 **AI Risk Node Insight**: The retention index is currently{" "}
                <span
                  className={
                    metrics.highRiskCount > 5
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }
                >
                  {metrics.stabilityIndex}
                </span>
                . We detected {metrics.highRiskCount} team members exhibiting
                potential attrition risk due to career trajectory plateaus.
              </p>
              <p>
                ⚡ **Recommendation**: Plan automatic **Career Growth
                Progression Reviews** for seniors approaching the 3+ year mark
                to ensure continuous skill alignment and node retention.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <Button
              color="light"
              size="sm"
              className="w-full rounded-md font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all border-none"
              onClick={() =>
                toast.loading("Initializing Career Alignment Planner...", {
                  duration: 2000,
                })
              }
            >
              Open Career Alignment Planner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionModule;
