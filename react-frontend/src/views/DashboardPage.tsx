import { useState, useEffect } from "react";
import {Spinner} from '@/lib/flowbite-compat';
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
          <div className="bg-white dark:bg-gray-800/40 dark:backdrop-blur-md px-8 py-5 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-0.5">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {getGreeting()}, {currentUser?.username || "Guest"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                Logged in as{" "}
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                  {userRole}
                </span>{" "}
                • Real-time operational visibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="flex items-center gap-2.5 bg-gray-50/50 dark:bg-gray-900/30 px-3.5 py-1.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-md bg-blue-500 animate-pulse"></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  System Impact: {stats?.totalClients?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50/50 dark:bg-gray-900/30 px-3.5 py-1.5 rounded-md">
                <span
                  className={`w-1.5 h-1.5 rounded-md ${connectionStatus ==="online"?"bg-emerald-500 animate-pulse":"bg-rose-500"}`}
                ></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-505">
                  {connectionStatus === "online"
                    ? `Gateway Connection: ${latency !== null ? `${latency}ms` : "Checking..."}`
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
          <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 border-blue-500/20 dark:border-blue-400/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles
                  className="text-blue-600 dark:text-blue-400"
                  size={18}
                />
                <h4 className="font-black text-sm uppercase tracking-wider dark:text-white">
                  Sandbox Mode Active
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
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
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-md shadow-lg shadow-blue-500/20 transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              Start Guided Tour
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
                icon: <Users size={20} />,
                color:
                  "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-500/10",
              },
              {
                label: "Post Vacancy",
                to: "/vacancies",
                icon: <Briefcase size={20} />,
                color:
                  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-500/10",
              },
              {
                label: "Create Support Ticket",
                to: "/support",
                icon: <LifeBuoy size={20} />,
                color:
                  "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-600 dark:hover:bg-amber-500 shadow-amber-500/10",
              },
              {
                label: "Live Team Chat",
                to: "/chat",
                icon: <MessageCircle size={20} />,
                color:
                  "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-500/10",
              },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.to}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800/40 dark:backdrop-blur-md rounded-md shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`p-3 rounded-md transition-colors ${action.color} group-hover:text-white`}
                >
                  {action.icon}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wider">
                    {action.label}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    Navigate Module
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
