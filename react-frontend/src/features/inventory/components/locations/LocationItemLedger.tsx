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
                {locationItems.map((itemLoc: any) => {
                  const itemId = itemLoc.inventoryItem?.id ?? itemLoc.inventoryItemId ?? itemLoc.itemId ?? itemLoc.id;
                  const itemName = itemLoc.inventoryItem?.name || itemLoc.name || "Item #" + itemId;
                  const itemSku = itemLoc.inventoryItem?.sku || itemLoc.sku || "NO-SKU";
                  const itemCategory = itemLoc.inventoryItem?.category?.name || itemLoc.category || "General";
                  const itemPrice = itemLoc.inventoryItem?.price ?? itemLoc.price ?? 0;
                  const itemUnit = itemLoc.inventoryItem?.unit || itemLoc.unit || "units";
                  const isAvailable = (itemLoc.quantity || 0) > 0;

                  return (
                    <TableRow key={itemLoc.id || itemId} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell className="font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div>
                            <div>{itemName}</div>
                            <span className="text-[10px] text-gray-400 font-mono font-normal uppercase">{itemSku}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{itemCategory}</TableCell>
                      <TableCell className="font-mono text-gray-600 dark:text-gray-300">${itemPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800 px-2.5 py-1 rounded-md text-xs">
                          {itemLoc.quantity} <span className="text-[10px] font-normal opacity-70">{itemUnit}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {isAvailable ? "In Stock" : "Depleted"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 shadow-xl rounded-xl border border-gray-100 dark:border-gray-800">
                            {onOpenTransferModal && (
                              <DropdownMenuItem
                                onClick={() => onOpenTransferModal(selectedLocation.toString(), itemId)}
                                className="cursor-pointer font-medium text-xs flex items-center gap-2 py-2"
                              >
                                <ArrowRightLeft className="h-4 w-4 text-blue-500" /> Transfer / Move
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => onConsumeItem(itemLoc)}
                              className="cursor-pointer font-medium text-xs flex items-center gap-2 py-2 text-amber-700 dark:text-amber-400"
                            >
                              <MinusCircle className="h-4 w-4 text-amber-500" /> Consume / Use
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onAdjustItem(itemLoc)}
                              className="cursor-pointer font-medium text-xs flex items-center gap-2 py-2 text-indigo-700 dark:text-indigo-400"
                            >
                              <Settings2 className="h-4 w-4 text-indigo-500" /> Adjust Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer font-medium text-xs flex items-center gap-2 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              onClick={() => onRemoveItem(itemLoc)}
                            >
                              <Trash2 className="h-4 w-4 text-rose-500" /> Remove from Node
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default LocationItemLedger;
