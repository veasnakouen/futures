import React, { useState, useMemo } from "react";
import { Badge } from "@/lib/flowbite-compat";
import {
  ChevronDown,
  ChevronsUpDown,
  Cpu,
  Smartphone,
  Monitor,
  MousePointer2,
  HardDrive,
  Box,
  Layers,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Plus,
} from "lucide-react";
import AssetGridCard, { getAssetIcon } from "./AssetGridCard";

interface AssetAccordionViewProps {
  assets: any[];
  assetCategories: string[];
  onProcessReturn: (asset: any) => void;
  onOpenAssign: (asset: any) => void;
  onGenerateLabel: (asset: any) => void;
  onOpenDetails: (asset: any) => void;
  onOpenEdit: (asset: any) => void;
  onDelete: (id: number) => void;
  onOpenRegister?: () => void;
}

export const getCategoryTheming = (type: string) => {
  switch (type?.toLowerCase()) {
    case "laptop":
      return {
        bgLight: "bg-blue-50 dark:bg-blue-900/20",
        borderLight: "border-blue-200/60 dark:border-blue-800/50",
        textLight: "text-blue-600 dark:text-blue-400",
        icon: <Cpu size={20} className="text-blue-600 dark:text-blue-400" />,
        gradient: "from-blue-600 to-indigo-600",
      };
    case "mobile":
    case "smartphone":
      return {
        bgLight: "bg-purple-50 dark:bg-purple-900/20",
        borderLight: "border-purple-200/60 dark:border-purple-800/50",
        textLight: "text-purple-600 dark:text-purple-400",
        icon: <Smartphone size={20} className="text-purple-600 dark:text-purple-400" />,
        gradient: "from-purple-600 to-pink-600",
      };
    case "monitor":
      return {
        bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
        borderLight: "border-emerald-200/60 dark:border-emerald-800/50",
        textLight: "text-emerald-600 dark:text-emerald-400",
        icon: <Monitor size={20} className="text-emerald-600 dark:text-emerald-400" />,
        gradient: "from-emerald-600 to-teal-600",
      };
    case "peripherals":
      return {
        bgLight: "bg-amber-50 dark:bg-amber-900/20",
        borderLight: "border-amber-200/60 dark:border-amber-800/50",
        textLight: "text-amber-600 dark:text-amber-400",
        icon: <MousePointer2 size={20} className="text-amber-600 dark:text-amber-400" />,
        gradient: "from-amber-600 to-orange-600",
      };
    case "server":
      return {
        bgLight: "bg-rose-50 dark:bg-rose-900/20",
        borderLight: "border-rose-200/60 dark:border-rose-800/50",
        textLight: "text-rose-600 dark:text-rose-400",
        icon: <HardDrive size={20} className="text-rose-600 dark:text-rose-400" />,
        gradient: "from-rose-600 to-red-600",
      };
    default:
      return {
        bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
        borderLight: "border-cyan-200/60 dark:border-cyan-800/50",
        textLight: "text-cyan-600 dark:text-cyan-400",
        icon: <Box size={20} className="text-cyan-600 dark:text-cyan-400" />,
        gradient: "from-cyan-600 to-blue-600",
      };
  }
};

export const AssetAccordionView: React.FC<AssetAccordionViewProps> = ({
  assets,
  assetCategories,
  onProcessReturn,
  onOpenAssign,
  onGenerateLabel,
  onOpenDetails,
  onOpenEdit,
  onDelete,
  onOpenRegister,
}) => {
  // Group assets by category
  const groupedAssets = useMemo(() => {
    const map = new Map<string, any[]>();

    // Initialize all existing categories
    assetCategories.forEach((cat) => {
      map.set(cat, []);
    });
    if (!map.has("Other")) {
      map.set("Other", []);
    }

    // Populate assets
    assets.forEach((asset) => {
      const cat = asset.assetType || "Other";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(asset);
    });

    return map;
  }, [assets, assetCategories]);

  // Categories list, ordered: populated categories first, then by name
  const categoriesList = useMemo(() => {
    const list = Array.from(groupedAssets.keys());
    return list.sort((a, b) => {
      const countA = (groupedAssets.get(a) || []).length;
      const countB = (groupedAssets.get(b) || []).length;
      if (countA > 0 && countB === 0) return -1;
      if (countA === 0 && countB > 0) return 1;
      return a.localeCompare(b);
    });
  }, [groupedAssets]);

  // State to track open/closed accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categoriesList.forEach((cat) => {
      // Open all categories by default
      initial[cat] = true;
    });
    return initial;
  });

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const expandAll = () => {
    const updated: Record<string, boolean> = {};
    categoriesList.forEach((cat) => {
      updated[cat] = true;
    });
    setOpenSections(updated);
  };

  const collapseAll = () => {
    const updated: Record<string, boolean> = {};
    categoriesList.forEach((cat) => {
      updated[cat] = false;
    });
    setOpenSections(updated);
  };

  const areAllExpanded = useMemo(() => {
    return categoriesList.length > 0 && categoriesList.every((cat) => openSections[cat]);
  }, [categoriesList, openSections]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Master Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-xl">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">
              Grouped Category Clusters
            </h3>
            <p className="text-[10px] font-bold text-gray-400">
              {categoriesList.length} classification groups • {assets.length} total active nodes
            </p>
          </div>
        </div>

        <button
          onClick={areAllExpanded ? collapseAll : expandAll}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700 transition-all cursor-pointer"
        >
          <ChevronsUpDown size={14} className="text-blue-600" />
          {areAllExpanded ? "Collapse All Groups" : "Expand All Groups"}
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {categoriesList.map((category) => {
          const categoryAssets = groupedAssets.get(category) || [];
          const isOpen = !!openSections[category];
          const theming = getCategoryTheming(category);

          const availableCount = categoryAssets.filter(
            (a) => a.status === "Available" || !a.status
          ).length;
          const assignedCount = categoryAssets.filter((a) => a.status === "Assigned").length;
          const maintenanceCount = categoryAssets.filter(
            (a) => a.status === "Maintenance" || a.status === "Decommissioned"
          ).length;

          return (
            <div
              key={category}
              className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/70 shadow-sm overflow-hidden transition-all duration-300 hover:border-gray-200 dark:hover:border-gray-600"
            >
              {/* Accordion Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(category)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-750 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Category Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${theming.bgLight} ${theming.borderLight} border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 ${
                      isOpen ? "scale-105" : ""
                    }`}
                  >
                    {theming.icon}
                  </div>

                  {/* Title & Stats */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm sm:text-base font-black dark:text-white uppercase tracking-tight truncate">
                        {category}
                      </h4>
                      <Badge
                        color={categoryAssets.length > 0 ? "blue" : "gray"}
                        className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
                      >
                        {categoryAssets.length} {categoryAssets.length === 1 ? "Node" : "Nodes"}
                      </Badge>
                    </div>

                    {/* Quick Metric Pills */}
                    {categoryAssets.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {availableCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                            <CheckCircle2 size={10} /> {availableCount} Stock
                          </span>
                        )}
                        {assignedCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                            <UserCheck size={10} /> {assignedCount} Deployed
                          </span>
                        )}
                        {maintenanceCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/50">
                            <AlertCircle size={10} /> {maintenanceCount} Service
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Arrow Indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/80 flex items-center justify-center text-gray-500 dark:text-gray-300 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-blue-50 dark:bg-blue-900/40 text-blue-600" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </button>

              {/* Accordion Content Panel */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[5000px] opacity-100 border-t border-gray-100 dark:border-gray-700/60" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-850/40">
                  {categoryAssets.length === 0 ? (
                    <div className="py-8 px-4 text-center rounded-xl bg-white/60 dark:bg-gray-800/60 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <p className="text-xs font-bold text-gray-400 mb-2">
                        No active hardware records registered under &quot;{category}&quot;
                      </p>
                      {onOpenRegister && (
                        <button
                          type="button"
                          onClick={onOpenRegister}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus size={14} /> Register Node in {category}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {categoryAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="transform transition-all duration-200 hover:-translate-y-1"
                        >
                          <AssetGridCard
                            asset={asset}
                            onProcessReturn={onProcessReturn}
                            onOpenAssign={onOpenAssign}
                            onGenerateLabel={onGenerateLabel}
                            onOpenDetails={onOpenDetails}
                            onOpenEdit={onOpenEdit}
                            onDelete={onDelete}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetAccordionView;
