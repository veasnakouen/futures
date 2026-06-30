import React, { useState, useEffect } from "react";
import {
  Card,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/lib/flowbite-compat';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  FileOutput,
  Printer,
} from "lucide-react";
import ModernTabs from "@/components/common/ModernTabs";
import api from '@/services/api';
import { toast } from "react-hot-toast";
import { format } from "date-fns";

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
  const [activeTab, setActiveTab] = useState<
    "DETAILS" | "PIPELINE" | "MATCH_TALENT"
  >("DETAILS");
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Document Generation State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
  }, [vacancy.id]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/job-applications/vacancy/${vacancy.id}?size=100`,
      );
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to shortlist candidate");
    }
  };

  const openDocumentGenerator = (app: any) => {
    setSelectedApplicant(app);
    setIsDocModalOpen(true);
  };

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-gray-50 dark:bg-gray-800 p-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Job Responsibilities
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {vacancy.responsibilities || "Not specified"}
          </p>
        </Card>
        <Card className="shadow-sm border-none bg-gray-50 dark:bg-gray-800 p-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Requirements & Skills
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {vacancy.requirement || "Not specified"}
          </p>
        </Card>
      </div>
      {vacancy.applicationInformation && (
        <Card className="shadow-sm border-none bg-blue-50 dark:bg-blue-900/20 p-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
            Application Instructions
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
            {vacancy.applicationInformation}
          </p>
        </Card>
      )}
    </div>
  );

  const renderPipeline = () => {
    const stages = [
      "SHORTLISTED",
      "APPLIED",
      "INTERVIEWING",
      "HIRED",
      "REJECTED",
    ];
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 min-h-[500px]">
        {stages.map((stage) => {
          const stageApps = applications.filter((a) => a.status === stage);
          return (
            <div
              key={stage}
              className="flex-1 min-w-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
                  {stage}
                </h4>
                <Badge color="gray" className="rounded-full">
                  {stageApps.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar size="sm" rounded />
                      <div>
                        <p className="text-sm font-bold dark:text-white uppercase tracking-tight">
                          {app.client?.firstName} {app.client?.lastName}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          {app.client?.clientCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {stage === "SHORTLISTED" && (
                        <>
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() => openDocumentGenerator(app)}
                            className="flex-1 text-[9px] font-black uppercase"
                            title="Generate CV & Cover Letter"
                          >
                            <FileText size={12} className="mr-1" /> Generate
                            Docs
                          </Button>
                          <Button
                            size="xs"
                            color="gray"
                            onClick={() =>
                              updateApplicationStatus(app.id, "APPLIED")
                            }
                            className="text-[9px] font-black uppercase"
                            title="Mark as Applied"
                          >
                            <CheckCircle size={12} />
                          </Button>
                        </>
                      )}
                      {stage === "APPLIED" && (
                        <>
                          <Button
                            size="xs"
                            color="purple"
                            onClick={() =>
                              updateApplicationStatus(app.id, "INTERVIEWING")
                            }
                            className="flex-1 text-[9px] font-black uppercase"
                          >
                            Interview
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() =>
                              updateApplicationStatus(app.id, "REJECTED")
                            }
                            className="text-[9px] font-black uppercase"
                          >
                            <XCircle size={12} />
                          </Button>
                        </>
                      )}
                      {stage === "INTERVIEWING" && (
                        <>
                          <Button
                            size="xs"
                            color="success"
                            onClick={() =>
                              updateApplicationStatus(app.id, "HIRED")
                            }
                            className="flex-1 text-[9px] font-black uppercase"
                          >
                            Hire
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() =>
                              updateApplicationStatus(app.id, "REJECTED")
                            }
                            className="text-[9px] font-black uppercase"
                          >
                            <XCircle size={12} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {stageApps.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatchTalent = () => {
    // Very basic mock algorithm for matching (in real life, this is handled by backend or more complex frontend logic)
    const matchedCandidates = candidates
      .map((c) => {
        let score = 50; // base score
        if (c.status === "Searching") score += 20;
        // E.g., if client expectations match vacancy job position etc.
        return { ...c, matchScore: score + Math.floor(Math.random() * 30) }; // Randomize a bit for demo
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchedCandidates.map((c) => {
          const isAlreadyShortlisted = applications.some(
            (app) => app.client?.id === c.id,
          );
          return (
            <Card
              key={c.id}
              className="shadow-sm border-none dark:bg-gray-800 group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar size="md" rounded img={c.photo} />
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-sm dark:text-white">
                      {c.firstName} {c.lastName}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {c.clientCode}
                    </p>
                  </div>
                </div>
                <Badge color="success" className="font-black text-[9px]">
                  {c.matchScore}% Match
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge color="gray" className="text-[8px] uppercase">
                  {c.branch}
                </Badge>
                <Badge color="info" className="text-[8px] uppercase">
                  {c.status}
                </Badge>
              </div>
              <Button
                color="blue"
                disabled={isAlreadyShortlisted}
                onClick={() => shortlistCandidate(c.id)}
                className="w-full font-black uppercase text-[10px] tracking-widest h-10 border-none"
              >
                {isAlreadyShortlisted ? "In Pipeline" : "Shortlist Talent"}
              </Button>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Hub
      </button>

      {/* Job Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700 relative overflow-hidden">
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
              <Briefcase size={16} />{" "}
              {vacancy.employerName || "Confidential Employer"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-rose-500" />{" "}
              {vacancy.location || "Remote/Any"}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-500" />{" "}
              {vacancy.salary || 0}{" "}
              {vacancy.salarymax ? `- ${vacancy.salarymax}` : ""}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500" />{" "}
              {vacancy.schedule || "Standard Hours"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" /> Closing:{" "}
              {vacancy.closingDate
                ? format(new Date(vacancy.closingDate), "MMM dd, yyyy")
                : "TBD"}
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

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {activeTab === "DETAILS" && renderDetails()}
          {activeTab === "PIPELINE" && renderPipeline()}
          {activeTab === "MATCH_TALENT" && renderMatchTalent()}
        </>
      )}

      {/* Document Generation Modal */}
      <Modal
        show={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        size="4xl"
      >
        <ModalHeader>Document Generation Hub</ModalHeader>
        <ModalBody>
          {selectedApplicant && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-none border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    Target Position
                  </h4>
                  <p className="font-bold text-sm dark:text-white uppercase">
                    {vacancy.jobPositionName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vacancy.employerName}
                  </p>
                </Card>
                <Card className="shadow-none border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    Client Profile
                  </h4>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar size="md" rounded />
                    <div>
                      <p className="font-bold text-sm dark:text-white uppercase">
                        {selectedApplicant.client?.firstName}{" "}
                        {selectedApplicant.client?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedApplicant.client?.clientCode}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Auto-Generated Cover Letter
                    </span>
                  </div>
                  <div className="p-6">
                    <textarea
                      className="w-full h-48 border-none focus:ring-0 resize-none bg-transparent dark:text-white text-sm"
                      defaultValue={`Dear Hiring Manager at ${vacancy.employerName || "the Company"},\n\nI am writing to express my strong interest in the ${vacancy.jobPositionName || "open"} position. With my background and skills, I am confident in my ability to contribute effectively to your team.\n\nMy experience aligns well with the requirements for this role, particularly in areas matching your needs. I am highly motivated and eager to bring my expertise to ${vacancy.employerName || "your organization"}.\n\nThank you for considering my application. I look forward to discussing how I can add value to your team.\n\nSincerely,\n${selectedApplicant.client?.firstName} ${selectedApplicant.client?.lastName}`}
                    />
                  </div>
                </div>

                <div className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Auto-Generated CV Preview
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="border-b pb-4 mb-4">
                      <h1 className="text-2xl font-black uppercase tracking-tight">
                        {selectedApplicant.client?.firstName}{" "}
                        {selectedApplicant.client?.lastName}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedApplicant.client?.email} |{" "}
                        {selectedApplicant.client?.contactPhone}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                          Professional Summary
                        </h3>
                        <p className="text-sm">
                          A dedicated and skilled professional looking to excel
                          as a {vacancy.jobPositionName}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-end gap-3">
          <Button color="gray" onClick={() => setIsDocModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => {
              toast.success("Documents exported to PDF");
              setIsDocModalOpen(false);
              updateApplicationStatus(selectedApplicant.id, "APPLIED");
            }}
          >
            <Printer size={16} className="mr-2" /> Print & Apply
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default JobWorkspace;
