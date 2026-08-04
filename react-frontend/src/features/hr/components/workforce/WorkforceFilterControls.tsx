import React from "react";
import { Button, TextInput, Select } from "@/lib/flowbite-compat";
import { Building, Search, LayoutGrid, List, Columns, Plus } from "lucide-react";

interface Props {
  state: any;
}

export default function WorkforceFilterControls({ state }: Props) {
  const {
    search,
    setSearch,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    layoutMode,
    setLayoutMode,
    showColumnToggle,
    setShowColumnToggle,
    visibleCols,
    setVisibleCols,
    setCurrentPage,
    onAddEmployee,
  } = state;

  return (
    <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 space-y-3">
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Building size={20} className="text-blue-600" />
          <h4 className="font-black text-base uppercase tracking-tight dark:text-white">Workforce Directory</h4>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
          {/* Search Input */}
          <div className="w-56 relative">
            <TextInput
              sizing="sm"
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              icon={Search}
              className="text-xs"
            />
          </div>

          {/* Department Filter */}
          <div className="w-40">
            <Select
              className="text-xs"
              value={departmentFilter}
              onChange={(e: any) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Depts</option>
              <option value="Engineering">Engineering & IT</option>
              <option value="Operations">Operations</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Medical">Medical & Health</option>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-32">
            <Select
              className="text-xs"
              value={statusFilter}
              onChange={(e: any) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Searching">Searching</option>
              <option value="Leave">On Leave</option>
            </Select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl border border-gray-200/60 dark:border-gray-700">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === "grid"
                  ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayoutMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === "table"
                  ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Column Toggle Dropdown */}
          {layoutMode === "table" && (
            <div className="relative">
              <button
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                className="p-2 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200/60 dark:border-gray-700 flex items-center gap-1.5 text-xs font-bold"
              >
                <Columns size={14} />
                <span>Cols</span>
              </button>

              {showColumnToggle && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-3 z-30 space-y-2 text-xs">
                  <p className="font-black text-gray-400 uppercase tracking-widest text-[9px] border-b pb-1">
                    Toggle Columns
                  </p>
                  {Object.keys(visibleCols).map((colKey) => (
                    <label
                      key={colKey}
                      className="flex items-center gap-2 font-bold cursor-pointer dark:text-gray-200 uppercase text-[10px]"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols[colKey]}
                        onChange={(e) =>
                          setVisibleCols((prev: any) => ({ ...prev, [colKey]: e.target.checked }))
                        }
                        className="rounded text-blue-600"
                      />
                      {colKey}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {onAddEmployee && (
            <Button
              color="blue"
              size="xs"
              onClick={onAddEmployee}
              className="font-black uppercase text-[10px] tracking-wider rounded-xl shadow-xs py-2"
            >
              <Plus size={14} className="mr-1" /> Onboard Staff
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
