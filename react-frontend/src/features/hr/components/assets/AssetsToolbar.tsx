import React from "react";
import { Button } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { LayoutGrid, List, Download, SlidersHorizontal, Plus, Layers } from "lucide-react";

interface AssetsToolbarProps {
  viewMode: "ACCORDION" | "GRID" | "TABLE";
  setViewMode: (mode: "ACCORDION" | "GRID" | "TABLE") => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  assetTypes: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  onOpenCategories: () => void;
  onOpenRegister: () => void;
}

export const AssetsToolbar: React.FC<AssetsToolbarProps> = ({
  viewMode,
  setViewMode,
  typeFilter,
  setTypeFilter,
  assetTypes,
  searchQuery,
  setSearchQuery,
  onExport,
  onOpenCategories,
  onOpenRegister,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700">
      {/* 3-Mode View Switcher */}
      <div className="relative flex shrink-0 bg-gray-100/80 dark:bg-gray-900/60 p-1 rounded-xl w-36 shadow-inner">
        <button
          onClick={() => setViewMode("ACCORDION")}
          title="Grouped Accordion View"
          className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === "ACCORDION"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-bold scale-100"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <Layers size={16} />
        </button>
        <button
          onClick={() => setViewMode("GRID")}
          title="Card Grid View"
          className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === "GRID"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-bold scale-100"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => setViewMode("TABLE")}
          title="Table / List View"
          className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === "TABLE"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-bold scale-100"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <List size={16} />
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 flex-1 justify-end">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-xs h-10 px-3 font-bold"
        >
          {assetTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <SearchInput
          placeholder="Search assets or serial..."
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          containerClassName="sm:w-48"
        />

        <div className="flex items-center gap-2">
          <Button color="light" size="sm" onClick={onExport} className="h-10 text-xs font-bold">
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button color="light" size="sm" onClick={onOpenCategories} className="h-10 text-xs font-bold">
            <SlidersHorizontal size={14} className="mr-1" /> Categories
          </Button>
          <Button color="blue" size="sm" onClick={onOpenRegister} className="h-10 text-xs font-black uppercase tracking-widest">
            <Plus size={16} className="mr-1" /> Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetsToolbar;
