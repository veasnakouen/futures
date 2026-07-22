import React from "react";
import { Box, UserCheck, Archive, Shield } from "lucide-react";

interface AssetsMetricsBannerProps {
  totalAssets: number;
  assignedCount: number;
  availableCount: number;
}

export const AssetsMetricsBanner: React.FC<AssetsMetricsBannerProps> = ({
  totalAssets,
  assignedCount,
  availableCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-500">
          <Box size={24} />
        </div>
        <div>
          <h4 className="text-xl font-black dark:text-white uppercase">{totalAssets}</h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Inventory</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-500">
          <UserCheck size={24} />
        </div>
        <div>
          <h4 className="text-xl font-black dark:text-white uppercase">{assignedCount}</h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployed Assets</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-500">
          <Archive size={24} />
        </div>
        <div>
          <h4 className="text-xl font-black dark:text-white uppercase">{availableCount}</h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Stock</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-gray-500">
          <Shield size={24} />
        </div>
        <div>
          <h4 className="text-xl font-black dark:text-white uppercase">98.4%</h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Rate</p>
        </div>
      </div>
    </div>
  );
};

export default AssetsMetricsBanner;
