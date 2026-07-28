import React from "react";
import { Badge, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from '@/lib/flowbite-compat';
import { Box, MapPin, Layers, AlertCircle, MoreVertical, ArrowRightLeft, Eye, Edit3, Trash2 } from "lucide-react";

interface WarehouseGridCardsProps {
  paginatedItems: any[];
  itemsPerRow: string;
  onOpenTransaction: (item: any) => void;
  onOpenDetails: (item: any) => void;
  onOpenEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

const WarehouseGridCards: React.FC<WarehouseGridCardsProps> = ({
  paginatedItems,
  itemsPerRow,
  onOpenTransaction,
  onOpenDetails,
  onOpenEdit,
  onDelete,
}) => {
  return (
    <div className={`grid gap-6 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 sm:grid-cols-5" : "grid-cols-1 sm:grid-cols-4"}`}>
      {paginatedItems.map((item) => (
        <div key={item.id} className="group relative shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-gray-800 rounded-2xl bg-white border p-0 overflow-hidden">
          <div className="h-32 bg-gray-50 dark:bg-gray-700/50 relative overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                <Box size={32} />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Dropdown
                placement="bottom-end"
                label={<div className="p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 cursor-pointer"><MoreVertical size={16} /></div>}
                arrowIcon={false}
                inline
              >
                <DropdownHeader><span className="text-[9px] font-black uppercase text-gray-400">Node Operations</span></DropdownHeader>
                <DropdownItem onClick={() => onOpenTransaction(item)} className="font-bold text-xs text-emerald-600">Movement</DropdownItem>
                <DropdownItem onClick={() => onOpenDetails(item)} className="font-bold text-xs text-indigo-600">Audit Node</DropdownItem>
                <DropdownItem onClick={() => onOpenEdit(item)} className="font-bold text-xs text-amber-600">Edit Record</DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={() => onDelete(item.id)} className="font-bold text-xs text-rose-600">Decommission</DropdownItem>
              </Dropdown>
            </div>
          </div>

          <div className="p-5 pt-3 space-y-3">
            <div className="flex justify-between items-center">
              <Badge color={item.quantity <= (item.minQuantity || 5) ? "failure" : "success"} className="text-[8px] uppercase">
                {item.status || "Active Node"}
              </Badge>
              <span className="text-[9px] font-mono font-bold text-gray-400">#{item.sku}</span>
            </div>

            <h4 className="font-black dark:text-white text-base uppercase truncate">{item.name}</h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Layers size={10} className="text-blue-500" /> {item.category || "General"}
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-xs">
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase">Stock Qty</p>
                <p className={`font-black text-lg ${item.quantity <= (item.minQuantity || 5) ? "text-rose-500" : "dark:text-white"}`}>
                  {item.quantity} <span className="text-[9px] font-normal text-gray-400">{item.unit || "pcs"}</span>
                </p>
              </div>
              <div className="border-l pl-2">
                <p className="text-[8px] font-black text-gray-400 uppercase">Valuation</p>
                <p className="font-black text-base text-blue-600">${item.unitPrice || 0}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarehouseGridCards;
