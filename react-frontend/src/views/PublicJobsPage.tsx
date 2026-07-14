import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Link } from '@/lib/react-router-compat';
import { Briefcase, MapPin, DollarSign, Search, Building } from "lucide-react";
import api from "../services/api";
import {TextInput, Spinner, Button, Badge} from '@/lib/flowbite-compat';
import ModernPagination from "@/components/common/ModernPagination";
import SearchInput from "@/components/common/SearchInput";

const PublicJobsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["public-vacancies", currentPage, pageSize, search],
    queryFn: async (): Promise<{
      content: any[];
      totalPages: number;
      totalElements: number;
    }> => {
      const res = await api.get(
        `/vacancies/public?page=${currentPage}&size=${pageSize}&search=${search}`,
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const vacancies = jobsData?.content || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalElements = jobsData?.totalElements || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 opacity-50"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight uppercase">
            Find Your Next{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Opportunity
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
            Browse our open positions and take the next step in your career.
          </p>
          <div className="flex gap-2 max-w-2xl mx-auto">
            <SearchInput
                        placeholder="Search by job title, company, or keywords..."
                        value={search}
                        onChange={setSearch}
                        containerClassName="flex-1 shadow-lg"
                      />
            <Button
              color="blue"
              size="lg"
              className="px-6 rounded-lg shadow-lg"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
          Latest Openings
        </h2>
        <Badge color="info" size="sm" className="font-bold">
          {totalElements} Positions Found
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" color="info" />
        </div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
          <Briefcase
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((job: any) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group"
            >
              {/* Job Header */}
              <div className="p-6 pb-0 flex gap-4 items-start relative">
                {job.imageUrl ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={job.imageUrl}
                      alt="Company"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Building size={24} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 mb-1">
                    {job.jobPositionName || "Open Position"}
                  </h3>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {job.employerName}
                  </p>
                </div>
              </div>

              {/* Job Meta Info */}
              <div className="p-6 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">
                    {job.location || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  <DollarSign size={16} className="text-emerald-500" />
                  <span className="truncate font-mono font-bold">
                    ${job.salary} - ${job.salarymax}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  <Briefcase size={16} className="text-gray-400" />
                  <span className="truncate">
                    {job.contractType || "Full-Time"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t mt-auto">
                <Link to={`/jobs/${job.id}`} className="block w-full">
                  <Button
                    color="blue"
                    className="w-full font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow"
                  >
                    View Details & Apply
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalElements}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </div>
  );
};

export default PublicJobsPage;
