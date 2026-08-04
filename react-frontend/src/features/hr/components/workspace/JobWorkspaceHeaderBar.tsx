import React from "react";
import { Badge } from "@/lib/flowbite-compat";
import { ArrowLeft, MapPin, DollarSign, Clock, Calendar, Briefcase, FileText, CheckCircle } from "lucide-react";
import ModernTabs from "@/components/common/ModernTabs";
import { format } from "date-fns";

interface Props {
  vacancy: any;
  onClose: () => void;
  state: any;
}

export default function JobWorkspaceHeaderBar({ vacancy, onClose, state }: Props) {
  const { activeTab, setActiveTab } = state;

  return (
    <div className="space-y-6">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Hub
      </button>

      {/* Job Header Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                color={vacancy.status === "Open" ? "success" : "failure"}
                className="font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-md"
              >
                {vacancy.status}
              </Badge>
              <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
                Job ID: {vacancy.id}
              </span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-2">
              {vacancy.jobPositionName || "Standard Role"}
            </h2>
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight flex items-center gap-2">
              <Briefcase size={16} /> {vacancy.employerName || "Confidential Employer"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-rose-500" /> {vacancy.location || "Remote/Any"}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-500" /> {vacancy.salary || 0}{" "}
              {vacancy.salarymax ? `- ${vacancy.salarymax}` : ""}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> {vacancy.schedule || "Standard Hours"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" /> Closing:{" "}
              {vacancy.closingDate ? format(new Date(vacancy.closingDate), "MMM dd, yyyy") : "TBD"}
            </div>
          </div>
        </div>
      </div>

      <ModernTabs
        tabs={[
          {
            id: "DETAILS",
            label: "Job Description",
            icon: <FileText size={14} />,
          },
          {
            id: "PIPELINE",
            label: "ATS Pipeline",
            icon: <CheckCircle size={14} />,
          },
          {
            id: "MATCH_TALENT",
            label: "Match Talent",
            icon: <Briefcase size={14} />,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
      />
    </div>
  );
}
