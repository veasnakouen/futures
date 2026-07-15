"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Spinner } from "@/lib/flowbite-compat";

interface AdvancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
}

export function AdvancedDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onRowClick,
  isLoading = false,
}: AdvancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchKey ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? "" : globalFilter}
            onChange={(event) =>
              searchKey 
                ? table.getColumn(searchKey)?.setFilterValue(event.target.value)
                : setGlobalFilter(event.target.value)
            }
            className="pl-9 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 rounded-xl"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-100 dark:border-gray-800">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {header.isPlaceholder ? null : (
                          <div 
                            className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors' : ''}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronUp className="h-4 w-4" />,
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              header.column.getCanSort() ? <ChevronsUpDown className="h-4 w-4 opacity-30" /> : null
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <Spinner size="xl" className="fill-blue-600" />
                    <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Loading records...</p>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`border-gray-50 dark:border-gray-800/50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/50' : ''}`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-gray-500 font-medium">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900 dark:text-gray-100">{table.getRowModel().rows.length > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1 : 0}</span> to <span className="font-bold text-gray-900 dark:text-gray-100">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of <span className="font-bold text-gray-900 dark:text-gray-100">{table.getFilteredRowModel().rows.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
