import React from "react";
import { Users } from "lucide-react";

interface Props {
  state: any;
}

export default function ClientFamilyInfoTab({ state }: Props) {
  const { setIsFamilyModalOpen } = state;

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-pink-500" /> Family Members
            </h3>
            <p className="text-xs text-gray-500 ml-6">Registered relatives and dependents</p>
          </div>
          <button
            onClick={() => setIsFamilyModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            + Add Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                <th className="px-4 py-3 font-medium">Relationship</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Occupation</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Sophea Sok</td>
                <td className="px-4 py-4 text-gray-500">Mother</td>
                <td className="px-4 py-4 text-gray-500">45</td>
                <td className="px-4 py-4 text-gray-500">Vendor</td>
                <td className="px-4 py-4 text-gray-500">012 345 678</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-bold uppercase">
                    Primary Carer
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Vuthy Chea</td>
                <td className="px-4 py-4 text-gray-500">Father</td>
                <td className="px-4 py-4 text-gray-500">48</td>
                <td className="px-4 py-4 text-gray-500">Construction</td>
                <td className="px-4 py-4 text-gray-500">098 765 432</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md text-[10px] font-bold uppercase">
                    Relative
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Bopha Chea</td>
                <td className="px-4 py-4 text-gray-500">Sister</td>
                <td className="px-4 py-4 text-gray-500">14</td>
                <td className="px-4 py-4 text-gray-500">Student</td>
                <td className="px-4 py-4 text-gray-500">---</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md text-[10px] font-bold uppercase">
                    Dependent
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
