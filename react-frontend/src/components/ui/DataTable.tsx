import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Spinner,
} from '@/lib/flowbite-compat';
import { ArchiveX } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  emptySubMessage?: string;
  emptyIcon?: React.ReactNode;
  loading?: boolean;
  onRowClick?: (item: T) => void;
  maxHeight?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No Records Found",
  emptySubMessage = "There is currently no data to display.",
  emptyIcon,
  loading = false,
  onRowClick,
  maxHeight,
}: DataTableProps<T>) {
  
  const appliedMaxHeight = maxHeight !== undefined 
    ? maxHeight 
    : data.length > 15 ? "max-h-[600px]" : "";

  return (
    <div className={`overflow-x-auto ${data.length > 15 || maxHeight ? 'overflow-y-auto' : ''} ${appliedMaxHeight} rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 relative`}>
      <Table hoverable>
        <TableHead className="bg-gray-50/95 dark:bg-gray-700/95 text-gray-400 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
          {columns.map((col) => (
            <TableHeadCell
              key={col.key}
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"} ${col.className || ""}`}
            >
              {col.label}
            </TableHeadCell>
          ))}
        </TableHead>
        <TableBody className="divide-y dark:divide-gray-700">
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-24 text-center">
                <Spinner size="xl" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                  Loading data...
                </p>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-24 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  {emptyIcon || (
                    <ArchiveX size={48} className="mb-4 opacity-50" />
                  )}
                  <p className="text-lg font-black dark:text-white">
                    {emptyMessage}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">
                    {emptySubMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                className={`bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={`whitespace-nowrap px-6 py-4 ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"} ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : ((item as any)[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
