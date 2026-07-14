import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  LifeBuoy,
  ExternalLink,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useNavigate } from "@/lib/react-router-compat";

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

const getPriorityUrgency = (priority: string): string => {
  const p = (priority || "").toLowerCase();
  if (p === "critical" || p === "urgent") return "Critical";
  if (p === "high") return "High";
  if (p === "low") return "Normal";
  return "Normal";
};

const getColorFromStatus = (status: string): string => {
  const s = (status || "").toLowerCase();
  if (s === "resolved" || s === "closed") return "success";
  if (s === "open" || s === "in_progress" || s === "in progress") return "info";
  if (s === "pending" || s === "on_hold") return "warning";
  return "info";
};

const CriticalTasks: React.FC = () => {
  const navigate = useNavigate();

  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ["dashboard-tickets"],
    queryFn: () => api.get("/tickets").then((res) => res.data),
    select: (data: any) => {
      // Support both paginated { content: [] } and plain array responses
      const arr: Ticket[] = Array.isArray(data) ? data : data?.content ?? [];
      // Sort by most recent first, show top 5
      return [...arr]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);
    },
    retry: 1,
    staleTime: 30_000,
  });

  const getStatusBadge = (status: string, color: string) => {
    let classes =
      "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md border ";

    switch (color) {
      case "success":
        classes +=
          "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
        break;
      case "warning":
        classes +=
          "bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
        break;
      case "info":
      default:
        classes +=
          "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
        break;
    }

    return <span className={classes}>{status?.replace(/_/g, " ")}</span>;
  };

  const getIcon = (color: string) => {
    switch (color) {
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "info":
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <HelpCircle size={16} className="text-gray-400" />;
    }
  };

  // Skeleton loader rows
  const SkeletonRow = () => (
    <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-md animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-1.5">
          <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
    </div>
  );

  return (
    <ScrollReveal
      className="h-full"
      animation="fade-in-up"
      delay={300}
      duration={600}
      triggerOnce={true}
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-800/40 dark:backdrop-blur-md p-8 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-md shadow-sm">
              <LifeBuoy size={20} />
            </div>
            Support Tickets
          </h4>
          <button
            onClick={() => navigate("/support")}
            className="flex items-center gap-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline transition-all"
          >
            View All <ExternalLink size={11} />
          </button>
        </div>

        <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : tickets && tickets.length > 0 ? (
            tickets.map((ticket) => {
              const color = getColorFromStatus(ticket.status);
              const urgency = getPriorityUrgency(ticket.priority);
              return (
                <div
                  key={ticket.id}
                  onClick={() => navigate("/support")}
                  className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-md hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/10 dark:hover:bg-purple-950/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2.5 rounded-md bg-white dark:bg-gray-800 shadow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                      {getIcon(color)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-250 truncate">
                        {ticket.title || `Ticket #${ticket.id}`}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5 block">
                        Priority: {urgency}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(ticket.status, color)}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600 gap-2">
              <LifeBuoy size={32} className="opacity-30" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                No tickets found
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CriticalTasks;
