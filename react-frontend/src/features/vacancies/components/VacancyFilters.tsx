import React from "react";
import { Search, X, Filter, LayoutGrid, List } from "lucide-react";
import { Dropdown, DropdownItem } from '@/lib/flowbite-compat';

interface VacancyFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  gridDensity: "large" | "medium" | "compact";
  setGridDensity: React.Dispatch<
    React.SetStateAction<"large" | "medium" | "compact">
  >;
}

const VacancyFilters: React.FC<VacancyFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  visibleColumns,
  setVisibleColumns,
  gridDensity,
  setGridDensity,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30 mb-4 border border-gray-100 dark:border-gray-700/50">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
            size={18}
          />
          <input
            type="text"
            placeholder="Search vacancies, companies, or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-2.5 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "list" && (
            <Dropdown
              inline
              label={
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                  <Filter size={16} className="text-blue-500" />
                  <span className="font-bold hidden sm:block">Columns</span>
                </div>
              }
              arrowIcon={false}
            >
              {["salary", "deadline", "status"].map((col) => (
                <DropdownItem
                  key={col}
                  onClick={() =>
                    setVisibleColumns((prev) =>
                      prev.includes(col)
                        ? prev.filter((c) => c !== col)
                        : [...prev, col],
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="capitalize text-xs font-bold">{col}</span>
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
          )}
          {viewMode === "grid" && (
            <Dropdown
              inline
              label={
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                  <LayoutGrid size={16} className="text-indigo-500" />
                  <span className="font-bold hidden sm:block">Grid Size</span>
                </div>
              }
              arrowIcon={false}
            >
              <DropdownItem
                onClick={() => setGridDensity("large")}
                className={
                  gridDensity === "large"
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                    : ""
                }
              >
                Large (3 per row)
              </DropdownItem>
              <DropdownItem
                onClick={() => setGridDensity("medium")}
                className={
                  gridDensity === "medium"
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                    : ""
                }
              >
                Medium (4 per row)
              </DropdownItem>
              <DropdownItem
                onClick={() => setGridDensity("compact")}
                className={
                  gridDensity === "compact"
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold"
                    : ""
                }
              >
                Compact (5 per row)
              </DropdownItem>
            </Dropdown>
          )}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List View"
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyFilters;
