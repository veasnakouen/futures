import React from "react";
import {Badge, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from '@/lib/flowbite-compat';
import { Box, MapPin, Edit3, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

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
      return { label: "Out of Stock", color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-500/20", barColor: "bg-rose-500" };
    if (quantity <= min)
      return { label: "Low Stock", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/20", barColor: "bg-amber-500" };
    return { label: "In Stock", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20", barColor: "bg-emerald-500" };
  };

  const calculateStockPercentage = (quantity: number, min: number) => {
    const target = min * 3;
    if (target === 0) return quantity > 0 ? 100 : 0;
    return Math.min(Math.round((quantity / target) * 100), 100);
  };

  return (
    <div className="p-0 overflow-x-auto overflow-y-hidden rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="min-w-[1000px]">
        <Table hoverable className="border-none bg-transparent">
          <TableHead className="bg-gray-50/80 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <TableHeadCell className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onSort && onSort("name")}>
              <div className="flex items-center">Item Description {renderSortIcon("name")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onSort && onSort("stockQuantity")}>
              <div className="flex items-center">Stock Level {renderSortIcon("stockQuantity")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onSort && onSort("price")}>
              <div className="flex items-center">Valuation {renderSortIcon("price")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onSort && onSort("department")}>
              <div className="flex items-center">Department {renderSortIcon("department")}</div>
            </TableHeadCell>
            <TableHeadCell className="px-6 py-4">
              Status
            </TableHeadCell>
            <TableHeadCell className="px-6 py-4 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-24 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Box size={24} className="text-gray-300" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No inventory nodes found in this sector.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: any) => {
                const status = getStockStatus(item.stockQuantity || 0, item.reorderLevel || 0);
                return (
                  <TableRow
                    key={item.id}
                    className="bg-transparent hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden group-hover:shadow-md transition-all">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <Box size={20} className="opacity-50" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-gray-400 tracking-wider">
                            <span className="uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded-md">{item.sku}</span>
                            <span className="truncate max-w-[150px]">{item.category}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-black text-gray-700 dark:text-gray-300">
                            {item.stockQuantity || 0}
                          </span>
                          <span className="text-gray-400 font-bold">Min: {item.reorderLevel || 0}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${status.barColor}`}
                            style={{ width: `${calculateStockPercentage(item.stockQuantity || 0, item.reorderLevel || 0)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 dark:text-gray-200">${(item.price || 0).toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Total: ${((item.price || 0) * (item.stockQuantity || 0)).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 w-fit">
                        <MapPin size={12} className="text-blue-500" /> {item.department || 'General'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110 transition-all cursor-pointer"
                          title="View Details"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:scale-110 transition-all cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:scale-110 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
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
