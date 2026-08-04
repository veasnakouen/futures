import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Spinner } from "@/lib/flowbite-compat";
import { ArrowUpDown, ArrowUp, ArrowDown, Box } from "lucide-react";
import { ColumnDef } from "../DataTable";

interface DataTableViewTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  hiddenColumns: Set<string>;
  isLoading?: boolean;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTableViewTable<T>({
  data,
  columns,
  hiddenColumns,
  isLoading,
  sortField,
  sortDir,
  onSort,
  emptyMessage = "No matching records found.",
  emptyIcon,
}: DataTableViewTableProps<T>) {
  const visibleColumns = columns.filter((col, idx) => {
    const key = (col.accessorKey as string) || (typeof col.header === "string" ? col.header : `col-${idx}`);
    return !hiddenColumns.has(key);
  });

  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800/60 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-xs">
          <TableHead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] uppercase font-black text-gray-400">
            <TableRow>
              {visibleColumns.map((col, idx) => {
                const key = (col.accessorKey as string) || (typeof col.header === "string" ? col.header : `col-${idx}`);
                const isSorted = sortField === key;
                return (
                  <TableHeadCell
                    key={key}
                    onClick={() => col.sortable && onSort && onSort(key)}
                    className={`${col.className || ""} ${col.sortable ? "cursor-pointer select-none hover:text-blue-600" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-gray-400">
                          {isSorted ? (
                            sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                          ) : (
                            <ArrowUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHeadCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody className="divide-y text-xs">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1} className="py-16 text-center">
                  <Spinner size="lg" />
                  <p className="mt-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Records...</p>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    {emptyIcon || <Box size={36} className="mb-2 opacity-30" />}
                    <p className="font-bold text-xs uppercase tracking-wider">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIdx) => (
                <TableRow key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {visibleColumns.map((col, colIdx) => {
                    const key = (col.accessorKey as string) || (typeof col.header === "string" ? col.header : `col-${colIdx}`);
                    return (
                      <TableCell key={key} className={col.className}>
                        {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? "") : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
