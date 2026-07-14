import React, { useState, useEffect } from "react";
import { Badge, Button, Avatar } from '@/lib/flowbite-compat';
import { CheckCircle, XCircle, Briefcase, FileText } from "lucide-react";
import api from '@/services/api';
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function GlobalATSBoard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/job-applications?page=0&size=500');
      setApplications(response.data.content || []);
    } catch (error) {
      toast.error("Failed to fetch global applications");
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

  const stages = [
    "PENDING",
    "SHORTLISTED",
    "APPLIED",
    "INTERVIEWING",
    "HIRED",
    "REJECTED",
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase size={20} className="text-indigo-600" /> 
          Global Applicant Tracking System (ATS)
        </h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
          Pipeline overview across all open vacancies
        </p>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 min-h-[500px]">
        {stages.map((stage) => {
          const stageApps = applications.filter((a) => (a.status || "PENDING").toUpperCase() === stage);
          return (
            <div
              key={stage}
              className="flex-1 min-w-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                  {stage}
                </h4>
                <Badge color="indigo" className="rounded-md">
                  {stageApps.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex items-start gap-3 mb-3 pl-2">
                      <Avatar size="sm" rounded />
                      <div>
                        <p className="text-sm font-bold dark:text-white uppercase tracking-tight">
                          {app.clientName || "Unknown Applicant"}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1">
                          {app.vacancyTitle || "Unknown Position"}
                        </p>
                      </div>
                    </div>
                    <div className="pl-2 mt-2">
                      <div className="text-[9px] font-semibold text-gray-500">Applied: {app.appliedDate ? format(new Date(app.appliedDate), 'MMM dd, yyyy') : 'N/A'}</div>
                    </div>
                    <div className="flex gap-2 mt-4 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stage === "PENDING" && (
                        <Button size="xs" color="blue" onClick={() => updateApplicationStatus(app.id, "SHORTLISTED")} className="flex-1 text-[9px] font-black uppercase">
                          Shortlist
                        </Button>
                      )}
                      {stage === "SHORTLISTED" && (
                        <Button size="xs" color="gray" onClick={() => updateApplicationStatus(app.id, "APPLIED")} className="flex-1 text-[9px] font-black uppercase">
                          <CheckCircle size={12} className="mr-1" /> Mark Applied
                        </Button>
                      )}
                      {stage === "APPLIED" && (
                        <Button size="xs" color="purple" onClick={() => updateApplicationStatus(app.id, "INTERVIEWING")} className="flex-1 text-[9px] font-black uppercase">
                          Interview
                        </Button>
                      )}
                      {stage === "INTERVIEWING" && (
                        <Button size="xs" color="success" onClick={() => updateApplicationStatus(app.id, "HIRED")} className="flex-1 text-[9px] font-black uppercase">
                          Hire
                        </Button>
                      )}
                      {stage !== "REJECTED" && stage !== "HIRED" && (
                        <Button size="xs" color="failure" onClick={() => updateApplicationStatus(app.id, "REJECTED")} className="text-[9px] font-black uppercase" title="Reject">
                          <XCircle size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {stageApps.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
