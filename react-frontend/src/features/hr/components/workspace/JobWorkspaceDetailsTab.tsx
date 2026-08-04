import React from "react";

interface Props {
  vacancy: any;
}

export default function JobWorkspaceDetailsTab({ vacancy }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="shadow-sm border-none bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Job Responsibilities
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {vacancy.responsibilities || "Not specified"}
          </p>
        </div>
        <div className="shadow-sm border-none bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Requirements & Skills
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {vacancy.requirement || "Not specified"}
          </p>
        </div>
      </div>
      {vacancy.applicationInformation && (
        <div className="shadow-sm border-none bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
          <h4 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
            Application Instructions
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
            {vacancy.applicationInformation}
          </p>
        </div>
      )}
    </div>
  );
}
