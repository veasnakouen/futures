import React from "react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import ModernPagination from "@/components/common/ModernPagination";
import { Badge, Tooltip, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from "@/lib/flowbite-compat";
import { Package, MapPin, Eye, Edit3, Trash2, MoreVertical } from "lucide-react";

interface Props {
  state: any;
}

export default function InventoryTable({ state }: Props) {
  const {
    loading,
    paginatedItems,
    items,
    totalFilteredItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    getStockStatus,
    handleView,
    handleEdit,
    handleDelete,
  } = state;

  const handleSort = (field: string) => {
    if (state.sortField === field) {
      state.setSortDir(state.sortDir === "asc" ? "desc" : "asc");
    } else {
      state.setSortField(field);
      state.setSortDir("asc");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Item",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <Package size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{item.sku || "N/A"}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => (
        <Badge color="gray" className="rounded-md font-bold text-[10px] uppercase tracking-wider">
          {item.category?.name || "General"}
        </Badge>
      ),
    },
    {
      header: "Stock Level",
      accessorKey: "stockQuantity",
      cell: (item) => {
        const status = getStockStatus(item.stockQuantity, item.reorderLevel);
        const percentage =
          item.reorderLevel > 0
            ? Math.min(100, (item.stockQuantity / (item.reorderLevel * 3)) * 100)
            : 100;
        return (
          <div className="w-full min-w-[120px]">
            <div className="flex justify-between items-end mb-1 text-xs">
              <span className="font-black text-gray-900 dark:text-white">
                {item.stockQuantity} <span className="text-gray-400 font-normal">units</span>
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${status.barColor}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      header: "Location",
      accessorKey: "department",
      cell: (item) => (
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <MapPin size={12} className="mr-1 text-indigo-500 shrink-0" />
          {item.department?.name || "Unassigned"}
        </div>
      ),
    },
    {
      header: "Pricing",
      accessorKey: "price",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400" title="Selling Price">
            ${(item.price || 0).toFixed(2)}
          </span>
          {item.costPrice !== undefined && item.costPrice !== null && (
            <span className="text-[10px] text-gray-500 font-medium mt-0.5" title="Cost Price">
              Cost: ${(item.costPrice || 0).toFixed(2)}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item) => (
        <div className="flex items-center justify-end">
          <div className="relative inline-block text-left">
            <Dropdown
              label=""
              dismissOnClick={true}
              renderTrigger={() => (
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-md transition-colors cursor-pointer"
                  title="More Operations"
                >
                  <MoreVertical size={16} />
                </button>
              )}
              theme={{
                floating: {
                  base: "z-50 w-48 focus:outline-none shadow-2xl rounded-2xl overflow-hidden",
                  style: {
                    auto: "border-none rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white p-1",
                  },
                },
              }}
            >
              <DropdownHeader className="border-none">
                <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1">
                  Item Operations
                </span>
              </DropdownHeader>
              
              <DropdownItem
                onClick={() => state.handleTransaction(item)}
                className="rounded-xl mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
              >
                <div className="flex items-center gap-2.5 py-1">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <Package size={13} />
                  </div>
                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                    Stock Transaction
                  </span>
                </div>
              </DropdownItem>

              <DropdownItem
                onClick={() => handleView(item)}
                className="rounded-xl mb-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item"
              >
                <div className="flex items-center gap-2.5 py-1">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <Eye size={13} />
                  </div>
                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                    View Details
                  </span>
                </div>
              </DropdownItem>
              
              <DropdownItem
                onClick={() => handleEdit(item)}
                className="rounded-xl mb-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 group/item"
              >
                <div className="flex items-center gap-2.5 py-1">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <Edit3 size={13} />
                  </div>
                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                    Edit Record
                  </span>
                </div>
              </DropdownItem>

              <DropdownDivider className="my-1 border-none" />

              <DropdownItem
                onClick={() => handleDelete(item.id)}
                className="rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
              >
                <div className="flex items-center gap-2.5 py-1">
                  <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <Trash2 size={13} />
                  </div>
                  <span className="font-bold text-xs text-rose-650">
                    Delete Item
                  </span>
                </div>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={paginatedItems}
        isLoading={loading}
        sortField={state.sortField}
        sortDir={state.sortDir as "asc" | "desc"}
        onSort={handleSort}
        emptyMessage="No stock inventory items found matching filters."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalFilteredItems}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
