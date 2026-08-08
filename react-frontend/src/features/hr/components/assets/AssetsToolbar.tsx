import React from "react";
import { Button, Dropdown, DropdownItem } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { LayoutGrid, List, Download, SlidersHorizontal, Plus, Layers, Filter, ChevronDown } from "lucide-react";

interface AssetsToolbarProps {
  viewMode: "GRID" | "TABLE";
  setViewMode: (mode: "GRID" | "TABLE") => void;
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
      {/* 2-Mode View Switcher */}
      <div className="relative flex shrink-0 bg-gray-100/80 dark:bg-gray-900/60 p-1 rounded-xl w-24 shadow-inner">
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
        <div className="relative inline-block text-left">
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button
                className="flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs h-10 px-4 font-black text-gray-700 dark:text-gray-200 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm w-44"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{typeFilter}</span>
                </div>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>
            )}
            theme={{
              floating: {
                base: "z-50 w-48 focus:outline-none shadow-2xl rounded-2xl overflow-hidden",
                style: {
                  auto: "border-none rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white p-1.5 mt-2",
                },
              },
            }}
          >
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {assetTypes.map((t) => (
                <DropdownItem
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-xl mb-1 flex items-center justify-between px-3 py-2 transition-all ${
                    typeFilter === t 
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-semibold"
                  }`}
                >
                  {t}
                  {typeFilter === t && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400"></div>}
                </DropdownItem>
              ))}
            </div>
          </Dropdown>
        </div>

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
