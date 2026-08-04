import React, { useState } from "react";
import { Box, UserCheck, Archive, Shield, ChevronDown, Activity, Sparkles } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const deploymentRate = totalAssets > 0 ? Math.round((assignedCount / totalAssets) * 100) : 0;

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs p-4 transition-all duration-300">
      {/* Header Bar with Accordion Toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Hardware Fleet Telemetry & Summary
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <span>{isExpanded ? "Hide Metrics" : "Show Metrics"}</span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Collapsible Cards Grid */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          {/* Card 1: Total Inventory */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs flex items-center gap-4 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <Box size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                {totalAssets}
              </h4>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Total Inventory
              </p>
            </div>
          </div>

          {/* Card 2: Deployed Assets */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs flex items-center gap-4 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <UserCheck size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                {assignedCount}
              </h4>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Deployed Nodes
              </p>
            </div>
          </div>

          {/* Card 3: Available Stock */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs flex items-center gap-4 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <Archive size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                {availableCount}
              </h4>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Available Stock
              </p>
            </div>
          </div>

          {/* Card 4: Compliance & Fleet Health */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xs flex items-center gap-4 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="p-3.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                  {deploymentRate}%
                </h4>
                <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400">
                  Fleet Utl.
                </span>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Operational Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsMetricsBanner;

