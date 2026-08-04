import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Button, Select, Label, TextInput } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
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
  const [itemId, setItemId] = useState<string>("");
  const [sourceLocationId, setSourceLocationId] = useState<string>("");
  const [targetLocationId, setTargetLocationId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  useEffect(() => {
    if (isOpen) {
      setSourceLocationId(defaultSourceLocationId || "");
      setItemId(defaultItemId ? defaultItemId.toString() : "");
      setTargetLocationId("");
      setQuantity("1");
    }
  }, [isOpen, defaultSourceLocationId, defaultItemId]);

  const { data: items = [] } = useQuery({
    queryKey: ["all-inventory-items-transfer"],
    queryFn: async () => {
      const res = await api.get("/stock/inventory", { params: { size: 1000 } });
      return res.data?.content || [];
    },
    enabled: isOpen,
  });

  const { data: itemStocks = [] } = useQuery({
    queryKey: ["item-stock-distribution", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const res = await api.get(`/stock/locations/items/${itemId}`);
      return res.data || [];
    },
    enabled: !!itemId && isOpen,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-locations-data"],
    queryFn: async () => {
      const res = await api.get("/stock/locations");
      return res.data || [];
    },
    enabled: isOpen,
  });

  const selectedItem = items.find((i: any) => i.id.toString() === itemId);
  let maxQuantity = 0;
  if (selectedItem) {
    if (sourceLocationId) {
      const sourceStock = itemStocks.find((s: any) => s.location?.id.toString() === sourceLocationId);
      maxQuantity = sourceStock ? sourceStock.quantity : 0;
    } else {
      const allocatedAmount = itemStocks.reduce((sum: number, s: any) => sum + (s.quantity || 0), 0);
      maxQuantity = Math.max(0, (selectedItem.stockQuantity || 0) - allocatedAmount);
    }
  }

  const transferMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!payload.sourceLocationId) {
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
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      queryClient.invalidateQueries({ queryKey: ["location-items"] });
      queryClient.invalidateQueries({ queryKey: ["locations-management"] });
      queryClient.invalidateQueries({ queryKey: ["item-stock-distribution"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to move stock");
    },
  });

  const handleTransfer = () => {
    if (!itemId || !targetLocationId || !quantity) return toast.error("Fill in item, target location, and quantity");
    if (sourceLocationId && sourceLocationId === targetLocationId) return toast.error("Source and Target locations must differ");
    if (parseInt(quantity) <= 0) return toast.error("Quantity must be greater than 0");
    if (parseInt(quantity) > maxQuantity) return toast.error(`Exceeds available stock (${maxQuantity})`);

    transferMutation.mutate({
      itemId: parseInt(itemId),
      sourceLocationId: sourceLocationId ? parseInt(sourceLocationId) : null,
      targetLocationId: parseInt(targetLocationId),
      quantity: parseInt(quantity),
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" dismissible={false}>
      <CustomModalHeader title="Allocate or Transfer Stock" subtitle="Inventory Movement Protocol" onClose={onClose} />
      <ModalBody className="p-6 space-y-4 text-xs">
        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Select Item</Label>
          <Select value={itemId} onChange={(e) => setItemId(e.target.value)} sizing="sm">
            <option value="">-- Choose Item --</option>
            {items.map((i: any) => (<option key={i.id} value={i.id.toString()}>{i.name} (SKU: {i.sku})</option>))}
          </Select>
        </div>

        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Source Location</Label>
          <Select value={sourceLocationId} onChange={(e) => setSourceLocationId(e.target.value)} sizing="sm">
            <option value="">-- Main Unallocated Pool --</option>
            {locations.map((loc: any) => (<option key={loc.id} value={loc.id.toString()}>{loc.name}</option>))}
          </Select>
        </div>

        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Target Location</Label>
          <Select value={targetLocationId} onChange={(e) => setTargetLocationId(e.target.value)} sizing="sm">
            <option value="">-- Target Node --</option>
            {locations.map((loc: any) => (<option key={loc.id} value={loc.id.toString()}>{loc.name}</option>))}
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-[10px] font-black uppercase text-gray-400">Quantity to Transfer</Label>
            {itemId && (
              <span className="text-[10px] font-bold text-gray-400">
                Available: <span className={maxQuantity === 0 ? "text-red-500 font-mono" : "text-emerald-600 font-mono"}>{maxQuantity}</span>
              </span>
            )}
          </div>
          <TextInput
            type="number"
            min="1"
            max={maxQuantity > 0 ? maxQuantity.toString() : "1"}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) > maxQuantity ? maxQuantity.toString() : e.target.value)}
            sizing="sm"
          />
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={false}
        submitText={transferMutation.isPending ? "Processing..." : "Confirm Movement"}
        onSubmit={handleTransfer}
        submitDisabled={transferMutation.isPending}
      />
    </Modal>
  );
};

export default TransferStockModal;
