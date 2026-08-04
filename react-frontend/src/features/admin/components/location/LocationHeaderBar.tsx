import React from "react";
import { UploadCloud } from "lucide-react";

interface Props {
  state: any;
}

export default function LocationHeaderBar({ state }: Props) {
  const { t, setShowJsonModal } = state;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("locationManagement")}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Manage provinces, districts, communes, and villages or import JSON bulk hierarchy.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowJsonModal(true)}
        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
      >
        <UploadCloud size={16} /> Upload Location JSON (.json)
      </button>
    </div>
  );
}
