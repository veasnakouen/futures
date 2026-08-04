import React from "react";
import { Plus, Search } from "lucide-react";
import { Button, Badge, Spinner } from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import { useTranslation } from "react-i18next";

interface CaseListSidebarProps {
  cases: any[];
  selectedCase: any | null;
  onSelectCase: (kase: any) => void;
  onNewCase: () => void;
  loading: boolean;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const CaseListSidebar: React.FC<CaseListSidebarProps> = ({
  cases,
  selectedCase,
  onSelectCase,
  onNewCase,
  loading,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{t("cases")}</h2>
          <Button
            size="sm"
            onClick={onNewCase}
            className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Plus size={16} className="mr-1" /> {t("new")}
          </Button>
        </div>

        {/* Pill Filters */}
        <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-md">
          {["All", "Open", "Closed"].map((f) => (
            <button
              key={f}
              onClick={() => onStatusFilterChange(f)}
              className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                statusFilter === f
                  ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t(f.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : cases.length === 0 ? (
          <div className="py-20 text-center">
            <Search
              className="mx-auto text-gray-200 dark:text-gray-700 mb-3"
              size={48}
            />
            <p className="text-sm font-bold text-gray-400">No cases found</p>
          </div>
        ) : (
          cases.map((kase) => (
            <div
              key={kase.id}
              onClick={() => onSelectCase(kase)}
              className={`p-4 rounded-md cursor-pointer transition-all ${
                selectedCase?.id === kase.id
                  ? "bg-blue-50/50 dark:bg-blue-900/20 shadow-sm ring-2 ring-blue-500/50"
                  : "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700/60"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold dark:text-white leading-tight truncate pr-2">
                  {kase.subject}
                </h3>
                <Badge
                  color={kase.priority === "High" ? "failure" : "info"}
                  size="xs"
                  className="shrink-0 font-black tracking-wider uppercase text-[9px]"
                >
                  {kase.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                {kase.client?.firstName
                  ? `${kase.client.firstName} ${kase.client.lastName || ""}`
                  : kase.clientName || "General Client"}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span className="truncate">{kase.serviceType}</span>
                <span>•</span>
                <span
                  className={
                    kase.status === "Closed"
                      ? "text-gray-400"
                      : "text-emerald-500"
                  }
                >
                  {kase.status}
                </span>
              </div>
            </div>
          ))
        )}

        {totalPages > 0 && (
          <div className="pt-2 pb-4 flex justify-center">
            <ModernPagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(p) => onPageChange(p - 1)}
              showInfo={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseListSidebar;
