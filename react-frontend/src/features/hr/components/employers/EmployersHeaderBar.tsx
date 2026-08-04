import React from "react";
import { Button, Dropdown, DropdownItem } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { Plus, Filter, LayoutGrid, List } from "lucide-react";

interface Props {
  state: any;
}

export default function EmployersHeaderBar({ state }: Props) {
  const {
    t,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    resetForm,
    setIsModalOpen,
  } = state;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black dark:text-white tracking-tight">
            Partner Employers
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Manage corporate partnerships and placement sites
          </p>
        </div>
        <Button
          color="blue"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="rounded-md shadow-xl shadow-blue-500/20 px-4"
        >
          <Plus size={20} className="mr-2" /> Add New Employer
        </Button>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm relative z-30">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            placeholder="Search by company name, contact, or industry..."
            value={searchTerm}
            onChange={(val: any) => setSearchTerm(typeof val === "string" ? val : val?.target?.value || "")}
            containerClassName="flex-1"
          />
          <div className="flex items-center gap-2">
            {viewMode === "list" && (
              <Dropdown
                inline
                label={
                  <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer">
                    <Filter size={16} className="text-blue-500" />
                    <span className="font-bold hidden sm:block">Columns</span>
                  </div>
                }
                arrowIcon={false}
              >
                {["category", "contact", "phone", "status"].map((col) => (
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
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
