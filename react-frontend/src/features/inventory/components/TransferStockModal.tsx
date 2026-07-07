import React, { useState } from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Select, Label, TextInput} from "@/lib/flowbite-compat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultItemId?: number | null;
  defaultSourceLocationId?: string | null;
}

const TransferStockModal: React.FC<TransferStockModalProps> = ({
  isOpen,
  onClose,
  defaultItemId,
  defaultSourceLocationId,
}) => {
  const queryClient = useQueryClient();
  const [itemId, setItemId] = useState<string>(defaultItemId?.toString() || "");
  const [sourceLocationId, setSourceLocationId] = useState<string>(defaultSourceLocationId || "");
  const [targetLocationId, setTargetLocationId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  // Initialize sourceLocationId when modal opens with default value
  React.useEffect(() => {
    if (isOpen) {
      if (defaultSourceLocationId) {
        setSourceLocationId(defaultSourceLocationId);
      }
    }
  }, [isOpen, defaultSourceLocationId]);

  // Fetch all items for dropdown
  const { data: items = [] } = useQuery({
    queryKey: ["all-inventory-items-transfer"],
    queryFn: async () => {
      // Assuming a generic search without pagination just for the dropdown
      const res = await api.get("/stock/inventory", { params: { size: 1000 } });
      return res.data?.content || [];
    },
    enabled: isOpen,
  });

  // Fetch stock distribution for selected item
  const { data: itemStocks = [] } = useQuery({
    queryKey: ["item-stock-distribution", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const res = await api.get(`/stock/locations/items/${itemId}`);
      return res.data || [];
    },
    enabled: !!itemId && isOpen,
  });

  // Fetch all locations
  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-locations-data"],
    queryFn: async () => {
      const res = await api.get("/stock/locations");
      return res.data || [];
    },
    enabled: isOpen,
  });

  // Calculate Max Quantity
  const selectedItem = items.find((i: any) => i.id.toString() === itemId);
  let maxQuantity = 0;
  if (selectedItem) {
    if (sourceLocationId) {
      // Transfer from specific location
      const sourceStock = itemStocks.find((s: any) => s.location?.id.toString() === sourceLocationId);
      maxQuantity = sourceStock ? sourceStock.quantity : 0;
    } else {
      // Initial allocation (unallocated global stock)
      const allocatedAmount = itemStocks.reduce((sum: number, s: any) => sum + (s.quantity || 0), 0);
      maxQuantity = Math.max(0, (selectedItem.quantity || 0) - allocatedAmount);
    }
  }

  const transferMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!payload.sourceLocationId) {
        // Initial allocation
        return api.post("/stock/locations/allocate", {
          itemId: payload.itemId,
          locationId: payload.targetLocationId,
          quantity: payload.quantity,
        });
      }
      return api.post("/stock/locations/transfer", payload);
    },
    onSuccess: () => {
      toast.success("Stock moved successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["location-items"] });
      onClose();
      // reset form
      setItemId("");
      setSourceLocationId("");
      setTargetLocationId("");
      setQuantity("1");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to move stock");
    },
  });

  const handleTransfer = () => {
    if (!itemId || !targetLocationId || !quantity) {
      toast.error("Please fill in item, target location, and quantity");
      return;
    }
    if (sourceLocationId && sourceLocationId === targetLocationId) {
      toast.error("Source and Target locations cannot be the same");
      return;
    }
    if (parseInt(quantity) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (parseInt(quantity) > maxQuantity) {
      toast.error(`Quantity exceeds available stock (${maxQuantity})`);
      return;
    }

    transferMutation.mutate({
      itemId: parseInt(itemId),
      sourceLocationId: sourceLocationId ? parseInt(sourceLocationId) : null,
      targetLocationId: parseInt(targetLocationId),
      quantity: parseInt(quantity),
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>Allocate or Transfer Stock</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label value="Select Item" />
            </div>
            <Select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
            >
              <option value="">-- Choose Item --</option>
              {items.map((i: any) => (
                <option key={i.id} value={i.id}>
                  {i.name} (SKU: {i.sku})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label value="Source Location" />
            </div>
            <Select
              value={sourceLocationId}
              onChange={(e) => setSourceLocationId(e.target.value)}
            >
              <option value="">-- Initial Allocation (Main Pool) --</option>
              {locations.map((loc: any) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label value="Target Location" />
            </div>
            <Select
              value={targetLocationId}
              onChange={(e) => setTargetLocationId(e.target.value)}
              required
            >
              <option value="">-- To Location --</option>
              {locations.map((loc: any) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-2 block flex justify-between items-center">
              <Label value="Quantity to Transfer" />
              {itemId && (
                <span className="text-xs font-semibold text-gray-500">
                  Available: <span className={maxQuantity === 0 ? "text-red-500":"text-green-600"}>{maxQuantity}</span>
                </span>
              )}
            </div>
            <TextInput
              type="number"
              min="1"
              max={maxQuantity > 0 ? maxQuantity.toString() : "1"}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > maxQuantity) {
                  setQuantity(maxQuantity.toString());
                } else {
                  setQuantity(e.target.value);
                }
              }}
              required
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="blue" onClick={handleTransfer} disabled={transferMutation.isPending}>
          {transferMutation.isPending ? "Processing..." : "Confirm Movement"}
        </Button>
        <Button color="gray" onClick={onClose} disabled={transferMutation.isPending}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransferStockModal;
