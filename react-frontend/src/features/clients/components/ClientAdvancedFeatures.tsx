import React from "react";
import { Button, Spinner } from "@/lib/flowbite-compat";
import ModernTabs from "@/components/common/ModernTabs";
import { ArrowLeft } from "lucide-react";

import useClientAdvancedFeatures from "./advanced/useClientAdvancedFeatures";
import FuturesTrainingTab from "./advanced/FuturesTrainingTab";
import FurtherEducationTab from "./advanced/FurtherEducationTab";
import JobExpectationsCvTab from "./advanced/JobExpectationsCvTab";
import MonitoringFollowUpTab from "./advanced/MonitoringFollowUpTab";
import ClientLegalMedicalTab from "./advanced/ClientLegalMedicalTab";
import ClientDocumentsTab from "./advanced/ClientDocumentsTab";

interface ClientAdvancedFeaturesProps {
  clientId: number | string;
  onClose?: () => void;
  formData?: any;
}

export default function ClientAdvancedFeatures({
  clientId,
  onClose,
  formData,
}: ClientAdvancedFeaturesProps) {
  const {
    id,
    data,
    loading,
    activeTab,
    setActiveTab,
    futuresTrainings,
    furtherEducationReferrals,
    jobExpectations,
    languages,
    computerSkills,
    jobExperiences,
    personalities,
    monitorings,
    medicalRecords,
    legalCases,
    documents,
    furtherEducationForm,
    setFurtherEducationForm,
    // Modals
    setIsFuturesTrainingModalOpen,
    setIsFurtherEducationReferralModalOpen,
    setIsReferralSourceModalOpen,
    setIsJobExpModalOpen,
    setIsLangModalOpen,
    setIsSkillModalOpen,
    setIsExpModalOpen,
    setIsPersonalityModalOpen,
    setIsMonitoringModalOpen,
    setIsMedicalModalOpen,
    setIsLegalModalOpen,
    setIsUploadDocModalOpen,
    // Handlers
    handleDeleteItem,
    handleSaveFurtherEducation,
  } = useClientAdvancedFeatures({ clientId });

  const tabs = [
    { id: "Futures Training", label: "Futures Courses" },
    { id: "Further Education", label: "Further Education" },
    { id: "Job Expectations", label: "Job Expectations & CV" },
    { id: "Monitoring", label: "Post-Placement Monitoring" },
    { id: "Legal & Medical", label: "Legal & Medical" },
    { id: "Documents", label: "Documents & Files" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-4 font-black text-xs uppercase tracking-widest text-gray-400">
          Syncing Client Advanced Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
              Client ID: #{id}
            </span>
          </div>
          <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight">
            {data?.client ? `${data.client.firstNameEnglish} ${data.client.lastNameEnglish}` : `Client Profile #${id}`}
          </h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Comprehensive case file, education, employment, monitoring, and legal ledger
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ModernTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Views */}
      {activeTab === "Futures Training" && (
        <FuturesTrainingTab
          futuresTrainings={futuresTrainings}
          onOpenEnrollModal={() => setIsFuturesTrainingModalOpen(true)}
          onOpenEditModal={() => setIsFuturesTrainingModalOpen(true)}
          onDeleteTraining={(itemEditId) => handleDeleteItem("futuresTraining", itemEditId)}
        />
      )}

      {activeTab === "Further Education" && (
        <FurtherEducationTab
          furtherEducationForm={furtherEducationForm}
          setFurtherEducationForm={setFurtherEducationForm}
          handleSaveFurtherEducation={handleSaveFurtherEducation}
          furtherEducationReferrals={furtherEducationReferrals}
          onOpenReferralModal={() => setIsFurtherEducationReferralModalOpen(true)}
          onDeleteReferral={(referralId) => handleDeleteItem("furtherEducationReferral", referralId)}
          onOpenReferralSourceModal={() => setIsReferralSourceModalOpen(true)}
        />
      )}

      {activeTab === "Job Expectations" && (
        <JobExpectationsCvTab
          jobExpectations={jobExpectations}
          languages={languages}
          computerSkills={computerSkills}
          jobExperiences={jobExperiences}
          personalities={personalities}
          onOpenJobExpModal={() => setIsJobExpModalOpen(true)}
          onOpenLangModal={() => setIsLangModalOpen(true)}
          onOpenSkillModal={() => setIsSkillModalOpen(true)}
          onOpenExpModal={() => setIsExpModalOpen(true)}
          onOpenPersonalityModal={() => setIsPersonalityModalOpen(true)}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {activeTab === "Monitoring" && (
        <MonitoringFollowUpTab
          monitorings={monitorings}
          onOpenMonitoringModal={() => setIsMonitoringModalOpen(true)}
          onOpenEditMonitoringModal={() => setIsMonitoringModalOpen(true)}
          onDeleteMonitoring={(monId) => handleDeleteItem("postPlacementMonitoring", monId)}
        />
      )}

      {activeTab === "Legal & Medical" && (
        <ClientLegalMedicalTab
          medicalRecords={medicalRecords}
          legalCases={legalCases}
          onOpenMedicalModal={() => setIsMedicalModalOpen(true)}
          onOpenLegalModal={() => setIsLegalModalOpen(true)}
          onDeleteMedical={(medId) => handleDeleteItem("healthRecord", medId)}
          onDeleteLegal={(legId) => handleDeleteItem("legalCase", legId)}
        />
      )}

      {activeTab === "Documents" && (
        <ClientDocumentsTab
          documents={documents}
          onOpenUploadModal={() => setIsUploadDocModalOpen(true)}
          onDeleteDocument={(docId) => handleDeleteItem("document", docId)}
        />
      )}
    </div>
  );
}
