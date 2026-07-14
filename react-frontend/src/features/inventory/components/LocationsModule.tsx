import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Box, Server, RefreshCw, Package, ArrowRightLeft, MoreHorizontal, Trash2, Settings2, MinusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ConfirmModal from "@/components/common/ConfirmModal";
import api from "@/services/api";
import toast from "react-hot-toast";

interface LocationsModuleProps {
  onOpenTransferModal?: (sourceLocationId?: string, itemId?: number) => void;
}

const LocationsModule = ({ onOpenTransferModal }: LocationsModuleProps) => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLocName, setNewLocName] = useState("");
  const [newLocType, setNewLocType] = useState("");

  const [consumeModalOpen, setConsumeModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  const [selectedItemForAction, setSelectedItemForAction] = useState<any>(null);
  const [actionQuantity, setActionQuantity] = useState<string>("");

  const { data: locations = [], isLoading: locLoading } = useQuery({
    queryKey: ["locations-management"],
    queryFn: async () => {
      const res = await api.get("/stock/locations");
      return res.data || [];
    },
  });

  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].id);
    }
  }, [locations, selectedLocation]);

  const { data: locationItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["location-items", selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return [];
      const res = await api.get(`/stock/locations/${selectedLocation}/items`);
      return res.data || [];
    },
    enabled: !!selectedLocation,
  });

  const createLocationMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.post("/stock/locations", payload);
    },
    onSuccess: () => {
      toast.success("Location created successfully");
      queryClient.invalidateQueries({ queryKey: ["locations-management"] });
      setIsCreateModalOpen(false);
      setNewLocName("");
      setNewLocType("");
    },
    onError: () => {
      toast.error("Failed to create location");
    }
  });

  const handleCreateLocation = () => {
    if (!newLocName) return toast.error("Name is required");
    createLocationMutation.mutate({
      name: newLocName,
      type: newLocType || "WAREHOUSE",
      isActive: true,
    });
  };

  const consumeMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/stock/locations/consume", payload),
    onSuccess: () => {
      toast.success("Stock consumed successfully");
      queryClient.invalidateQueries({ queryKey: ["location-items", selectedLocation] });
      setConsumeModalOpen(false);
    },
    onError: () => toast.error("Failed to consume stock"),
  });

  const adjustMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/stock/locations/adjust", payload),
    onSuccess: () => {
      toast.success("Stock adjusted successfully");
      queryClient.invalidateQueries({ queryKey: ["location-items", selectedLocation] });
      setAdjustModalOpen(false);
    },
    onError: () => toast.error("Failed to adjust stock"),
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => api.delete(`/stock/locations/${selectedLocation}/items/${itemId}`),
    onSuccess: () => {
      toast.success("Stock removed from this location");
      queryClient.invalidateQueries({ queryKey: ["location-items", selectedLocation] });
      setConfirmDeleteOpen(false);
    },
    onError: () => toast.error("Failed to remove stock"),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" /> Storage Locations
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["locations-management"] })}>
            <RefreshCw size={16} className={`mr-2 ${locLoading ?'animate-spin':''}`} /> Sync Nodes
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Add Location
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Node Selector */}
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <Box size={16} /> Select Controller Node
              </h4>
              <p className="text-xs text-gray-400 mt-1">Choose a specific node to view and manage its local stock.</p>
            </div>
            
            <div className="w-full sm:w-80">
              {locLoading ? (
                <div className="flex items-center gap-3 text-sm text-gray-500"><Spinner size="sm" /> Syncing Nodes...</div>
              ) : (
                <Select
                  value={selectedLocation ? selectedLocation.toString() : undefined}
                  onValueChange={(val) => setSelectedLocation(parseInt(val))}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                    <SelectValue placeholder="Select a node..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc: any) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${loc.status ==='ONLINE'?'bg-emerald-500':'bg-red-500'}`}></span>
                          {loc.name} <span className="text-[9px] text-gray-400 ml-2 uppercase">({loc.type})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </div>

        {/* Location Items */}
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md">
          <CardContent className="p-6">
            {selectedLocation ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                    <MapPin size={16} /> Stock Ledger for Node
                  </h4>
                  {onOpenTransferModal && (
                    <Button variant="outline" size="sm" onClick={() => onOpenTransferModal(selectedLocation.toString())} className="font-bold text-[10px] uppercase tracking-wider bg-white dark:bg-gray-700 h-8">
                      <ArrowRightLeft size={14} className="mr-2" /> Allocate Stock
                    </Button>
                  )}
                </div>

                {itemsLoading ? (
                  <div className="flex justify-center p-12"><Spinner size="xl" /></div>
                ) : locationItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p className="text-sm font-black uppercase tracking-widest">No stock found here</p>
                    <p className="text-xs mt-2 mb-4">You have not allocated any global items to this specific node yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="border-none">
                      <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y dark:divide-gray-700">
                        {locationItems.map((itemLoc: any) => (
                          <TableRow key={itemLoc.id} className="bg-white dark:bg-gray-800">
                            <TableCell className="font-black text-gray-900 dark:text-white">
                              {itemLoc.inventoryItem?.name}
                              <span className="block text-[9px] text-gray-400 uppercase tracking-widest">{itemLoc.inventoryItem?.sku || "NO-SKU"}</span>
                            </TableCell>
                            <TableCell className="text-xs">{itemLoc.inventoryItem?.category?.name || 'Uncategorized'}</TableCell>
                            <TableCell className="text-xs font-mono text-gray-500">${(itemLoc.inventoryItem?.price || itemLoc.inventoryItem?.unitPrice || 0).toFixed(2)}</TableCell>
                            <TableCell>
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                {itemLoc.quantity} {itemLoc.inventoryItem?.unit}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${itemLoc.quantity > 0 ?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                                {itemLoc.quantity > 0 ? 'In Stock' : 'Depleted'}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-gray-400">
                              {itemLoc.lastUpdated ? new Date(itemLoc.lastUpdated).toLocaleString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedItemForAction(itemLoc);
                                    setActionQuantity("1");
                                    setConsumeModalOpen(true);
                                  }}>
                                    <MinusCircle className="mr-2 h-4 w-4" /> Consume / Use
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedItemForAction(itemLoc);
                                    setActionQuantity(itemLoc.quantity.toString());
                                    setAdjustModalOpen(true);
                                  }}>
                                    <Settings2 className="mr-2 h-4 w-4" /> Adjust Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onOpenTransferModal && onOpenTransferModal(selectedLocation?.toString(), itemLoc.inventoryItem?.id)}>
                                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Out
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => {
                                    setSelectedItemForAction(itemLoc);
                                    setConfirmDeleteOpen(true);
                                  }}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove from Node
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
                <MapPin size={48} className="mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-sm">Select a location</p>
                <p className="text-xs mt-2 text-center max-w-sm">Click on a location node from the list to view its specific stock ledger.</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Location Node</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <div className="mb-2 block"><Label>Location Name</Label></div>
              <Input placeholder="e.g. Clinic Pharmacy" value={newLocName} onChange={e => setNewLocName(e.target.value)} required />
            </div>
            <div>
              <div className="mb-2 block"><Label>Location Type</Label></div>
              <Input placeholder="e.g. WAREHOUSE, PHARMACY" value={newLocType} onChange={e => setNewLocType(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateLocation} disabled={createLocationMutation.isPending}>
              {createLocationMutation.isPending ? "Saving..." : "Create Location"}
            </Button>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consume Modal */}
      <Dialog open={consumeModalOpen} onOpenChange={setConsumeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consume / Use Stock</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500">
              Record usage of <strong>{selectedItemForAction?.inventoryItem?.name}</strong> at this node. This will deduct from local and global stock.
            </p>
            <div>
              <div className="mb-2 block flex justify-between items-center">
                <Label>Quantity to Consume</Label>
                <span className="text-xs font-semibold text-gray-500">
                  Available: <span className="text-blue-600">{selectedItemForAction?.quantity}</span>
                </span>
              </div>
              <Input 
                type="number" 
                min="1" 
                max={selectedItemForAction?.quantity}
                value={actionQuantity} 
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (val > (selectedItemForAction?.quantity || 0)) {
                    setActionQuantity(selectedItemForAction?.quantity?.toString());
                  } else {
                    setActionQuantity(e.target.value);
                  }
                }} 
                required 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => consumeMutation.mutate({
                itemId: selectedItemForAction?.inventoryItem?.id,
                locationId: selectedLocation,
                quantity: parseInt(actionQuantity)
              })} 
              disabled={consumeMutation.isPending || !actionQuantity || parseInt(actionQuantity) <= 0}
            >
              {consumeMutation.isPending ? "Processing..." : "Consume Stock"}
            </Button>
            <Button variant="outline" onClick={() => setConsumeModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock Quantity</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500">
              Override the quantity of <strong>{selectedItemForAction?.inventoryItem?.name}</strong> to fix a discrepancy.
            </p>
            <div>
              <div className="mb-2 block"><Label>New Actual Quantity</Label></div>
              <Input 
                type="number" 
                min="0" 
                value={actionQuantity} 
                onChange={e => setActionQuantity(e.target.value)} 
                required 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => adjustMutation.mutate({
                itemId: selectedItemForAction?.inventoryItem?.id,
                locationId: selectedLocation,
                quantity: parseInt(actionQuantity)
              })} 
              disabled={adjustMutation.isPending || actionQuantity === ""}
            >
              {adjustMutation.isPending ? "Saving..." : "Update Quantity"}
            </Button>
            <Button variant="outline" onClick={() => setAdjustModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        show={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          if (selectedItemForAction?.inventoryItem?.id) {
            removeMutation.mutate(selectedItemForAction.inventoryItem.id);
          }
        }}
        message={`Are you sure you want to remove ${selectedItemForAction?.inventoryItem?.name} from this location? The stock will be returned to the unallocated main pool.`}
      />
    </div>
  );
};

export default LocationsModule;
