import React, { useState, useEffect } from "react";
import Layout from "@/components/common/Layout";
import { useTranslation } from "react-i18next";
import { Activity, Briefcase, Building2, User, Handshake } from "lucide-react";

// Import the modularized pages
import ClientsPage from "./ClientsPage";
import EmployersPage from "./EmployersPage";
import VacanciesPage from "./VacanciesPage";
import PlacementsPage from "./PlacementsPage";
import ModernTabs from "@/components/common/ModernTabs";

// New HR Recruitment ATS Pipeline Module
import RecruitmentModule from "@/features/hr/components/RecruitmentModule";
import { useHRStore } from "../store/hrStore";
import api from "../services/api";
import { toast } from "react-hot-toast";

const RecruitmentPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("ats-pipeline");

  // State for HR Store (ATS Pipeline)
  const {
    globalVacancies,
    recruitmentStats,
    globalClients,
    globalEmployers,
    globalPositions,
    globalPlacements,
    fetchGlobalData,
  } = useHRStore();

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
    { id: "ats-pipeline", label: "ATS Pipeline", icon: <Activity size={18} /> },
    { id: "clients", label: "Candidates List", icon: <User size={18} /> },
    { id: "employers", label: "Employers", icon: <Building2 size={18} /> },
    { id: "vacancies", label: "Vacancies List", icon: <Briefcase size={18} /> },
    {
      id: "placements",
      label: "Placements List",
      icon: <Handshake size={18} />,
    },
  ];

  // Handlers for ATS Pipeline
  const handleCreateVacancy = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/vacancies", data);
      toast.success("New vacancy published");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to publish vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVacancy = async (id: number, data: any) => {
    try {
      setLoading(true);
      await api.put(`/vacancies/${id}`, data);
      toast.success("Vacancy updated");
      await fetchGlobalData();
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
      await api.delete(`/vacancies/${id}`);
      toast.success("Vacancy removed");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to remove vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/clients", data);
      toast.success("Candidate enrolled");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to enroll candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = async (id: number, data: any) => {
    try {
      setLoading(true);
      await api.put(`/clients/${id}`, data);
      toast.success("Candidate profile updated");
      await fetchGlobalData();
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
      await api.delete(`/clients/${id}`);
      toast.success("Candidate purged");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to purge candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/placements", data);
      toast.success("Placement confirmed! Candidate hired.");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to confirm placement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Recruitment Hub">
      <div className="max-w-[1600px] mx-auto animate-fade-in relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Recruitment Header & Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-md shadow-sm border border-gray-100 dark:border-gray-700/50 mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-md shadow-lg shadow-blue-500/30">
                <Handshake size={24} />
              </div>
              Recruitment Pipeline
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Manage candidates, employers, job openings, and successful
              placements from a single dashboard.
            </p>
          </div>

          <div className="px-6 pb-0">
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
            <ClientsPage isDark={isDark} setIsDark={setIsDark} />
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
    </Layout>
  );
};

export default RecruitmentPage;
