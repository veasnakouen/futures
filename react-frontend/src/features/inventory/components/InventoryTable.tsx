import React from "react";
import {Badge, Progress, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from '@/lib/flowbite-compat';
import { Box, MapPin, Edit3, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface InventoryTableProps {
  items: any[];
  handleEdit: (item: any) => void;
  handleView: (item: any) => void;
  handleDelete: (id: number) => void;
  sortField?: string;
  sortDir?: string;
  onSort?: (field: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  handleEdit,
  handleView,
  handleDelete,
  sortField,
  sortDir,
  onSort,
}) => {
  const renderSortIcon = (field: string) => {
    if (!onSort) return null;
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp size={12} className="ml-1 text-blue-500" /> : <ArrowDown size={12} className="ml-1 text-blue-500" />;
  };

  const getStockStatus = (quantity: number, min: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", color: "failure" as const };
    if (quantity <= min)
      return { label: "Low Stock", color: "warning" as const };
    return { label: "In Stock", color: "success" as const };
  };

  const calculateStockPercentage = (quantity: number, min: number) => {
    const target = min * 3;
    return Math.min(Math.round((quantity / target) * 100), 100);
  };

  return (
    <div className="p-0 overflow-x-auto overflow-y-hidden">
      <div className="min-w-[900px]">
        <Table hoverable className="border-none">
          <TableHead className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <TableHeadCell className="px-6 py-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSort && onSort("name")}>
              <div className="flex items-center">Item Description {renderSortIcon("name")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSort && onSort("quantity")}>
              <div className="flex items-center">Stock Level {renderSortIcon("quantity")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSort && onSort("unitPrice")}>
              <div className="flex items-center">Valuation {renderSortIcon("unitPrice")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSort && onSort("location")}>
              <div className="flex items-center">Storage Node {renderSortIcon("location")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSort && onSort("status")}>
              <div className="flex items-center">Status {renderSortIcon("status")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-3 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Box size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    No inventory nodes found in this sector.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: any) => {
                const status = getStockStatus(item.quantity, item.minQuantity);
                return (
                  <TableRow
                    key={item.id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <TableCell className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white leading-tight text-sm">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">
                            {item.sku || "NO-SKU"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <div className="space-y-2 w-40">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="dark:text-gray-300">
                            {item.quantity}{" "}
                            <span className="text-gray-400">{item.unit}</span>
                          </span>
                          <span className="text-gray-400">
                            Min: {item.minQuantity}
                          </span>
                        </div>
                        <Progress
                          progress={calculateStockPercentage(
                            item.quantity,
                            item.minQuantity,
                          )}
                          color={
                            status.color === "failure"
                              ? "red"
                              : status.color === "warning"
                                ? "yellow"
                                : "green"
                          }
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3 font-black dark:text-white tabular-nums text-sm">
                      ${item.unitPrice?.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-black uppercase text-[9px] tracking-widest">
                        <MapPin size={12} className="text-rose-500" />
                        <span>{item.location || "Warehouse"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <Badge
                        color={status.color}
                        className="rounded-md px-4 py-1 text-[8px] font-black uppercase tracking-widest shadow-sm"
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleView(item)}
                          className="rounded-md h-8 w-8 p-0 flex items-center justify-center shadow-sm hover:text-emerald-600"
                          title="View Item Details"
                        >
                          <Search size={14} />
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleEdit(item)}
                          className="rounded-md h-8 w-8 p-0 flex items-center justify-center shadow-sm hover:text-blue-600"
                          title="Edit Item"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-md h-8 w-8 p-0 flex items-center justify-center shadow-sm hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryTable;
