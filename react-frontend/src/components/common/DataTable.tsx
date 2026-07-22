import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Dropdown,
} from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import {
  Search,
  Filter,
  Box,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  Columns,
  Check,
  Grid,
} from "lucide-react";
import SearchInput from "@/components/common/SearchInput";
import { motion, AnimatePresence } from "framer-motion";

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
  onGridColsChange?: (cols: string) => void;
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
  onGridColsChange,
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
  const [activeGridCols, setActiveGridCols] = useState(gridCols);

  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visibleColumns = columns.filter(
    (col) => !col.accessorKey || !hiddenColumns.has(String(col.accessorKey))
  );

  const renderSortIcon = (field?: string, isSortable?: boolean) => {
    if (!isSortable || !field || !onSort) return null;
    if (sortField !== field)
      return <ArrowUpDown size={12} className="ml-1 opacity-30 inline-block" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="ml-1 text-indigo-500 inline-block" />
    ) : (
      <ArrowDown size={12} className="ml-1 text-indigo-500 inline-block" />
    );
  };

  const hasTopBar =
    onSearchChange !== undefined ||
    filters !== undefined ||
    onFilterClick !== undefined ||
    actions !== undefined ||
    enableViewToggle ||
    enableColumnToggle;

  const gridOptions = [
    { label: "2 Columns", value: "grid-cols-1 md:grid-cols-2" },
    { label: "3 Columns", value: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" },
    { label: "4 Columns", value: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" },
    { label: "6 Columns", value: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top Filter & View Controls Bar */}
      {hasTopBar && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col md:flex-row gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-3 rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm items-center justify-between"
        >
          <div className="flex flex-1 gap-2 flex-wrap items-center w-full">
            {onSearchChange !== undefined && (
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={onSearchChange}
                containerClassName="flex-1 min-w-[220px] max-w-md"
              />
            )}

            {filters && <div className="flex items-center gap-2">{filters}</div>}

            {onFilterClick && (
              <Button
                color="gray"
                className="px-4 h-[42px] flex items-center justify-center border-none bg-white dark:bg-[#0d1117] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-xl transition-colors shadow-sm"
                onClick={onFilterClick}
              >
                <Filter size={18} className="text-gray-500 dark:text-gray-400" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            {actions}

            {/* Column Toggle Selector - Shown ONLY when in List View */}
            {enableColumnToggle && viewMode === "list" && (
              <Dropdown
                inline
                arrowIcon={false}
                placement="bottom-end"
                label={
                  <div className="p-2.5 bg-white dark:bg-[#0d1117] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-xl transition-colors shadow-sm border border-gray-100 dark:border-white/[0.05] cursor-pointer text-gray-500 dark:text-gray-300 flex items-center gap-1.5 text-xs font-bold">
                    <Columns size={16} />
                    <span className="hidden sm:inline">Columns</span>
                  </div>
                }
              >
                <Dropdown.Header className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Visible Columns
                </Dropdown.Header>
                {columns.map((col, i) => {
                  const key = String(col.accessorKey || i);
                  if (!col.accessorKey) return null;
                  return (
                    <Dropdown.Item key={key} onClick={() => toggleColumn(key)}>
                      <div className="flex items-center justify-between w-full min-w-[160px] py-0.5">
                        <span className="text-xs font-bold truncate">
                          {col.header as React.ReactNode}
                        </span>
                        {!hiddenColumns.has(key) && (
                          <Check size={14} className="text-emerald-500 font-bold ml-2" />
                        )}
                      </div>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown>
            )}

            {/* Grid Density Selector - Shown ONLY when in Grid View */}
            {enableViewToggle && viewMode === "grid" && (
              <Dropdown
                inline
                arrowIcon={false}
                placement="bottom-end"
                label={
                  <div className="p-2.5 bg-white dark:bg-[#0d1117] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-xl transition-colors shadow-sm border border-gray-100 dark:border-white/[0.05] cursor-pointer text-gray-500 dark:text-gray-300 flex items-center gap-1.5 text-xs font-bold">
                    <Grid size={16} />
                    <span className="hidden sm:inline">Grid Density</span>
                  </div>
                }
              >
                <Dropdown.Header className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Grid Columns
                </Dropdown.Header>
                {gridOptions.map((opt) => (
                  <Dropdown.Item
                    key={opt.value}
                    onClick={() => {
                      setActiveGridCols(opt.value);
                      if (onGridColsChange) onGridColsChange(opt.value);
                    }}
                  >
                    <div className="flex items-center justify-between w-full min-w-[140px] text-xs font-bold">
                      <span>{opt.label}</span>
                      {activeGridCols === opt.value && (
                        <Check size={14} className="text-indigo-600 font-bold" />
                      )}
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            )}

            {/* Grid / List View Toggle Pills */}
            {enableViewToggle && renderGridCard && (
              <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl shrink-0 ml-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                  title="Table List View"
                >
                  <List size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Table / Grid Content */}
      <div className="relative">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-50/50 dark:bg-indigo-900/20 overflow-hidden z-20 rounded-t-xl">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#0d1117] shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none"
            >
              <div className="overflow-x-auto">
                <Table hoverable className="border-none w-full text-left">
                  <TableHead className="bg-gray-50/80 dark:bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.05]">
                    {visibleColumns.map((col, i) => (
                      <TableHeadCell
                        key={i}
                        className={`px-6 py-4 ${
                          col.sortable
                            ? "cursor-pointer hover:text-indigo-600 transition-colors select-none"
                            : ""
                        } ${col.className || ""}`}
                        onClick={() => {
                          if (col.sortable && col.accessorKey && onSort) {
                            onSort(String(col.accessorKey));
                          }
                        }}
                      >
                        <div className="flex items-center">
                          {col.header}
                          {col.sortable &&
                            renderSortIcon(String(col.accessorKey), col.sortable)}
                        </div>
                      </TableHeadCell>
                    ))}
                  </TableHead>
                  <TableBody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={`skeleton-${rowIndex}`} className="animate-pulse bg-transparent">
                          {visibleColumns.map((col, colIndex) => (
                            <TableCell key={`skeleton-col-${colIndex}`} className={`px-6 py-4 ${col.className || ""}`}>
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
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            {emptyMessage}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((item, rowIndex) => (
                        <motion.tr
                          key={rowIndex}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: rowIndex * 0.03 }}
                          className="bg-transparent hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors group cursor-pointer"
                        >
                          {visibleColumns.map((col, colIndex) => (
                            <TableCell key={colIndex} className={`px-6 py-4 ${col.className || ""}`}>
                              {col.cell
                                ? col.cell(item)
                                : col.accessorKey
                                ? (item[col.accessorKey] as React.ReactNode)
                                : null}
                            </TableCell>
                          ))}
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`grid gap-4 ${activeGridCols}`}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white dark:bg-gray-800 h-48 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  ></div>
                ))
              ) : data.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-100 dark:border-white/[0.05]">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                    {emptyIcon}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {emptyMessage}
                  </p>
                </div>
              ) : (
                data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    {renderGridCard ? renderGridCard(item) : null}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Pagination Integration */}
        {currentPage !== undefined &&
          totalPages !== undefined &&
          onPageChange &&
          totalPages > 0 && (
            <div className="mt-4">
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
          <div className="border-t border-gray-100 dark:border-white/[0.05] mt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
