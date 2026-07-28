import React from "react";
import SearchInput from "@/components/common/SearchInput";
import { Filter, LayoutGrid, List, Columns, Check } from "lucide-react";
import { Button, Dropdown } from "@/lib/flowbite-compat";

interface DataTableHeaderToolbarProps<T> {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onFilterClick?: () => void;
  actions?: React.ReactNode;
  enableViewToggle?: boolean;
  viewMode: "TABLE" | "GRID";
  setViewMode: (mode: "TABLE" | "GRID") => void;
  enableColumnToggle?: boolean;
  columns: any[];
  hiddenColumns: Set<string>;
  toggleColumn: (key: string) => void;
}

export function DataTableHeaderToolbar<T>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFilterClick,
  actions,
  enableViewToggle,
  viewMode,
  setViewMode,
  enableColumnToggle,
  columns,
  hiddenColumns,
  toggleColumn,
}: DataTableHeaderToolbarProps<T>) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-4">
      <div className="flex flex-1 items-center gap-3">
        {onSearchChange && (
          <div className="w-full max-w-sm">
            <SearchInput
              value={searchQuery || ""}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
        )}

        {filters && <div className="flex items-center gap-2">{filters}</div>}

        {onFilterClick && !filters && (
          <Button color="gray" size="sm" onClick={onFilterClick} className="font-bold text-xs">
            <Filter size={14} className="mr-1.5" /> Filter
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {enableColumnToggle && (
          <Dropdown
            label={<div className="p-2 rounded-lg border bg-white dark:bg-gray-800 text-xs font-bold flex items-center gap-1.5"><Columns size={14} /> Columns</div>}
            inline
            arrowIcon={false}
          >
            <div className="p-2 space-y-1 text-xs">
              {columns.map((col, idx) => {
                const key = (col.accessorKey as string) || (typeof col.header === "string" ? col.header : `col-${idx}`);
                const isVisible = !hiddenColumns.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleColumn(key)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  >
                    <span>{typeof col.header === "string" ? col.header : `Column ${idx + 1}`}</span>
                    {isVisible && <Check size={14} className="text-emerald-500 ml-2" />}
                  </button>
                );
              })}
            </div>
          </Dropdown>
        )}

        {enableViewToggle && (
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border">
            <button
              type="button"
              onClick={() => setViewMode("TABLE")}
              className={`p-1.5 rounded-md ${viewMode === "TABLE" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-400"}`}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("GRID")}
              className={`p-1.5 rounded-md ${viewMode === "GRID" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-400"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        )}

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
