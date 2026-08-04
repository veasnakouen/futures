import React, { useState, useEffect } from "react";
import { Modal, TextInput, Select } from "@/lib/flowbite-compat";
import { Button } from "@/components/ui/button";
import { MinusCircle, Package, AlertCircle } from "lucide-react";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import api from "@/services/api";
import toast from "react-hot-toast";

interface ConsumeStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemLoc: any;
  locationId: number | null;
  onSuccess: () => void;
}

export default function ConsumeStockModal({
  isOpen,
  onClose,
  itemLoc,
  locationId,
  onSuccess,
}: ConsumeStockModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("Internal Consumption");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentQty = itemLoc?.quantity || 0;

  useEffect(() => {
    setQuantity(1);
    setReason("Internal Consumption");
    setNotes("");
  }, [isOpen, itemLoc]);

  if (!isOpen || !itemLoc) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (quantity > currentQty) {
      toast.error(`Cannot consume more than available stock (${currentQty} units)`);
      return;
    }

    try {
      setIsLoading(true);
      const itemId = itemLoc?.inventoryItem?.id ?? itemLoc?.inventoryItemId ?? itemLoc?.itemId ?? itemLoc?.id;
      const targetLocationId = locationId ?? itemLoc?.location?.id ?? itemLoc?.locationId;
      await api.post("/stock/locations/consume", {
        itemId,
        locationId: targetLocationId,
        quantity,
        reason,
        notes,
      });

      toast.success(`Consumed ${quantity} units of ${itemLoc?.inventoryItem?.name || itemLoc?.name || "item"}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to consume stock";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <CustomModalHeader
          title="Consume / Use Stock Item"
          subtitle={`Node: ${itemLoc?.location?.name || "Current Location"}`}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Item Info Badge */}
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Package size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                {itemLoc?.inventoryItem?.name}
              </h4>
              <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                SKU: {itemLoc?.inventoryItem?.sku || "NO-SKU"} | Available:{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {currentQty} {itemLoc?.inventoryItem?.unit || "Units"}
                </span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Quantity to Consume / Use
            </label>
            <TextInput
              type="number"
              min={1}
              max={currentQty}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
              sizing="sm"
            />
            {quantity > currentQty && (
              <p className="mt-1 text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={12} /> Exceeds available stock ({currentQty})
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Consumption Reason
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sizing="sm"
            >
              <option value="Internal Consumption">Internal Consumption</option>
              <option value="Project Deployment">Project Deployment</option>
              <option value="Office & Staff Usage">Office & Staff Usage</option>
              <option value="Damaged / Expired">Damaged / Expired</option>
              <option value="Testing / Demonstration">Testing / Demonstration</option>
            </Select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Additional Notes (Optional)
            </label>
            <TextInput
              placeholder="e.g. Issued to IT Department for Server setup"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sizing="sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || quantity <= 0 || quantity > currentQty}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs"
            >
              <MinusCircle size={14} className="mr-1.5" />
              {isLoading ? "Consuming..." : `Consume ${quantity} Units`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
