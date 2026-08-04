import React from "react";
import { Briefcase, CheckCircle2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CaseMetricsHeaderProps {
  metrics: {
    total: number;
    highPriority: number;
    closed: number;
  };
}

export const CaseMetricsHeader: React.FC<CaseMetricsHeaderProps> = ({ metrics }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
              {t("totalActiveCases")}
            </p>
            <h3 className="text-4xl font-black mt-1">
              {Math.max(0, metrics.total - metrics.closed)}
            </h3>
          </div>
          <div className="p-3 bg-white/10 rounded-md">
            <Briefcase size={24} />
          </div>
        </div>
      </div>
      <div className="shadow-xl bg-white dark:bg-gray-800 rounded-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {t("highPriorityAlerts")}
            </p>
            <h3 className="text-4xl font-black mt-1 text-rose-500">
              {metrics.highPriority}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-md">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
      <div className="shadow-xl bg-white dark:bg-gray-800 rounded-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {t("resolvedCases")}
            </p>
            <h3 className="text-4xl font-black mt-1 dark:text-white">
              {metrics.closed}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-md">
            <FileText size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseMetricsHeader;
