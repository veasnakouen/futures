import React from "react";
import { format } from "date-fns";
import { User, Users, Briefcase, Info } from "lucide-react";

interface Props {
  client: any;
  state: any;
}

export default function ClientGeneralInfoTab({ client, state }: Props) {
  const { getAge, currentEducation } = state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Client / Referral Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User size={18} className="text-blue-500" /> Client / Referral Information
          </h3>
          <p className="text-xs text-gray-500 ml-6">Basic identification and contact details</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500 w-1/2">Khmer Name</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.firstName || client?.lastName || "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">English Name</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.englishName || "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Date of Birth</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.dateOfBirth
                    ? `${getAge(client.dateOfBirth)}yrs • ${format(new Date(client.dateOfBirth), "yyyy-MM-dd")}`
                    : "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Address</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.address || "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Birth Address</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.province || "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Phone Number</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.contactPhone || "---"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Carer Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-purple-500" /> Carer Information
          </h3>
          <p className="text-xs text-gray-500 ml-6">Primary caregiver details</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500 w-1/2">Current Carer</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Sophea Sok</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Carer Gender</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Female</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Relationship to Client</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Mother</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Carer Phone</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">012 345 678</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Carer Address</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Phnom Penh, Cambodia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-500" /> School Information
          </h3>
          <p className="text-xs text-gray-500 ml-6">Current education status</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500 w-1/2">School Name</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {currentEducation?.schoolName || "Not Enrolled"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">School Grade</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {currentEducation?.currentLevel || "---"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Contact / Social Worker</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Mr. Chea / 098 765 432</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Info size={18} className="text-indigo-500" /> Other Information
          </h3>
          <p className="text-xs text-gray-500 ml-6">System identifiers and program durations</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500 w-1/2">Global Id</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.id || "---"}</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Time in NGO</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {client?.registerDate
                    ? `${Math.max(1, Math.floor((Date.now() - new Date(client.registerDate).getTime()) / (1000 * 60 * 60 * 24)))} Day(s)`
                    : "1 Day"}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-4 py-3 text-gray-500">Time in Program</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white leading-relaxed">
                  កម្មវិធីបណ្តុះបណ្តាល - Outreach: 0 Day<br />
                  កម្មវិធីបណ្តុះបណ្តាលតាមមណ្ឌល - Streetbased: 0 Day
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
