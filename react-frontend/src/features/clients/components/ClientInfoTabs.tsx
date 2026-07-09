import React, { useState } from "react";
import { format } from "date-fns";

interface ClientInfoTabsProps {
  client: any;
  educations?: any[];
}

const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({ client, educations }) => {
  const [activeTab, setActiveTab] = useState("Client Information");

  const tabs = [
    "Client Information",
    "Administration Information",
    "Family Information",
    "Health Information",
    "Case Summary",
    "Document Management",
  ];

  const getAge = (dob: string) => {
    if (!dob) return "";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const currentEducation = educations && educations.length > 0 ? educations[0] : null;

  return (
    <div className="w-full h-full bg-transparent flex flex-col gap-6">
      {/* Horizontal Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 font-bold text-sm rounded-full transition-colors ${
                isActive
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeTab === "Client Information" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
          {/* Client / Referral Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Client / Referral Information</h3>
              <p className="text-xs text-gray-500">Basic identification and contact details</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Khmer Name</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.firstName || client?.lastName || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">English Name</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.englishName || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Date of Birth</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {client?.dateOfBirth ? `${getAge(client.dateOfBirth)}yrs • ${format(new Date(client.dateOfBirth), "yyyy-MM-dd")}` : "---"}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Address</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.address || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Birth Address</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.province || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Phone Number</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.contactPhone || "0"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Carer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Carer Information</h3>
              <p className="text-xs text-gray-500">Primary caregiver details</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Current Carer</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Carer Gender</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Carer Relationship to Client</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Carer Phone</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Carer Address</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">School Information</h3>
              <p className="text-xs text-gray-500">Current education status</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">School Name</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{currentEducation?.schoolName || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">School Grade</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{currentEducation?.currentLevel || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">school's contact or the social worker.</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">---</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Other Information</h3>
              <p className="text-xs text-gray-500">System identifiers and program durations</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Global Id</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.id || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Time in NGO</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {client?.registerDate ? `${Math.max(1, Math.floor((Date.now() - new Date(client.registerDate).getTime()) / (1000 * 60 * 60 * 24)))} Day(s)` : "1 Day"}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Time in Program</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      កម្មវិធីបណ្តុះបណ្តាល - Outreach: 0 Day, កម្មវិធីបណ្តុះបណ្តាលតាមមណ្ឌល - Streetbased: 0 Day
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Client Information" && (
        <div className="flex items-center justify-center p-20 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 animate-fade-in">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            {activeTab} Content (Under Construction)
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientInfoTabs;
