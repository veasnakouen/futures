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

      {viewMode === "TABLE" ? (
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
      ) : (
        <DataTableViewGrid
          data={data}
          renderGridCard={renderGridCard}
          gridCols={gridCols}
          emptyMessage={emptyMessage}
        />
      )}

      {footer && <div>{footer}</div>}

      {totalPages && totalPages > 1 && onPageChange && (
        <ModernPagination
          currentPage={currentPage || 1}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

export default DataTable;
