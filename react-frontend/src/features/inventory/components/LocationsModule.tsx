import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import api from "@/services/api";
import toast from "react-hot-toast";

import LocationNodeSelector from "./locations/LocationNodeSelector";
import LocationItemLedger from "./locations/LocationItemLedger";
import ConsumeStockModal from "./ConsumeStockModal";
import AdjustStockModal from "./AdjustStockModal";

interface LocationsModuleProps {
  onOpenTransferModal?: (sourceLocationId?: string, itemId?: number) => void;
}

const LocationsModule = ({ onOpenTransferModal }: LocationsModuleProps) => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<any>(null);

  const { data: locationsRaw, isLoading: locLoading } = useQuery({
    queryKey: ["locations-management"],
    queryFn: async () => {
      const res = await api.get("/stock/locations");
      return res.data || [];
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const locations = Array.isArray(locationsRaw?.content)
    ? locationsRaw.content
    : Array.isArray(locationsRaw)
      ? locationsRaw
      : [];

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
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const invalidateAllStockQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["location-items", selectedLocation] });
    queryClient.invalidateQueries({ queryKey: ["locations-management"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
  };

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => api.delete(`/stock/locations/${selectedLocation}/items/${itemId}`),
    onSuccess: () => {
      toast.success("Stock removed from node");
      invalidateAllStockQueries();
      setConfirmDeleteOpen(false);
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to remove stock";
      toast.error(errMsg);
    },
  });

  const handleStockActionSuccess = () => {
    invalidateAllStockQueries();
  };

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
          onConsumeItem={(itemLoc) => {
            setSelectedItemForAction(itemLoc);
            setIsConsumeModalOpen(true);
          }}
          onAdjustItem={(itemLoc) => {
            setSelectedItemForAction(itemLoc);
            setIsAdjustModalOpen(true);
          }}
          onRemoveItem={(itemLoc) => {
            setSelectedItemForAction(itemLoc);
            setConfirmDeleteOpen(true);
          }}
        />
      </div>

      <ConsumeStockModal
        isOpen={isConsumeModalOpen}
        onClose={() => setIsConsumeModalOpen(false)}
        itemLoc={selectedItemForAction}
        locationId={selectedLocation}
        onSuccess={handleStockActionSuccess}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        itemLoc={selectedItemForAction}
        locationId={selectedLocation}
        onSuccess={handleStockActionSuccess}
      />

      <ConfirmModal
        show={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          const itemId = selectedItemForAction?.inventoryItem?.id ?? selectedItemForAction?.inventoryItemId ?? selectedItemForAction?.itemId ?? selectedItemForAction?.id;
          if (itemId) {
            removeMutation.mutate(itemId);
          }
        }}
        message={`Are you sure you want to remove ${selectedItemForAction?.inventoryItem?.name || selectedItemForAction?.name || "this item"} from this location node?`}
      />
    </div>
  );
};

export default LocationsModule;
