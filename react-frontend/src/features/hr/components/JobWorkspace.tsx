import React from "react";
import { Spinner } from "@/lib/flowbite-compat";
import { useJobWorkspaceState } from "@/features/hr/hooks/useJobWorkspaceState";

import JobWorkspaceHeaderBar from "./workspace/JobWorkspaceHeaderBar";
import JobWorkspaceDetailsTab from "./workspace/JobWorkspaceDetailsTab";
import JobWorkspacePipelineTab from "./workspace/JobWorkspacePipelineTab";
import JobWorkspaceMatchTalentTab from "./workspace/JobWorkspaceMatchTalentTab";
import JobWorkspaceDocumentModal from "./workspace/JobWorkspaceDocumentModal";

interface JobWorkspaceProps {
  vacancy: any;
  candidates: any[];
  onClose: () => void;
}

const JobWorkspace: React.FC<JobWorkspaceProps> = ({
  vacancy,
  candidates,
  onClose,
}) => {
  const state = useJobWorkspaceState({ vacancy, candidates });
  const { activeTab, isLoading } = state;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar & Tab Navigation */}
      <JobWorkspaceHeaderBar vacancy={vacancy} onClose={onClose} state={state} />

      {/* Active Tab Panel Display */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {activeTab === "DETAILS" && <JobWorkspaceDetailsTab vacancy={vacancy} />}
          {activeTab === "PIPELINE" && <JobWorkspacePipelineTab state={state} />}
          {activeTab === "MATCH_TALENT" && (
            <JobWorkspaceMatchTalentTab candidates={candidates} state={state} />
          )}
        </>
      )}

      {/* Auto-Generated Document Hub Modal */}
      <JobWorkspaceDocumentModal vacancy={vacancy} state={state} />
    </div>
  );
};

export default JobWorkspace;
