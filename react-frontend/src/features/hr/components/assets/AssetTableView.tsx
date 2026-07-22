import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Spinner } from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import { getAssetIcon } from "./AssetGridCard";
import { Zap, LayoutGrid, Trash2, Box, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface AssetTableViewProps {
  assets: any[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onProcessReturn: (asset: any) => void;
  onOpenAssign: (asset: any) => void;
  onGenerateLabel: (asset: any) => void;
  onOpenDetails: (asset: any) => void;
  onOpenEdit: (asset: any) => void;
  onDelete: (id: number) => void;
}

export const AssetTableView: React.FC<AssetTableViewProps> = ({
  assets,
  isLoading,
  currentPage,
  totalPages,
  totalFiltered,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onProcessReturn,
  onOpenAssign,
  onGenerateLabel,
  onOpenDetails,
  onOpenEdit,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      let aVal = "";
      let bVal = "";
      if (sortField === "name") {
        aVal = a.name || "";
        bVal = b.name || "";
      } else if (sortField === "type") {
        aVal = a.assetType || "";
        bVal = b.assetType || "";
      } else if (sortField === "sn") {
        aVal = a.serialNumber || "";
        bVal = b.serialNumber || "";
      } else if (sortField === "status") {
        aVal = a.status || "";
        bVal = b.status || "";
      } else if (sortField === "custodian") {
        aVal = a.employee ? `${a.employee.firstNameEnglish || ""} ${a.employee.lastNameEnglish || ""}` : "Unassigned";
        bVal = b.employee ? `${b.employee.firstNameEnglish || ""} ${b.employee.lastNameEnglish || ""}` : "Unassigned";
      }
      const res = aVal.localeCompare(bVal);
      return sortDirection === "asc" ? res : -res;
    });
  }, [assets, sortField, sortDirection]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 select-none">
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1.5">
                <span>Hardware Asset</span>
                {sortField === "name" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center gap-1.5">
                <span>Type / Category</span>
                {sortField === "type" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("sn")}
            >
              <div className="flex items-center gap-1.5">
                <span>Serial Number</span>
                {sortField === "sn" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                {sortField === "status" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell
              className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={() => handleSort("custodian")}
            >
              <div className="flex items-center gap-1.5">
                <span>Custodian / Staff</span>
                {sortField === "custodian" ? (
                  sortDirection === "asc" ? <ArrowUp size={12} className="text-blue-600 font-bold" /> : <ArrowDown size={12} className="text-blue-600 font-bold" />
                ) : (
                  <ArrowUpDown size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </TableHeadCell>
            <TableHeadCell className="py-4 px-6 font-black uppercase text-[9px] tracking-widest text-gray-400 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Spinner size="lg" />
                  <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                    Syncing Ledger...
                  </p>
                </TableCell>
              </TableRow>
            ) : sortedAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Box size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="font-black text-xs uppercase tracking-widest dark:text-white">
                    No Matching Assets Found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              sortedAssets.map((a) => (
                <TableRow
                  key={a.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors group"
                >
                  <TableCell className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 shrink-0">
                        {a.imageUrl ? (
                          <img
                            src={a.imageUrl}
                            alt={a.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getAssetIcon(a.assetType)
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-black dark:text-white block">
                          {a.name}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 font-mono">
                          {a.barcode || "No Barcode"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <Badge color="gray" size="xs" className="font-bold">
                      {a.assetType || "Other"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 px-6 font-mono text-xs font-bold text-gray-600 dark:text-gray-300">
                    {a.serialNumber}
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <Badge
                      color={a.status === "Assigned" ? "blue" : "success"}
                      size="xs"
                      className="font-bold uppercase tracking-wider"
                    >
                      {a.status || "Available"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 px-6 font-bold text-xs text-gray-700 dark:text-gray-200">
                    {a.employee
                      ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
                      : "Unassigned"}
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenDetails(a)}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Zap size={14} />
                      </button>
                      <button
                        onClick={() => onOpenEdit(a)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors cursor-pointer"
                        title="Edit Asset"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetTableView;
