import { useState } from "react";
import { useParams, Link } from '@/lib/react-router-compat';
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Spinner, Button, Badge } from '@/lib/flowbite-compat';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  ChevronLeft,
  Building,
  Users,
} from "lucide-react";
import ApplyJobModal from "@/features/vacancies/components/ApplyJobModal";

const JobDetailPage = () => {
  const { id } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["public-vacancy", id],
    queryFn: async () => {
      const res = await api.get(`/api/vacancies/public/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="info" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job not found
        </h2>
        <Link
          to="/jobs"
          className="text-indigo-600 hover:underline mt-4 inline-block"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-bold tracking-wide"
      >
        <ChevronLeft size={20} /> Back to Search
      </Link>

      {/* Job Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {job.imageUrl ? (
            <div className="w-24 h-24 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 bg-white shadow-sm">
              <img
                src={job.imageUrl}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-indigo-500 shadow-sm">
              <Building size={32} />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">
                  {job.jobPositionName || "Open Position"}
                </h1>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                  {job.employerName}
                </p>
              </div>
              <Button
                color="blue"
                size="xl"
                className="hidden md:block font-bold tracking-widest shadow-lg"
                onClick={() => setIsApplyModalOpen(true)}
              >
                Apply Now
              </Button>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Badge color="info" icon={MapPin} className="px-3 py-1 font-bold">
                {job.location || "Not specified"}
              </Badge>
              <Badge
                color="success"
                icon={DollarSign}
                className="px-3 py-1 font-mono font-bold"
              >
                ${job.salary} - ${job.salarymax}
              </Badge>
              <Badge
                color="purple"
                icon={Briefcase}
                className="px-3 py-1 font-bold"
              >
                {job.contractType || "Full-Time"}
              </Badge>
              <Badge
                color="gray"
                icon={Calendar}
                className="px-3 py-1 font-bold"
              >
                Deadline: {job.closingDate || "Open"}
              </Badge>
              <Badge
                color="warning"
                icon={Users}
                className="px-3 py-1 font-bold"
              >
                {job.positionAvailable} Positions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Responsibilities */}
          {job.responsibilities && (
            <section>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Briefcase size={20} />
                </span>
                Responsibilities
              </h3>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {job.responsibilities}
              </div>
            </section>
          )}

          {/* Requirements */}
          {job.requirement && (
            <section>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Users size={20} />
                </span>
                Requirements
              </h3>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {job.requirement}
              </div>
            </section>
          )}
        </div>

        {/* Mobile Apply Button */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 md:hidden sticky bottom-0 z-10">
          <Button
            color="blue"
            size="xl"
            className="w-full font-bold tracking-widest shadow-lg"
            onClick={() => setIsApplyModalOpen(true)}
          >
            Apply Now
          </Button>
        </div>
      </div>

      {isApplyModalOpen && (
        <ApplyJobModal
          vacancy={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
