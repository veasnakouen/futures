import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Button, Dropdown } from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import { Search, Filter, Box, ArrowUpDown, ArrowUp, ArrowDown, LayoutGrid, List, Columns, Check } from "lucide-react";
import SearchInput from "@/components/common/SearchInput";

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
  // Loading State
  isLoading?: boolean;
  isFetching?: boolean;
  // Search
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  // Filters
  filters?: React.ReactNode;
  onFilterClick?: () => void;
  // Actions
  actions?: React.ReactNode;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  // View Modes
  enableViewToggle?: boolean;
  renderGridCard?: (item: T) => React.ReactNode;
  gridCols?: string;
  // Column Toggle
  enableColumnToggle?: boolean;
  // Footer
  footer?: React.ReactNode;
  // Sorting
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  // Empty State
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  isFetching = false,
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
  emptyMessage = "No records found.",
  emptyIcon = <Box size={24} className="text-gray-300" />,
}: DataTableProps<T>) {

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const toggleColumn = (key: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visibleColumns = columns.filter(col => !col.accessorKey || !hiddenColumns.has(String(col.accessorKey)));

  const renderSortIcon = (field?: string, isSortable?: boolean) => {
    if (!isSortable || !field || !onSort) return null;
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 opacity-30 inline-block" />;
    return sortDir === "asc" ? <ArrowUp size={12} className="ml-1 text-indigo-500 inline-block" /> : <ArrowDown size={12} className="ml-1 text-indigo-500 inline-block" />;
  };

  const hasTopBar = onSearchChange !== undefined || filters !== undefined || onFilterClick !== undefined || actions !== undefined || enableViewToggle || enableColumnToggle;

  return (
    <div className="w-full space-y-4">
      {hasTopBar && (
        <div className="flex flex-col md:flex-row gap-4 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-white/[0.05] shadow-sm items-center justify-between">
          <div className="flex flex-1 gap-2 flex-wrap items-center w-full">
            {onSearchChange !== undefined && (
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={onSearchChange}
                containerClassName="flex-1 min-w-[200px] max-w-sm"
              />
            )}

            {filters && (
              <div className="flex items-center gap-2">
                {filters}
              </div>
            )}

            {onFilterClick && (
              <Button
                color="gray"
                className="px-4 h-[42px] flex items-center justify-center border-none bg-white dark:bg-[#0d1117] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-md transition-colors shadow-sm"
                onClick={onFilterClick}
              >
                <Filter size={18} className="text-gray-500 dark:text-gray-400" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {actions}

            {enableColumnToggle && (
              <Dropdown
                inline
                arrowIcon={false}
                placement="bottom-end"
                label={
                  <div className="p-2.5 bg-white dark:bg-[#0d1117] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-md transition-colors shadow-sm border border-gray-100 dark:border-white/[0.05] cursor-pointer text-gray-500">
                    <Columns size={16} />
                  </div>
                }
              >
                <Dropdown.Header className="font-bold text-xs uppercase text-gray-500">Visible Columns</Dropdown.Header>
                {columns.map((col, i) => {
                  const key = String(col.accessorKey || i);
                  if (!col.accessorKey) return null; // Only toggleable if it has an accessor key
                  return (
                    <Dropdown.Item key={key} onClick={() => toggleColumn(key)}>
                      <div className="flex items-center justify-between w-full min-w-[150px]">
                        <span className="text-sm font-medium truncate">{col.header as React.ReactNode}</span>
                        {!hiddenColumns.has(key) && <Check size={14} className="text-emerald-500" />}
                      </div>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            )}

            {enableViewToggle && renderGridCard && (
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0 ml-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-50/50 dark:bg-indigo-900/20 overflow-hidden z-20 rounded-t-xl">
            <div className="h-full bg-indigo-500 w-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          </div>
        )}

        {viewMode === "list" ? (
          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#0d1117] shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none">
            <div className="overflow-x-auto">
              <Table hoverable className="border-none w-full text-left">
                <TableHead className="bg-gray-50/80 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.05]">
                  {visibleColumns.map((col, i) => (
                    <TableHeadCell
                      key={i}
                      className={`px-6 py-4 ${col.sortable ? 'cursor-pointer hover:text-indigo-500 transition-colors' : ''} ${col.className || ''}`}
                      onClick={() => {
                        if (col.sortable && col.accessorKey && onSort) {
                          onSort(String(col.accessorKey));
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {col.header}
                        {col.sortable && renderSortIcon(String(col.accessorKey), col.sortable)}
                      </div>
                    </TableHeadCell>
                  ))}
                </TableHead>
                <TableBody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, rowIndex) => (
                      <TableRow key={`skeleton-${rowIndex}`} className="animate-pulse bg-transparent">
                        {visibleColumns.map((col, colIndex) => (
                          <TableCell key={`skeleton-col-${colIndex}`} className={`px-6 py-4 ${col.className || ''}`}>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length} className="py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                          {emptyIcon}
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {emptyMessage}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item, rowIndex) => (
                      <TableRow
                        key={rowIndex}
                        className="bg-transparent hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group"
                      >
                        {visibleColumns.map((col, colIndex) => (
                          <TableCell key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                            {col.cell
                              ? col.cell(item)
                              : col.accessorKey
                                ? (item[col.accessorKey] as React.ReactNode)
                                : null}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${gridCols}`}>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 h-48 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
              ))
            ) : data.length === 0 ? (
              <div className="col-span-full py-24 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                  {emptyIcon}
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{emptyMessage}</p>
              </div>
            ) : (
              data.map((item, index) => (
                <React.Fragment key={index}>
                  {renderGridCard ? renderGridCard(item) : null}
                </React.Fragment>
              ))
            )}
          </div>
        )}

        {currentPage !== undefined && totalPages !== undefined && onPageChange && totalPages > 0 && (
          <div className={`mt-4 p-4 border border-gray-100 dark:border-white/[0.05] flex justify-center bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm`}>
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}

        {footer && (
          <div className="border-t border-gray-100 dark:border-white/[0.05]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
