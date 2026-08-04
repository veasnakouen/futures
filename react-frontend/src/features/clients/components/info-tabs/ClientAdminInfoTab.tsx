import React from "react";
import { format } from "date-fns";
import { Shield } from "lucide-react";

interface Props {
  client: any;
}

export default function ClientAdminInfoTab({ client }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-amber-500" /> Administrative Records
            </h3>
            <p className="text-xs text-gray-500 ml-6">System and legal registration details</p>
          </div>
          <div className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
            Verified
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Registration Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {client?.registerDate ? format(new Date(client.registerDate), "PPP") : "Oct 12, 2025"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Assigned Social Worker</p>
            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">SC</div>
              Sarah Connor
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Branch Location</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{client?.branch || "Phnom Penh HQ"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">ID Poor Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Poor Level 1 (Valid until Dec 2027)</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">National ID</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">0123456789</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Intake Method</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Community Outreach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
