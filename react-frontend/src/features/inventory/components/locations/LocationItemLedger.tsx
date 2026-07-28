import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MapPin, Package, ArrowRightLeft, MoreHorizontal, Trash2, Settings2, MinusCircle } from "lucide-react";

interface LocationItemLedgerProps {
  selectedLocation: number | null;
  itemsLoading: boolean;
  locationItems: any[];
  onOpenTransferModal?: (sourceLocationId?: string, itemId?: number) => void;
  onConsumeItem: (itemLoc: any) => void;
  onAdjustItem: (itemLoc: any) => void;
  onRemoveItem: (itemLoc: any) => void;
}

const LocationItemLedger: React.FC<LocationItemLedgerProps> = ({
  selectedLocation,
  itemsLoading,
  locationItems,
  onOpenTransferModal,
  onConsumeItem,
  onAdjustItem,
  onRemoveItem,
}) => {
  if (!selectedLocation) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-800 rounded-md border p-12">
        <MapPin size={48} className="mb-4 opacity-20" />
        <p className="font-black uppercase tracking-widest text-sm">Select a location node</p>
      </div>
    );
  }

  return (
    <div className="border-none shadow-sm dark:bg-gray-800 rounded-md bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
            <MapPin size={16} /> Stock Ledger for Selected Node
          </h4>
          {onOpenTransferModal && (
            <Button variant="outline" size="sm" onClick={() => onOpenTransferModal(selectedLocation.toString())} className="font-bold text-[10px] uppercase h-8">
              <ArrowRightLeft size={14} className="mr-2" /> Allocate Stock
            </Button>
          )}
        </div>

        {itemsLoading ? (
          <div className="flex justify-center p-12"><Spinner size="xl" /></div>
        ) : locationItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={44} className="mb-3 opacity-40" />
            <p className="text-sm font-black uppercase tracking-widest">No stock found here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase text-gray-400">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y text-xs">
                {locationItems.map((itemLoc: any) => (
                  <TableRow key={itemLoc.id}>
                    <TableCell className="font-black dark:text-white">
                      {itemLoc.inventoryItem?.name}
                      <span className="block text-[9px] text-gray-400 uppercase">{itemLoc.inventoryItem?.sku || "NO-SKU"}</span>
                    </TableCell>
                    <TableCell>{itemLoc.inventoryItem?.category?.name || "General"}</TableCell>
                    <TableCell className="font-mono text-gray-500">${(itemLoc.inventoryItem?.price || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {itemLoc.quantity} {itemLoc.inventoryItem?.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${itemLoc.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {itemLoc.quantity > 0 ? "In Stock" : "Depleted"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onConsumeItem(itemLoc)}><MinusCircle className="mr-2 h-4 w-4" /> Consume / Use</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAdjustItem(itemLoc)}><Settings2 className="mr-2 h-4 w-4" /> Adjust Stock</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => onRemoveItem(itemLoc)}><Trash2 className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default LocationItemLedger;
