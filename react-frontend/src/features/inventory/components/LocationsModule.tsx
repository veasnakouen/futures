import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, RefreshCw } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import api from "@/services/api";
import toast from "react-hot-toast";

import LocationNodeSelector from "./locations/LocationNodeSelector";
import LocationItemLedger from "./locations/LocationItemLedger";

interface LocationsModuleProps {
  onOpenTransferModal?: (sourceLocationId?: string, itemId?: number) => void;
}

const LocationsModule = ({ onOpenTransferModal }: LocationsModuleProps) => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<any>(null);

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

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => api.delete(`/stock/locations/${selectedLocation}/items/${itemId}`),
    onSuccess: () => {
      toast.success("Stock removed from node");
      queryClient.invalidateQueries({ queryKey: ["location-items", selectedLocation] });
      setConfirmDeleteOpen(false);
    },
    onError: () => toast.error("Failed to remove stock"),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" /> Storage Locations & Inventory Nodes
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["locations-management"] })}>
            <RefreshCw size={16} className={`mr-2 ${locLoading ? "animate-spin" : ""}`} /> Sync Nodes
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <LocationNodeSelector
          locations={locations}
          locLoading={locLoading}
          selectedLocation={selectedLocation}
          onSelectLocation={(id) => setSelectedLocation(id)}
        />

        <LocationItemLedger
          selectedLocation={selectedLocation}
          itemsLoading={itemsLoading}
          locationItems={locationItems}
          onOpenTransferModal={onOpenTransferModal}
          onConsumeItem={(itemLoc) => setSelectedItemForAction(itemLoc)}
          onAdjustItem={(itemLoc) => setSelectedItemForAction(itemLoc)}
          onRemoveItem={(itemLoc) => { setSelectedItemForAction(itemLoc); setConfirmDeleteOpen(true); }}
        />
      </div>

      <ConfirmModal
        show={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          if (selectedItemForAction?.inventoryItem?.id) {
            removeMutation.mutate(selectedItemForAction.inventoryItem.id);
          }
        }}
        message={`Are you sure you want to remove ${selectedItemForAction?.inventoryItem?.name} from this location node?`}
      />
    </div>
  );
};

export default LocationsModule;
