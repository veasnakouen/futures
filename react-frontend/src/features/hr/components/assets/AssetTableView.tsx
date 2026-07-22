import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Spinner, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import { getAssetIcon } from "./AssetGridCard";
import { format } from "date-fns";
import { MoreVertical, RotateCcw, UserPlus, Printer, Zap, LayoutGrid, Trash2, Box } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up overflow-hidden">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Hardware Asset
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Type / Category
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Serial Number
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Status
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400">
              Custodian / Staff
            </TableHeadCell>
            <TableHeadCell className="py-4 font-black uppercase text-[9px] tracking-widest text-gray-400 text-right">
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
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Box size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="font-black text-xs uppercase tracking-widest dark:text-white">
                    No Matching Assets Found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              assets.map((a) => (
                <TableRow
                  key={a.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors group"
                >
                  <TableCell className="py-4 font-bold text-gray-900 dark:text-white">
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

                  <TableCell className="py-4">
                    <Badge color="gray" size="xs" className="font-bold">
                      {a.assetType || "Other"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 font-mono text-xs font-bold text-gray-600 dark:text-gray-300">
                    {a.serialNumber}
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      color={a.status === "Assigned" ? "blue" : "success"}
                      size="xs"
                      className="font-bold uppercase tracking-wider"
                    >
                      {a.status || "Available"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 font-bold text-xs text-gray-700 dark:text-gray-200">
                    {a.employee
                      ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
                      : "Unassigned"}
                  </TableCell>

                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenDetails(a)}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors"
                        title="View Details"
                      >
                        <Zap size={14} />
                      </button>
                      <button
                        onClick={() => onOpenEdit(a)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                        title="Edit Asset"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
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

      {/* Pagination Footer */}
      {!isLoading && totalFiltered > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalFiltered}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default AssetTableView;
