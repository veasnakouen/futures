import React from "react";
import { useClientInfoTabsState, type ClientInfoTabsProps } from "@/features/clients/hooks/useClientInfoTabsState";

import ClientGeneralInfoTab from "./info-tabs/ClientGeneralInfoTab";
import ClientAdminInfoTab from "./info-tabs/ClientAdminInfoTab";
import ClientFamilyInfoTab from "./info-tabs/ClientFamilyInfoTab";
import ClientHealthInfoTab from "./info-tabs/ClientHealthInfoTab";
import ClientCaseSummaryTab from "./info-tabs/ClientCaseSummaryTab";
import ClientDocumentTab from "./info-tabs/ClientDocumentTab";

import AddFamilyMemberModal from "./AddFamilyMemberModal";
import AddHealthRecordModal from "./AddHealthRecordModal";
import AddCaseModal from "./AddCaseModal";
import UploadDocumentModal from "./UploadDocumentModal";

const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({
  client,
  educations,
  familyMembers = [],
  healthRecords = [],
  cases = [],
  documents = [],
}) => {
  const state = useClientInfoTabsState({ educations });
  const {
    activeTab,
    setActiveTab,
    tabs,
    isFamilyModalOpen,
    setIsFamilyModalOpen,
    isHealthModalOpen,
    setIsHealthModalOpen,
    isCaseModalOpen,
    setIsCaseModalOpen,
    isDocModalOpen,
    setIsDocModalOpen,
  } = state;

  return (
    <div className="w-full h-auto lg:h-full bg-transparent flex flex-col gap-6">
      {/* Horizontal Sub-Tabs Header Navigation */}
      <div className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 font-bold text-sm rounded-2xl transition-all duration-300 relative group overflow-hidden shrink-0 cursor-pointer ${
                isActive
                  ? "text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white/40 hover:bg-white/80 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 backdrop-blur-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-md"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-in fade-in duration-300" />
              )}
              <span className="relative z-10 block transform transition-transform group-hover:scale-105 group-active:scale-95">
                {tab}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Active Sub-Tab Panel Render */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {activeTab === "Client Information" && <ClientGeneralInfoTab client={client} state={state} />}
        {activeTab === "Administration Information" && <ClientAdminInfoTab client={client} />}
        {activeTab === "Family Information" && <ClientFamilyInfoTab state={state} />}
        {activeTab === "Health Information" && <ClientHealthInfoTab healthRecords={healthRecords} state={state} />}
        {activeTab === "Case Summary" && <ClientCaseSummaryTab cases={cases} state={state} />}
        {activeTab === "Document Management" && <ClientDocumentTab documents={documents} state={state} />}
      </div>

      {/* Modals */}
      <AddFamilyMemberModal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} clientId={client?.id} />
      <AddHealthRecordModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} clientId={client?.id} />
      <AddCaseModal isOpen={isCaseModalOpen} onClose={() => setIsCaseModalOpen(false)} clientId={client?.id} />
      <UploadDocumentModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} clientId={client?.id} />
    </div>
  );
};

export default ClientInfoTabs;
