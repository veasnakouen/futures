import React from "react";
import { Button } from "@/lib/flowbite-compat";
import {
  Activity,
  TrendingUp,
  Zap,
  UserPlus,
  Users,
  Clock,
  Calendar,
  CalendarCheck,
  DollarSign,
  Server,
  Building2,
  Award,
  ShieldCheck,
  Settings,
  FileText,
} from "lucide-react";

interface Props {
  state: any;
}

export default function EmployeesPageHeader({ state }: Props) {
  const {
    t,
    activeModule,
    setActiveModule,
    setIsAnalyticsModalOpen,
    openImportModal,
    handleOpenAddModal,
  } = state;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-blue-600 text-white rounded-md shadow-xl shadow-blue-500/20">
            <Activity size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black dark:text-white tracking-tight">
              {t("hrCommandCenter")}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-md bg-emerald-500 animate-pulse"></span>
              Node Active: Operational Compliance 98%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="light"
            onClick={() => setIsAnalyticsModalOpen(true)}
            className="rounded-md border-2 px-4 h-12 font-black uppercase tracking-widest text-[10px]"
          >
            <TrendingUp size={16} className="mr-2 text-blue-600" /> {t("analytics")}
          </Button>
          <Button
            color="light"
            onClick={openImportModal}
            className="rounded-md border-2 px-4 h-12 font-black uppercase tracking-widest text-[10px]"
          >
            <UserPlus size={16} className="mr-2 text-indigo-600" /> Import User
          </Button>
          {activeModule === "directory" && (
            <Button
              color="blue"
              onClick={handleOpenAddModal}
              className="rounded-md h-12 font-black uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-blue-500/20"
            >
              <UserPlus size={18} className="mr-2" /> {t("onboardStaff")}
            </Button>
          )}
        </div>
      </header>

      <nav className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-2 rounded-2xl overflow-x-auto custom-scrollbar animate-slide-up shadow-sm gap-1.5 w-full">
        {[
          { id: "directory", label: t("workforce"), icon: <Users size={16} /> },
          { id: "attendance", label: t("attendance"), icon: <Clock size={16} /> },
          { id: "leaves", label: t("leaves"), icon: <Calendar size={16} /> },
          { id: "timeoff", label: t("timeOff"), icon: <CalendarCheck size={16} /> },
          { id: "analytics", label: t("intelligence"), icon: <TrendingUp size={16} /> },
          { id: "payroll", label: t("payroll"), icon: <DollarSign size={16} /> },
          { id: "assets", label: t("assets"), icon: <Server size={16} /> },
          { id: "structure", label: t("structure"), icon: <Building2 size={16} /> },
          { id: "training", label: t("lms"), icon: <Award size={16} /> },
          { id: "compliance", label: t("compliance"), icon: <ShieldCheck size={16} /> },
          { id: "portal", label: t("myPortal"), icon: <Activity size={16} /> },
          { id: "manager", label: t("managerHub"), icon: <CalendarCheck size={16} /> },
          { id: "scheduling", label: t("scheduling"), icon: <Activity size={16} /> },
          { id: "retention", label: t("retention"), icon: <TrendingUp size={16} /> },
          { id: "succession", label: t("succession"), icon: <Award size={16} /> },
          { id: "wellness", label: t("wellness"), icon: <Activity size={16} /> },
          { id: "automation", label: t("aiFlows"), icon: <Zap size={16} /> },
          { id: "engagement", label: t("culture"), icon: <Award size={16} /> },
          { id: "integrations", label: t("integrations"), icon: <Settings size={16} /> },
          { id: "support", label: t("ticketsSystem"), icon: <ShieldCheck size={16} /> },
          { id: "reports", label: t("reports"), icon: <FileText size={16} /> },
        ].map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-700 shadow-sm z-10"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-0"
              }`}
            >
              {item.icon} {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
