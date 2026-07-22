import React, { useState, useEffect, useMemo } from "react";
import { Award, Activity, Zap, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button, Avatar, Badge, Spinner } from '@/lib/flowbite-compat';
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import api from '@/services/api';
import ModernPagination from "@/components/common/ModernPagination";

const mockDefaultRecognitions = [
  {
    id: 1,
    receiverName: "MICHAEL JORDAN",
    badgeType: "TRAILBLAZER",
    senderName: "ADMIN",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    message: "Exceptional Leadership during Q1 systems migration.",
  },
  {
    id: 2,
    receiverName: "MICHAEL JORDAN",
    badgeType: "TRAILBLAZER",
    senderName: "ADMIN",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    message: "Exceptional Leadership during Q1 systems migration.",
  },
  {
    id: 3,
    receiverName: "SARAH JENKINS",
    badgeType: "CULTURE HERO",
    senderName: "HR",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    message: "Outstanding commitment to employee wellness initiatives.",
  },
  {
    id: 4,
    receiverName: "ALEXANDER WONG",
    badgeType: "INNOVATOR",
    senderName: "CTO",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    message: "Architected resilient real-time microservices communication layer.",
  },
  {
    id: 5,
    receiverName: "EMILY DAVIS",
    badgeType: "TEAM PLAYER",
    senderName: "DEVOPS LEAD",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    message: "Consistently jumping in to unblock cross-functional sprint goals.",
  },
];

const mockDefaultMetrics = {
  sentimentScore: 4.8,
  sentimentMax: 5.0,
  moralePersistence: "HIGH (92%)",
  moralePercentage: 92,
  chartData: [
    { month: "Jan", score: 4.2 },
    { month: "Feb", score: 4.5 },
    { month: "Mar", score: 4.6 },
    { month: "Apr", score: 4.8 },
  ],
  wellnessTrack: [
    { label: "Mindfulness Workshops", active: 24 },
    { label: "Fitness Challenge Q3", active: 42 },
    { label: "Ergonomic Workstation Support", active: 18 },
  ],
};

const EngagementModule: React.FC = () => {
  const [recognitions, setRecognitions] = useState<any[]>(mockDefaultRecognitions);
  const [metrics, setMetrics] = useState<any>(mockDefaultMetrics);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchCultureData();
  }, []);

  const fetchCultureData = async () => {
    try {
      setLoading(true);
      const [recRes, metRes] = await Promise.all([
        api.get("/hr/culture/recognitions"),
        api.get("/hr/culture/metrics"),
      ]);

      if (recRes.data && Array.isArray(recRes.data) && recRes.data.length > 0) {
        setRecognitions(recRes.data);
      }
      if (metRes.data && Object.keys(metRes.data).length > 0) {
        setMetrics(metRes.data);
      }
    } catch (err) {
      console.warn("Using local failover for Engagement data:", err);
    } finally {
      setLoading(false);
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

  const filteredRecognitions = useMemo(() => {
    return recognitions.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        (r.receiverName || "").toLowerCase().includes(q) ||
        (r.senderName || "").toLowerCase().includes(q) ||
        (r.badgeType || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q)
      );
    });
  }, [recognitions, searchQuery]);

  const sortedRecognitions = useMemo(() => {
    return [...filteredRecognitions].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";
      if (sortField === "receiverName") {
        aVal = a.receiverName || "";
        bVal = b.receiverName || "";
      } else if (sortField === "badgeType") {
        aVal = a.badgeType || "";
        bVal = b.badgeType || "";
      } else if (sortField === "createdAt") {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const res = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? res : -res;
    });
  }, [filteredRecognitions, sortField, sortDirection]);

  const totalItems = sortedRecognitions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRecognitions = sortedRecognitions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Culture Indices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">
            Engagement & Culture Hub
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Nurturing Human Capital & Organizational Spirit
          </p>
        </div>
        <Button
          color="blue"
          onClick={() =>
            toast.success("Recognition form opened", { icon: "🏆" })
          }
          className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Award size={18} className="mr-2" /> Post Recognition
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wall of Recognition */}
        <div className="lg:col-span-2 p-8 rounded-2xl dark:bg-gray-800 bg-white/50 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h4 className="font-black text-xl dark:text-white flex items-center gap-2 uppercase tracking-tight">
                <Award className="text-blue-600" /> Wall of Recognition
              </h4>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search recognitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  title="Sort by Date"
                >
                  <span>Sort</span>
                  {sortField === "createdAt" ? (sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />) : <ArrowUpDown size={12} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="space-y-4 min-h-[300px]">
              {totalItems === 0 ? (
                <div className="py-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No recognition posts match your search criteria.
                </div>
              ) : (
                paginatedRecognitions.map((rec, i) => (
                  <div
                    key={rec.id || i}
                    className="p-6 bg-gray-50/80 dark:bg-gray-700/50 rounded-2xl flex gap-5 items-start border border-gray-100 dark:border-gray-700 hover:border-blue-600/30 transition-all shadow-sm group"
                  >
                    <Avatar rounded size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black dark:text-white uppercase tracking-tight leading-none text-sm">
                            {rec.receiverName}
                          </p>
                          <Badge
                            color="purple"
                            className="w-fit rounded-md mt-2 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5"
                          >
                            {rec.badgeType}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">
                            From: {rec.senderName}
                          </p>
                          <p className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 font-mono">
                            {rec.createdAt
                              ? formatDistanceToNow(new Date(rec.createdAt), {
                                  addSuffix: true,
                                })
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic mt-3">
                        "{rec.message}"
                      </p>
                    </div>
                  </div>
                ))
              )}
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

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="p-8 rounded-2xl border-none shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden h-[380px] flex flex-col justify-between">
            <Activity
              size={100}
              className="absolute -right-6 -bottom-6 opacity-10 rotate-12"
            />
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 opacity-80">
                Engagement Sentiment Score
              </h4>
              <div className="flex items-end gap-2 mb-6">
                <h3 className="text-5xl font-black tracking-tighter">
                  {metrics.sentimentScore}
                </h3>
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">
                  / {metrics.sentimentMax} Global Pulse
                </p>
              </div>

              <div className="h-28 mb-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <LineChart data={metrics.chartData || []}>
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#fff"
                      strokeWidth={4}
                      dot={{ r: 5, fill: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#4f46e5" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.95)",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "10px",
                        color: "#4f46e5",
                        fontWeight: 900,
                      }}
                      cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase">
                <span className="opacity-80">Team Morale Persistence</span>
                <span>{metrics.moralePersistence}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-md overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                  style={{ width: `${metrics.moralePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
            <h4 className="font-black text-lg dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
              <Zap className="text-amber-500" /> Wellness Track
            </h4>
            <div className="space-y-4">
              {(metrics.wellnessTrack || []).map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-transparent hover:border-amber-500/30 transition-colors"
                >
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                    {item.active} Participants
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementModule;
