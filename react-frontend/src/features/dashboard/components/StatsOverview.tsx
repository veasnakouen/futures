import React from "react";
import { Users, TrendingUp, Package, FileBarChart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useNavigate } from "@/lib/react-router-compat";

interface StatsOverviewProps {
  stats: any;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const navigate = useNavigate();
  // Fetch real inventory asset count from stock service
  const { data: inventoryData } = useQuery({
    queryKey: ["dashboard-inventory-count"],
    queryFn: () =>
      api
        .get("/stock/inventory", { params: { page: 0, size: 1 } })
        .then((res) => res.data),
    // Silently fail — we'll fall back to stats.totalInventoryAssets or the backend value
    retry: 1,
    staleTime: 60_000,
  });

  // Prefer the count from paginated metadata, then backend stats field, then 0
  const inventoryCount =
    inventoryData?.totalElements ??
    inventoryData?.page?.totalElements ??
    stats?.totalInventoryAssets ??
    0;

  const items = [
    {
      label: "Total Clients",
      value: stats?.totalClients,
      icon: <Users size={22} />,
      link: "/clients",
      colorClass:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500",
      borderClass: "hover:border-indigo-500/30 dark:hover:border-indigo-400/30",
      glowClass: "from-indigo-50/10",
    },
    {
      label: "Active Placements",
      value: stats?.activePlacements,
      icon: <TrendingUp size={22} />,
      link: "/placements",
      colorClass:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500",
      borderClass:
        "hover:border-emerald-500/30 dark:hover:border-emerald-400/30",
      glowClass: "from-emerald-50/10",
    },
    {
      label: "Inventory Assets",
      value: inventoryCount > 0 ? inventoryCount : (stats?.totalInventoryAssets ?? "—"),
      icon: <Package size={22} />,
      link: "/inventory",
      colorClass:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500",
      borderClass: "hover:border-amber-500/30 dark:hover:border-amber-400/30",
      glowClass: "from-amber-50/10",
    },
    {
      label: "Monthly Reports",
      value: stats?.monthlyReports,
      icon: <FileBarChart size={22} />,
      link: "/reports",
      colorClass:
        "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-500",
      borderClass: "hover:border-violet-500/30 dark:hover:border-violet-400/30",
      glowClass: "from-violet-50/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <ScrollReveal
          key={idx}
          animation="fade-in-up"
          delay={idx * 100}
          duration={600}
          triggerOnce={true}
        >
          <div
            onClick={() => item.link && navigate(item.link)}
            className={`relative overflow-hidden bg-white dark:bg-gray-800/40 dark:backdrop-blur-md  rounded-md p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer group ${item.borderClass}`}
          >
            {/* Hover subtle glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${item.glowClass} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            />

            <div className="flex items-center gap-6 relative z-10">
              <div
                className={`p-4 rounded-md transition-all duration-300 ease-out shadow-sm group-hover:shadow-md group-hover:scale-105 ${item.colorClass}`}
              >
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">
                  {item.label}
                </p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums leading-none tracking-tight">
                  {item.value ?? 0}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
                  <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Live Data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default StatsOverview;
