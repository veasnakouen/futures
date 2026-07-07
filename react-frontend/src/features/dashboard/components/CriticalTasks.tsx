import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const CriticalTasks: React.FC = () => {
  const tasks = [
    {
      task: "Annual Reporting Cycle",
      status: "In Progress",
      color: "info",
      urgency: "High",
    },
    {
      task: "Database Synchronization",
      status: "Healthy",
      color: "success",
      urgency: "Normal",
    },
    {
      task: "System Backup Policy",
      status: "Verified",
      color: "success",
      urgency: "Critical",
    },
    {
      task: "New Security Patch",
      status: "Pending",
      color: "warning",
      urgency: "High",
    },
  ];

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

    return <span className={classes}>{status}</span>;
  };

  const getIcon = (status: string, color: string) => {
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
              <Calendar size={20} />
            </div>
            Critical Operations
          </h4>
          <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline transition-all">
            View All Tasks
          </button>
        </div>

        <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {tasks.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-md /50 hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/10 dark:hover:bg-purple-950/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-md bg-white dark:bg-gray-800 shadow-sm /50 group-hover:scale-105 transition-transform duration-200">
                  {getIcon(item.status, item.color)}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-250">
                    {item.task}
                  </span>
                  <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5 block">
                    Priority: {item.urgency}
                  </span>
                </div>
              </div>
              {getStatusBadge(item.status, item.color)}
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CriticalTasks;
