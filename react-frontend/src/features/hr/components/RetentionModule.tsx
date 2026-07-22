import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Button, Progress } from "@/lib/flowbite-compat";
import { UserMinus, ShieldCheck, Heart, Sparkles, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import ModernPagination from "@/components/common/ModernPagination";

interface RetentionModuleProps {
  metrics?: {
    retentionRate: number;
    attritionRisk: number;
    highRiskCount: number;
    stabilityIndex: string;
  };
  risks?: any[];
}

const defaultMetrics = {
  retentionRate: 94.2,
  attritionRisk: 5.8,
  highRiskCount: 3,
  stabilityIndex: "92.4 / 100",
};

const defaultRisks = [
  { id: 1, name: "John Doe", role: "Senior Developer", tenure: "3.2 yrs", risk: "HIGH", satisfaction: 65, action: "Review Compensation" },
  { id: 2, name: "Alice Smith", role: "UX Designer", tenure: "2.1 yrs", risk: "MEDIUM", satisfaction: 74, action: "Schedule 1-on-1" },
  { id: 3, name: "Robert Johnson", role: "DevOps Engineer", tenure: "4.5 yrs", risk: "HIGH", satisfaction: 58, action: "Career Progression" },
];

const RetentionModule: React.FC<RetentionModuleProps> = ({
  metrics = defaultMetrics,
  risks = defaultRisks,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("risk");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getRiskBadgeColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "failure";
      case "MEDIUM":
      case "MODERATE":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "gray";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedRisks = useMemo(() => {
    return [...risks].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";
      if (sortField === "name") {
        aVal = a.name || "";
        bVal = b.name || "";
      } else if (sortField === "tenure") {
        aVal = a.tenure || "";
        bVal = b.tenure || "";
      } else if (sortField === "risk") {
        aVal = a.risk || "";
        bVal = b.risk || "";
      } else if (sortField === "satisfaction") {
        aVal = a.satisfaction || 0;
        bVal = b.satisfaction || 0;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const res = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? res : -res;
    });
  }, [risks, sortField, sortDirection]);

  const totalItems = sortedRisks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRisks = sortedRisks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Retention Rate
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-lg">
              <Sparkles size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.retentionRate}%
          </h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Target benchmark met
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Attrition Risk
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-lg">
              <UserMinus size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.attritionRisk}%
          </h4>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">
            Forecasted for Q3
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              High Risk Staff
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-lg">
              <UserMinus size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {metrics.highRiskCount}
          </h4>
          <p className="text-[9px] font-bold text-amber-500 uppercase mt-2">
            Requires mitigation action
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Stability Index
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-lg">
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
        <div className="lg:col-span-2 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
              <UserMinus size={20} className="text-rose-500" /> Retention Risk & Action Registry
            </h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
              <Table hoverable className="border-none w-full relative">
                <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400 select-none">
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Staff Member</span>
                      {sortField === "name" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("tenure")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Tenure</span>
                      {sortField === "tenure" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("risk")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Risk Index</span>
                      {sortField === "risk" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    className="py-4 px-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("satisfaction")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Satisfaction Score</span>
                      {sortField === "satisfaction" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-300" />}
                    </div>
                  </TableHeadCell>
                  <TableHeadCell className="py-4 px-6 text-right">
                    Mitigation Action
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {totalItems === 0 ? (
                    <TableRow className="bg-white dark:bg-gray-800">
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                      >
                        No retention risks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRisks.map((risk, idx) => (
                      <TableRow
                        key={risk.id || idx}
                        className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell className="font-black dark:text-white text-xs py-4 px-6">
                          <div>
                            <p className="leading-none uppercase tracking-tight">
                              {risk.name}
                            </p>
                            <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">
                              {risk.role}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 py-4 px-6 font-mono">
                          {risk.tenure}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            color={getRiskBadgeColor(risk.risk)}
                            className="w-fit px-3 rounded-md text-[9px] font-black uppercase tracking-widest"
                          >
                            {risk.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
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
                        <TableCell className="text-right py-4 px-6">
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
                              className="rounded-md shadow-sm font-black uppercase tracking-widest text-[9px] cursor-pointer"
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

        {/* Retention advice card */}
        <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Heart size={20} className="text-indigo-600" /> Retention Advice Engine
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
                . We detected {metrics.highRiskCount} team members exhibiting potential attrition risk due to career trajectory plateaus.
              </p>
              <p>
                ⚡ **Recommendation**: Plan automatic **Career Growth Progression Reviews** for seniors approaching the 3+ year mark to ensure continuous skill alignment and node retention.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              color="indigo"
              onClick={() => toast.success("Retention Action Plan Executed")}
              className="w-full font-black uppercase tracking-widest text-xs rounded-xl h-11 cursor-pointer"
            >
              Execute Retention Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionModule;
