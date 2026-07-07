import React, { useState } from "react";
import {
  Search,
  X,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {Dropdown, DropdownItem} from '@/lib/flowbite-compat';

interface ClientFiltersProps {
  filters: { search: string; branch: string; status: string };
  setFilters: (filters: any) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  itemsPerRow: string;
  setItemsPerRow: (size: string) => void;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  visibleColumns,
  setVisibleColumns,
  itemsPerRow,
  setItemsPerRow,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30 mb-4 transition-all">
      <div className="flex flex-col gap-3">
        {/* Top Row: Search & Toggle */}
        <div className="flex gap-3 items-center w-full">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
              size={18}
            />
            <input
              type="text"
              placeholder="Search name or registration code..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-12 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-inner"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all text-sm font-bold shadow-sm ${isExpanded ?"bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400":"bg-white dark:bg-gray-800  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
          >
            <Filter
              size={16}
              className={
                isExpanded
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500"
              }
            />
            <span className="hidden sm:inline">Filters & View</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Accordion Content */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${isExpanded ?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 pt-3 mt-1 border-t">
              <select
                value={filters.branch}
                onChange={(e) =>
                  setFilters({ ...filters, branch: e.target.value })
                }
                className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2.5 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest min-w-[140px]"
              >
                <option value="">All Branches</option>
                <option value="Phnom Penh">Phnom Penh</option>
                <option value="Battambang">Battambang</option>
                <option value="Siem Reap">Siem Reap</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2.5 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>

              <div className="flex items-center gap-2 border-l pl-3">
                {viewMode === "list" && (
                  <Dropdown
                    inline
                    label={
                      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                        <Filter size={16} className="text-blue-500" />
                        <span className="font-bold hidden sm:block">
                          Columns
                        </span>
                      </div>
                    }
                    arrowIcon={false}
                  >
                    {["clientCode", "branch", "status"].map((col) => (
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
                          <span className="capitalize text-xs font-bold">
                            {col === "clientCode" ? "Registration Code" : col}
                          </span>
                        </div>
                      </DropdownItem>
                    ))}
                  </Dropdown>
                )}
                {viewMode === "grid" && (
                  <div className="flex-shrink-0">
                    <select
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      value={itemsPerRow}
                      onChange={(e) => setItemsPerRow(e.target.value)}
                    >
                      <option value="3">3 per row</option>
                      <option value="4">4 per row</option>
                      <option value="5">5 per row</option>
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1 shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                    className={`p-2 rounded-md transition-all ${viewMode ==="grid"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="List View"
                    className={`p-2 rounded-md transition-all ${viewMode ==="list"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFilters;
