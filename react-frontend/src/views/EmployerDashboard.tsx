import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import {Spinner, Badge, Button} from '@/lib/flowbite-compat';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

const EmployerDashboard = () => {
  // For a real implementation, we'd get the employerId from the logged-in user context
  const employerId = 1; // HARDCODED for prototype

  const {
    data: applicationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["employer-applications", employerId],
    queryFn: async () => {
      const res = await api.get(`/api/job-applications/employer/${employerId}`);
      return res.data;
    },
  });

  const applications = applicationsData?.content || [];

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/job-applications/${id}/status`, { status });
      toast.success(`Application marked as ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Employer Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage applicants for your posted vacancies.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-indigo-500" /> Recent Applications
          </h2>
          <Badge color="info">{applications.length} Total</Badge>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
            <p>No applications received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {applications.map((app: any) => (
              <div
                key={app.id}
                className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {app.clientName}
                    <Badge
                      color={
                        app.status === "HIRED"
                          ? "success"
                          : app.status === "REJECTED"
                            ? "failure"
                            : "warning"
                      }
                    >
                      {app.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {app.clientEmail} • Applied for{" "}
                    <span className="font-semibold text-indigo-600">
                      {app.vacancyTitle}
                    </span>
                  </p>

                  {app.coverLetter && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-2 pl-3 py-1">
                      "{app.coverLetter}"
                    </p>
                  )}
                  {app.cvUrl && (
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                    >
                      <FileText size={16} /> View CV
                    </a>
                  )}
                </div>

                {app.status === "PENDING" && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => handleUpdateStatus(app.id, "HIRED")}
                    >
                      <CheckCircle2 size={16} className="mr-2" /> Hire
                    </Button>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                    >
                      <XCircle size={16} className="mr-2" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
