import React from "react";
import { Button, Spinner, Alert } from "@/lib/flowbite-compat";
import { ArrowLeft } from "lucide-react";
import ClientSidebar from "@/features/clients/components/ClientSidebar";
import ClientInfoTabs from "@/features/clients/components/ClientInfoTabs";
import ClientCases from "@/features/clients/components/ClientCases";
import ClientPrograms from "@/features/clients/components/ClientPrograms";
import { useClientProfileState } from "@/features/clients/hooks/useClientProfileState";
import { ClientProfileModals } from "@/features/clients/components/profile/ClientProfileModals";

interface ClientProfilePageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const ClientProfilePage: React.FC<ClientProfilePageProps> = ({ isDark, setIsDark }) => {
  const state = useClientProfileState();
  const {
    navigate,
    data,
    loading,
    error,
    activeMenu,
    setActiveMenu,
    setClientForm,
    setIsClientModalOpen,
    handleDeleteItem,
  } = state;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Building 360° Portfolio View...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <Alert color="failure" className="rounded-lg p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-2">Portfolio Unavailable</h3>
          <p className="mb-6">{error}</p>
          <Button
            color="gray"
            onClick={() => navigate("/clients")}
            className="mx-auto rounded-lg"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Client List
          </Button>
        </Alert>
      </div>
    );
  }

  const { client, cases, placements, familyMembers, healthRecords, documents } = data;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pt-2 pb-6 px-1 lg:px-2 min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)]">
        <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 h-auto lg:h-full lg:overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors w-fit px-2"
          >
            <ArrowLeft size={16} /> Back to Clients
          </button>
          <ClientSidebar
            client={client}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            onEditClient={() => {
              let safeDob = "";
              if (client?.dateOfBirth) {
                try {
                  safeDob = new Date(client.dateOfBirth).toISOString().split("T")[0];
                } catch { }
              }
              let safeIdPoor = "";
              if (client?.idpoorValiddate) {
                try {
                  safeIdPoor = new Date(client.idpoorValiddate).toISOString().split("T")[0];
                } catch { }
              }
              setClientForm({
                ...client,
                dateOfBirth: safeDob,
                idpoorValiddate: safeIdPoor,
              });
              setIsClientModalOpen(true);
            }}
            onDeleteClient={() => handleDeleteItem("profile", 0)}
            programsCount={placements?.length || 0}
            staffsCount={0}
          />
        </div>
        <div className="flex-1 w-full min-w-0 h-auto lg:h-full lg:overflow-hidden">
          {activeMenu === "Client / Referral" && (
            <ClientInfoTabs
              client={client}
              educations={data.educations}
              familyMembers={familyMembers}
              healthRecords={healthRecords}
              cases={cases}
              documents={documents}
            />
          )}
          {activeMenu === "Case Management" && (
            <ClientCases clientId={client.id} />
          )}
          {activeMenu === "Program Management" && (
            <ClientPrograms clientId={client.id} />
          )}
        </div>
      </div>

      <ClientProfileModals state={state} />
    </>
  );
};

export default ClientProfilePage;
