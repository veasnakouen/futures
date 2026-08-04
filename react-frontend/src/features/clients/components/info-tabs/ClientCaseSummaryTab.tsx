import React from "react";
import { format } from "date-fns";
import { Briefcase, AlertCircle } from "lucide-react";

interface Props {
  cases: any[];
  state: any;
}

export default function ClientCaseSummaryTab({ cases, state }: Props) {
  const { setIsCaseModalOpen } = state;

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-blue-500" /> Active & Historical Cases
            </h3>
            <p className="text-xs text-gray-500 ml-6">Overview of social work interventions</p>
          </div>
          <button
            onClick={() => setIsCaseModalOpen(true)}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            + New Case
          </button>
        </div>
        <div className="space-y-4">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cases found.</div>
          ) : (
            cases.map((c: any) => (
              <div
                key={c.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-800/50 group cursor-pointer gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {c.subject || c.serviceType}
                      </h4>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[9px] font-black uppercase tracking-wider rounded">
                        {c.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Opened</p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {c.openDate ? format(new Date(c.openDate), "dd MMM yyyy") : "N/A"}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Assigned To</p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Worker #{c.caseWorkerId || "?"}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                    {c.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
