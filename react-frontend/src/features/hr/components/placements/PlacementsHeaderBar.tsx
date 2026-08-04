import React from "react";
import { Button, Dropdown, DropdownItem } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { Briefcase, Plus, Filter, LayoutGrid, List, Building, DollarSign } from "lucide-react";

interface Props {
  state: any;
}

export default function PlacementsHeaderBar({ state }: Props) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    handleOpenModal,
    stats,
    totalElements,
    placements,
  } = state;

  const totalPlacements = stats?.totalPlacements || totalElements;
  const activeRoles =
    stats?.statusDistribution?.find((s: any) => s.name === "Active")?.value ||
    placements.filter((p: any) => p.status === "Active").length;
  const avgSalary =
    "$" +
    (
      placements.reduce((acc: any, curr: any) => acc + (parseFloat(curr.salary) || 0), 0) /
      (placements.length || 1)
    ).toFixed(2);

  return (
    <div className="space-y-6">
      <header className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-md shadow-xl shadow-indigo-500/20">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">
              Placement Registry
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
              Synchronizing Nodes...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="blue"
            onClick={() => handleOpenModal()}
            className="rounded-md shadow-lg shadow-blue-500/20 px-6 h-12 bg-indigo-600 hover:bg-indigo-700 border-none transition-all active:scale-95 font-black uppercase tracking-widest text-[9px]"
          >
            <Plus size={18} className="mr-2" /> Record Placement
          </Button>
        </div>
      </header>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Placements</p>
            <h3 className="text-2xl font-black dark:text-white">{totalPlacements}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
            <Building size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Roles</p>
            <h3 className="text-2xl font-black dark:text-white">{activeRoles}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avg Salary</p>
            <h3 className="text-2xl font-black dark:text-white">{avgSalary}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30">
        <div className="flex flex-col xl:flex-row gap-4">
          <SearchInput
            placeholder="Search company or candidate..."
            value={searchQuery}
            onChange={(val: any) => setSearchQuery(typeof val === "string" ? val : val?.target?.value || "")}
            containerClassName="flex-1"
          />
          <div className="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2.5 outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest min-w-[140px]"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Resigned</option>
              <option>Terminated</option>
            </select>
            <div className="flex items-center gap-2 border-l pl-3">
              {viewMode === "list" && (
                <Dropdown
                  inline
                  label={
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                      <Filter size={16} className="text-blue-500" />
                      <span className="font-bold hidden sm:block">Columns</span>
                    </div>
                  }
                  arrowIcon={false}
                >
                  {["commencement", "compensatory", "status"].map((col) => (
                    <DropdownItem
                      key={col}
                      onClick={() =>
                        setVisibleColumns((prev: string[]) =>
                          prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
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
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
