import React, { useState } from "react";
import ModernPagination from "@/components/common/ModernPagination";
import { DataTableHeaderToolbar } from "./datatable/DataTableHeaderToolbar";
import { DataTableViewTable } from "./datatable/DataTableViewTable";
import { DataTableViewGrid } from "./datatable/DataTableViewGrid";

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isFetching?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  onFilterClick?: () => void;
  actions?: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  enableViewToggle?: boolean;
  renderGridCard?: (item: T) => React.ReactNode;
  gridCols?: string;
  onGridColsChange?: (cols: string) => void;
  enableColumnToggle?: boolean;
  footer?: React.ReactNode;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  [key: string]: any;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = "Search...",
  searchQuery,
  onSearchChange,
  filters,
  onFilterClick,
  actions,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  enableViewToggle = false,
  renderGridCard,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  enableColumnToggle = false,
  footer,
  sortField,
  sortDir,
  onSort,
  emptyMessage = "No matching records found.",
  emptyIcon,
}: DataTableProps<T>) {
  const [viewMode, setViewMode] = useState<"TABLE" | "GRID">("TABLE");
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <DataTableHeaderToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFilterClick={onFilterClick}
        actions={actions}
        enableViewToggle={enableViewToggle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        enableColumnToggle={enableColumnToggle}
        columns={columns}
        hiddenColumns={hiddenColumns}
        toggleColumn={toggleColumn}
      />

      <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800/60 flex flex-col overflow-hidden animate-slide-up h-[calc(100vh-230px)] min-h-[500px]">
        {viewMode === "TABLE" ? (
          <div className="flex-1 overflow-auto w-full relative">
            <DataTableViewTable
              data={data}
              columns={columns}
              hiddenColumns={hiddenColumns}
              isLoading={isLoading}
              sortField={sortField}
              sortDir={sortDir}
              onSort={onSort}
              emptyMessage={emptyMessage}
              emptyIcon={emptyIcon}
            />
          </div>
        ) : (
          <div className="p-6">
            <DataTableViewGrid
              data={data}
              renderGridCard={renderGridCard}
              gridCols={gridCols}
              emptyMessage={emptyMessage}
            />
          </div>
        )}

        {/* Unified Footer & Pagination */}
        {(footer || onPageChange) && (
          <div className="p-4 bg-gray-50/50 dark:bg-gray-800/80 border-t border-gray-100/80 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">{footer}</div>
            
            {onPageChange && (
              <div className="shrink-0">
                <ModernPagination
                  currentPage={currentPage || 1}
                  totalPages={totalPages || Math.max(1, Math.ceil((totalItems ?? data.length) / (pageSize || 10)))}
                  onPageChange={onPageChange}
                  totalItems={totalItems ?? data.length}
                  pageSize={pageSize || 10}
                  onPageSizeChange={onPageSizeChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
