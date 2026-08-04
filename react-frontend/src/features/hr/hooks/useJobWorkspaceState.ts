import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export interface JobWorkspaceProps {
  vacancy: any;
  candidates: any[];
  onClose: () => void;
}

export function useJobWorkspaceState({ vacancy, candidates }: { vacancy: any; candidates: any[] }) {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "PIPELINE" | "MATCH_TALENT">("DETAILS");
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  useEffect(() => {
    if (vacancy?.id) {
      fetchApplications();
    }
  }, [vacancy?.id]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/job-applications/vacancy/${vacancy.id}?size=100`);
      setApplications(response.data.content || []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: number, status: string) => {
    try {
      await api.put(`/job-applications/${appId}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchApplications();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const shortlistCandidate = async (candidateId: number) => {
    try {
      await api.post("/job-applications", {
        clientId: candidateId,
        vacancyId: vacancy.id,
        appliedDate: new Date().toISOString().split("T")[0] + "T00:00:00",
        status: "SHORTLISTED",
      });
      toast.success("Candidate shortlisted successfully");
      fetchApplications();
    } catch {
      toast.error("Failed to shortlist candidate");
    }
  };

  const openDocumentGenerator = (app: any) => {
    setSelectedApplicant(app);
    setIsDocModalOpen(true);
  };

  return {
    activeTab,
    setActiveTab,
    applications,
    isLoading,
    isDocModalOpen,
    setIsDocModalOpen,
    selectedApplicant,
    setSelectedApplicant,
    fetchApplications,
    updateApplicationStatus,
    shortlistCandidate,
    openDocumentGenerator,
  };
}
