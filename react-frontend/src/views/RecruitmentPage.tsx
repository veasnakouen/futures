import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Activity, Briefcase, Building2, User, Handshake } from "lucide-react";

// Import the modularized pages
import ClientsPage from "./ClientsPage";
import EmployersPage from "./EmployersPage";
import VacanciesPage from "./VacanciesPage";
import PlacementsPage from "./PlacementsPage";
import ModernTabs from "@/components/common/ModernTabs";

// New HR Recruitment ATS Pipeline Module
import RecruitmentModule from "@/features/hr/components/recruitment/RecruitmentModule";
import { 
  useVacancies, 
  useRecruitmentStats, 
  useLookups, 
  useEmployers, 
  usePlacements,
  useCreateVacancy,
  useUpdateVacancy,
  useDeleteVacancy,
  useCreateCandidate,
  useUpdateCandidate,
  useDeleteCandidate,
  useCreatePlacement
} from "../hooks/useHR";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

const RecruitmentPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("ats-pipeline");

  // State for HR Store (ATS Pipeline)
  const { data: globalVacancies = [], refetch: refetchVacancies } = useVacancies();
  const { data: recruitmentStats = {}, refetch: refetchStats } = useRecruitmentStats();
  const { data: globalClients = [], refetch: refetchClients } = useLookups("clients");
  const { data: globalEmployers = [], refetch: refetchEmployers } = useEmployers();
  const { data: globalPositions = [] } = useLookups("positions");
  const { data: globalPlacements = [], refetch: refetchPlacements } = usePlacements();

  const fetchGlobalData = () => {
    refetchVacancies();
    refetchStats();
    refetchClients();
    refetchEmployers();
    refetchPlacements();
  };

  const [loading, setLoading] = useState(false);

  // To remember the active tab in case they navigate away and come back
  useEffect(() => {
    const savedTab = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("recruitmentActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("recruitmentActiveTab", tab);
  };

  const tabs = [
    { id: "ats-pipeline", label: t("atsPipeline"), icon: <Activity size={18} /> },
    { id: "clients", label: t("candidatesList"), icon: <User size={18} /> },
    { id: "employers", label: t("employers"), icon: <Building2 size={18} /> },
    { id: "vacancies", label: t("vacanciesList"), icon: <Briefcase size={18} /> },
    {
      id: "placements",
      label: t("placementsList"),
      icon: <Handshake size={18} />,
    },
  ];

  const { mutateAsync: createVacancy } = useCreateVacancy();
  const { mutateAsync: updateVacancy } = useUpdateVacancy();
  const { mutateAsync: deleteVacancy } = useDeleteVacancy();
  const { mutateAsync: createCandidate } = useCreateCandidate();
  const { mutateAsync: updateCandidate } = useUpdateCandidate();
  const { mutateAsync: deleteCandidate } = useDeleteCandidate();
  const { mutateAsync: createPlacement } = useCreatePlacement();

  // Handlers for ATS Pipeline
  const handleCreateVacancy = async (data: any) => {
    try {
      setLoading(true);
      await createVacancy(data);
      toast.success("New vacancy published");
    } catch (err: any) {
      toast.error("Failed to publish vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVacancy = async (id: number, data: any) => {
    try {
      setLoading(true);
      await updateVacancy({ id, data });
      toast.success("Vacancy updated");
    } catch (err: any) {
      toast.error("Failed to update vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacancy = async (id: number) => {
    if (!window.confirm("Delete this vacancy posting?")) return;
    try {
      setLoading(true);
      await deleteVacancy(id);
      toast.success("Vacancy removed");
    } catch (err: any) {
      toast.error("Failed to remove vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async (data: any) => {
    try {
      setLoading(true);
      await createCandidate(data);
      toast.success("Candidate enrolled");
    } catch (err: any) {
      toast.error("Failed to enroll candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = async (id: number, data: any) => {
    try {
      setLoading(true);
      await updateCandidate({ id, data });
      toast.success("Candidate profile updated");
    } catch (err: any) {
      toast.error("Failed to update candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (!window.confirm("Delete candidate profile?")) return;
    try {
      setLoading(true);
      await deleteCandidate(id);
      toast.success("Candidate purged");
    } catch (err: any) {
      toast.error("Failed to purge candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (data: any) => {
    try {
      setLoading(true);
      await createPlacement(data);
      toast.success("Placement confirmed! Candidate hired.");
    } catch (err: any) {
      toast.error("Failed to confirm placement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[1600px] mx-auto animate-fade-in relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
            <Spinner size="lg" />
          </div>
        )}

        {/* Recruitment Header & Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm mb-6">
          <div className="p-6 pb-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-md shadow-lg shadow-blue-500/30">
                <Handshake size={24} />
              </div>
              {t("recruitmentPipeline")}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {t("recruitmentDescription")}
            </p>
          </div>

          <div className="px-6 pb-4">
            <ModernTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          <div
            className={
              activeTab === "ats-pipeline" ? "block animate-fade-in" : "hidden"
            }
          >
            <RecruitmentModule
              vacancies={globalVacancies}
              stats={recruitmentStats}
              candidates={globalClients}
              onAddVacancy={handleCreateVacancy}
              onUpdateVacancy={handleUpdateVacancy}
              onDeleteVacancy={handleDeleteVacancy}
              onAddCandidate={handleCreateCandidate}
              onUpdateCandidate={handleUpdateCandidate}
              onDeleteCandidate={handleDeleteCandidate}
              onPlaceCandidate={handleCreatePlacement}
              employers={globalEmployers}
              positions={globalPositions}
              placements={globalPlacements}
            />
          </div>
          <div
            className={
              activeTab === "clients" ? "block animate-fade-in" : "hidden"
            }
          >
            <ClientsPage isDark={isDark} setIsDark={setIsDark} hideLayout={true} />
          </div>
          <div
            className={
              activeTab === "employers" ? "block animate-fade-in" : "hidden"
            }
          >
            <EmployersPage isDark={isDark} setIsDark={setIsDark} />
          </div>
          <div
            className={
              activeTab === "vacancies" ? "block animate-fade-in" : "hidden"
            }
          >
            <VacanciesPage isDark={isDark} setIsDark={setIsDark} />
          </div>
          <div
            className={
              activeTab === "placements" ? "block animate-fade-in" : "hidden"
            }
          >
            <PlacementsPage isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruitmentPage;
