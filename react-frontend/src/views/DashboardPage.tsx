import { useState, useEffect } from "react";
import { Spinner } from '@/lib/flowbite-compat';
import {
  Shield,
  Sparkles,
  Activity,
  Briefcase,
  LifeBuoy,
  MessageCircle,
  Users,
} from "lucide-react";

import api from "../services/api";
import { useTranslation } from "react-i18next";
import authService from "../services/authService";
import { toast } from "react-hot-toast";

// Modular Components
import StatsOverview from "@/features/dashboard/components/StatsOverview";
import TrendChart from "@/features/dashboard/components/TrendChart";
import StatusDistribution from "@/features/dashboard/components/StatusDistribution";
import MiniMap from "@/features/dashboard/components/MiniMap";
import CriticalTasks from "@/features/dashboard/components/CriticalTasks";
import ScrollReveal from "@/features/dashboard/components/ScrollReveal";
import ProductCarousel from "@/features/dashboard/components/ProductCarousel";
import { useNotifications } from "../contexts/NotificationContext";

const DashboardPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const { notifications } = useNotifications();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Latency & Connection Status Monitor
  const [latency, setLatency] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline"
  >("online");

  const currentUser = authService.getCurrentUser();
  const userRole =
    Array.isArray(currentUser?.roles) &&
      currentUser.roles.some((r: any) =>
        (typeof r === "string" ? r : r?.name || "")
          .toUpperCase()
          .includes("SUPERADMIN"),
      )
      ? "Super Admin"
      : Array.isArray(currentUser?.roles) &&
        currentUser.roles.some((r: any) =>
          (typeof r === "string" ? r : r?.name || "")
            .toUpperCase()
            .includes("ADMIN"),
        )
        ? "Administrator"
        : "Standard User";

  useEffect(() => {
    // Fetch core stats
    api
      .get("/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Dashboard data load error:", err);
        const msg =
          err.response?.data?.message || err.message || "Unknown error";
        const status = err.response?.status
          ? ` (Status: ${err.response.status})`
          : "";
        setError(`Failed to load dashboard data: ${msg}${status}`);
      })
      .finally(() => setLoading(false));

    // Dynamic latency check
    const checkLatency = async () => {
      const startTime = performance.now();
      try {
        await api.get("/dashboard/stats");
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));
        setConnectionStatus("online");
      } catch (err) {
        setConnectionStatus("offline");
        setLatency(null);
      }
    };

    checkLatency();
    const interval = setInterval(checkLatency, 15000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-400 dark:text-gray-500 animate-pulse font-black uppercase text-[10px] tracking-widest">
              Analyzing system metrics...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
        {error && (
          <ScrollReveal animation="fade-in" duration={400}>
            <div className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-6 rounded-md shadow-sm">
              <p className="text-red-600 dark:text-red-400 font-black uppercase text-xs flex items-center gap-3">
                <Shield size={20} /> {error}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* User Greeting & Gateway Latency status top bar */}
        <ScrollReveal
          animation="fade-in-up"
          delay={0}
          duration={600}
          triggerOnce={true}
        >
          <div className="relative overflow-hidden bg-white dark:bg-[#0d1117] px-7 py-5 rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm dark:shadow-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Decorative gradient orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-violet-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-0.5 relative">
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {getGreeting()},{" "}
                <span className="gradient-text">{currentUser?.username || "Guest"}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/40 font-medium">
                Logged in as{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {userRole}
                </span>{" "}
                &middot; Real-time operational visibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0 relative">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-gray-200/60 dark:border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40">
                  Impact: {stats?.totalClients?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-gray-200/60 dark:border-white/[0.06]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "online" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40">
                  {connectionStatus === "online"
                    ? `Gateway: ${latency !== null ? `${latency}ms` : "—"}`
                    : "Gateway Offline"}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Inventory Showcase Showcase */}
        <ProductCarousel />

        {/* Sandbox Mode / Guide Banner */}
        <ScrollReveal
          animation="fade-in-up"
          delay={50}
          duration={600}
          triggerOnce={true}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/[0.07] via-violet-500/[0.04] to-fuchsia-500/[0.07] dark:from-indigo-500/10 dark:via-violet-500/5 dark:to-fuchsia-500/10 border border-indigo-200/40 dark:border-indigo-500/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-violet-100/20 dark:to-violet-900/10 pointer-events-none" />
            <div className="space-y-1 relative">
              <div className="flex items-center gap-2">
                <Sparkles
                  className="text-indigo-500 dark:text-indigo-400"
                  size={16}
                />
                <h4 className="font-extrabold text-[11px] uppercase tracking-[0.15em] text-gray-800 dark:text-white">
                  Sandbox Mode Active
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-white/50 font-medium leading-relaxed max-w-lg">
                Welcome to the MTP demonstration database. Feel free to add mock
                clients, trigger biometric logs, run payroll simulations, or
                post job vacancies to test all system features.
              </p>
            </div>
            <button
              onClick={() =>
                toast.success(
                  "Guided walkthrough activated! Click on the sidebar modules to explore.",
                  { icon: "🎯" },
                )
              }
              className="relative overflow-hidden text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all shrink-0 hover:-translate-y-px active:translate-y-0 group"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Start Guided Tour</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Quick Actions Console */}
        <ScrollReveal
          animation="fade-in-up"
          delay={100}
          duration={600}
          triggerOnce={true}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Register Candidate",
                to: "/clients",
                icon: <Users size={18} />,
                gradient: "from-indigo-500 to-indigo-600",
                glow: "shadow-indigo-500/20",
                bg: "bg-indigo-50 dark:bg-indigo-500/10",
                text: "text-indigo-600 dark:text-indigo-400",
              },
              {
                label: "Post Vacancy",
                to: "/vacancies",
                icon: <Briefcase size={18} />,
                gradient: "from-emerald-500 to-teal-500",
                glow: "shadow-emerald-500/20",
                bg: "bg-emerald-50 dark:bg-emerald-500/10",
                text: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Support Ticket",
                to: "/support",
                icon: <LifeBuoy size={18} />,
                gradient: "from-amber-500 to-orange-500",
                glow: "shadow-amber-500/20",
                bg: "bg-amber-50 dark:bg-amber-500/10",
                text: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Live Team Chat",
                to: "/chat",
                icon: <MessageCircle size={18} />,
                gradient: "from-sky-500 to-blue-600",
                glow: "shadow-sky-500/20",
                bg: "bg-sky-50 dark:bg-sky-500/10",
                text: "text-sky-600 dark:text-sky-400",
              },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.to}
                className="group flex items-center gap-3.5 p-4 bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${action.bg} ${action.text} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  {action.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className={`text-[11px] font-bold ${action.text} uppercase tracking-wider leading-none group-hover:opacity-80 transition-opacity truncate`}>
                    {action.label}
                  </p>
                  <p className="text-[9px] font-semibold text-gray-400 dark:text-white/25 uppercase tracking-tighter">
                    Navigate
                  </p>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* Modular Sections */}
        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-full">
            <TrendChart data={stats?.vacancyStatusDistribution || []} />
          </div>
          <div className="h-full">
            <StatusDistribution
              data={stats?.statusDistribution || []}
              total={stats?.totalClients || 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MiniMap isDark={isDark} />
          <CriticalTasks />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
