import React from "react";
import { format } from "date-fns";
import { Heart, AlertCircle, Activity } from "lucide-react";

interface Props {
  healthRecords: any[];
  state: any;
}

export default function ClientHealthInfoTab({ healthRecords, state }: Props) {
  const { setIsHealthModalOpen } = state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart size={18} className="text-rose-500" /> Vital Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 font-medium">Blood Type</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded">
                {healthRecords.length > 0 ? healthRecords[0].bloodType : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 font-medium">Height</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {healthRecords.length > 0 && healthRecords[0].height ? `${healthRecords[0].height} cm` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 font-medium">Weight</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {healthRecords.length > 0 && healthRecords[0].weight ? `${healthRecords[0].weight} kg` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Last Checkup</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {healthRecords.length > 0 && healthRecords[0].lastCheckupDate
                  ? format(new Date(healthRecords[0].lastCheckupDate), "dd MMM yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 p-6 flex items-start gap-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg shrink-0">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900 dark:text-red-400 mb-1">Known Allergies</h4>
            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
              {healthRecords.length > 0 && healthRecords[0].allergies
                ? healthRecords[0].allergies
                : "No known allergies."}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
          <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-teal-500" /> Medical History
            </h3>
            <button
              onClick={() => setIsHealthModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              + Add Record
            </button>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-teal-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Annual Vaccination</h4>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    Nov 2025
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Administered standard flu shot and updated tetanus booster at Kantha Bopha Hospital.
                </p>
              </div>
            </div>
            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dental Checkup</h4>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    Aug 2025
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Routine cleaning. Two minor cavities filled. Next appointment in 6 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
