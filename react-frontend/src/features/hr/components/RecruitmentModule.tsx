import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { Button } from '@/lib/flowbite-compat';
import { Zap, Users, Briefcase, TrendingUp, CheckCircle, UserCheck } from "lucide-react";
import JobWorkspace from "./JobWorkspace";
import GlobalATSBoard from "./GlobalATSBoard";
import SearchInput from "@/components/common/SearchInput";
import AlumniJobTipModal from "./AlumniJobTipModal";
import PlacementModal from "./PlacementModal";
import RecruitmentDashboard from "./RecruitmentDashboard";
import RecruitmentVacanciesTab from "./RecruitmentVacanciesTab";
import RecruitmentCandidatesTab from "./RecruitmentCandidatesTab";
import RecruitmentPlacementsTab from "./RecruitmentPlacementsTab";

interface RecruitmentModuleProps {
  vacancies: any[];
  stats: any;
  candidates: any[];
  employers?: any[];
  positions?: any[];
  placements: any[];
  hideModuleHeaderTabs?: boolean;
  onAddVacancy: (data: any) => Promise<void>;
  onUpdateVacancy: (id: number, data: any) => Promise<void>;
  onDeleteVacancy: (id: number) => Promise<void>;
  onAddCandidate?: (data: any) => Promise<void>;
  onUpdateCandidate?: (id: number, data: any) => Promise<void>;
  onDeleteCandidate: (id: number) => Promise<void>;
  onPlaceCandidate: (data: any) => Promise<void>;
}

const RecruitmentModule: React.FC<RecruitmentModuleProps> = ({
  vacancies,
  stats,
  candidates,
  placements,
  onAddVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
  onDeleteCandidate,
  onPlaceCandidate,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "VACANCIES" | "CANDIDATES" | "PLACEMENTS" | "APPLICATIONS">("DASHBOARD");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [selectedCandidateForPlacement, setSelectedCandidateForPlacement] = useState<any>(null);
  const [isJobTipModalOpen, setIsJobTipModalOpen] = useState(false);

  const safeVacancies = Array.isArray(vacancies) ? vacancies : [];
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const safePlacements = Array.isArray(placements) ? placements : [];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];
  const vacancyStatusRaw = safeVacancies.reduce((acc: any, v: any) => {
    const s = v.status || "Unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const vacancyStatusData = Object.keys(vacancyStatusRaw).map((key) => ({ name: key, value: vacancyStatusRaw[key] }));

  if (selectedVacancy) {
    return <JobWorkspace vacancy={selectedVacancy} candidates={safeCandidates} onClose={() => setSelectedVacancy(null)} />;
  }

  const navTabs = [
    { id: "DASHBOARD", label: t("dashboard"), icon: <TrendingUp size={13} /> },
    { id: "APPLICATIONS", label: "ATS Board", icon: <CheckCircle size={13} /> },
    { id: "VACANCIES", label: t("vacancies"), icon: <Briefcase size={13} /> },
    { id: "CANDIDATES", label: t("talentPool"), icon: <Users size={13} /> },
    { id: "PLACEMENTS", label: t("placementAudit"), icon: <UserCheck size={13} /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 xl:pb-0 shrink-0">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm scale-[1.02]"
                  : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200/60 dark:border-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <SearchInput placeholder="Search talent, jobs..." value={searchQuery} onChange={setSearchQuery} containerClassName="pl-9 rounded-lg text-xs font-semibold" />
          <Button color="emerald" onClick={() => setIsJobTipModalOpen(true)} className="rounded-lg px-3 py-1.5 text-xs font-black shadow-sm flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
            <Zap size={14} /> <span>+ Alumni Job Tip</span>
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "APPLICATIONS" && <GlobalATSBoard />}
        {activeTab === "DASHBOARD" && (
          <RecruitmentDashboard vacanciesCount={safeVacancies.length} candidatesCount={safeCandidates.length} totalPlacements={stats?.totalPlacements || 0} trendData={stats?.placementTrend || []} vacancyStatusData={vacancyStatusData} COLORS={COLORS} />
        )}
        {activeTab === "VACANCIES" && (
          <RecruitmentVacanciesTab vacancies={safeVacancies} searchQuery={searchQuery} onSelectVacancy={(v) => setSelectedVacancy(v)} onEditVacancy={(v) => onUpdateVacancy(v.id, v)} onDeleteVacancy={onDeleteVacancy} />
        )}
        {activeTab === "CANDIDATES" && (
          <RecruitmentCandidatesTab candidates={safeCandidates} searchQuery={searchQuery} onDeleteCandidate={onDeleteCandidate} />
        )}
        {activeTab === "PLACEMENTS" && (
          <RecruitmentPlacementsTab placements={safePlacements} searchQuery={searchQuery} />
        )}
      </AnimatePresence>

      <PlacementModal show={isPlacementModalOpen} onClose={() => setIsPlacementModalOpen(false)} candidate={selectedCandidateForPlacement} onPlaceCandidate={onPlaceCandidate} />
      <AlumniJobTipModal show={isJobTipModalOpen} onClose={() => setIsJobTipModalOpen(false)} candidates={safeCandidates} onAddVacancy={onAddVacancy} />
    </div>
  );
};

export default RecruitmentModule;
