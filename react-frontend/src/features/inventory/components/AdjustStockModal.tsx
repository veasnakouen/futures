import React, { useState, useEffect } from "react";
import { Modal, TextInput, Select } from "@/lib/flowbite-compat";
import { Button } from "@/components/ui/button";
import { Settings2, Package, CheckCircle, Sliders } from "lucide-react";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import api from "@/services/api";
import toast from "react-hot-toast";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemLoc: any;
  locationId: number | null;
  onSuccess: () => void;
}

export default function AdjustStockModal({
  isOpen,
  onClose,
  itemLoc,
  locationId,
  onSuccess,
}: AdjustStockModalProps) {
  const currentQty = itemLoc?.quantity || 0;
  const [adjustMode, setAdjustMode] = useState<"set" | "add" | "reduce">("set");
  const [amount, setAmount] = useState<number>(currentQty);
  const [reason, setReason] = useState<string>("Physical Stock Audit");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAdjustMode("set");
    setAmount(currentQty);
    setReason("Physical Stock Audit");
    setNotes("");
  }, [isOpen, itemLoc, currentQty]);

  if (!isOpen || !itemLoc) return null;

  const calculateFinalQty = (): number => {
    if (adjustMode === "set") return amount;
    if (adjustMode === "add") return currentQty + amount;
    if (adjustMode === "reduce") return Math.max(0, currentQty - amount);
    return currentQty;
  };

  const finalQty = calculateFinalQty();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalQty < 0) {
      toast.error("Adjusted stock balance cannot be negative");
      return;
    }

    try {
      setIsLoading(true);
      const itemId = itemLoc?.inventoryItem?.id ?? itemLoc?.inventoryItemId ?? itemLoc?.itemId ?? itemLoc?.id;
      const targetLocationId = locationId ?? itemLoc?.location?.id ?? itemLoc?.locationId;
      await api.post("/stock/locations/adjust", {
        itemId,
        locationId: targetLocationId,
        quantity: finalQty,
        reason,
        notes,
      });

      toast.success(`Stock balance adjusted to ${finalQty} units`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to adjust stock";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <CustomModalHeader
          title="Adjust Stock Balance"
          subtitle={`Node: ${itemLoc?.location?.name || "Current Location"}`}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Item Info Badge */}
          <div className="flex items-center gap-3 p-3 bg-purple-50/60 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
              <Package size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                {itemLoc?.inventoryItem?.name}
              </h4>
              <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                SKU: {itemLoc?.inventoryItem?.sku || "NO-SKU"} | Current:{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {currentQty} {itemLoc?.inventoryItem?.unit || "Units"}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                Adjustment Action
              </label>
              <Select
                value={adjustMode}
                onChange={(e) => {
                  const mode = e.target.value as "set" | "add" | "reduce";
                  setAdjustMode(mode);
                  if (mode === "set") setAmount(currentQty);
                  else setAmount(1);
                }}
                sizing="sm"
              >
                <option value="set">Set Exact Total</option>
                <option value="add">Add Quantity (+)</option>
                <option value="reduce">Reduce Quantity (-)</option>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                {adjustMode === "set" ? "New Total Balance" : "Adjustment Quantity"}
              </label>
              <TextInput
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                required
                sizing="sm"
              />
            </div>
          </div>

          {/* Balance Preview Badge */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-500">
              Updated Stock Count Preview:
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle size={14} /> {finalQty} {itemLoc?.inventoryItem?.unit || "Units"}
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Adjustment Reason
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sizing="sm"
            >
              <option value="Physical Stock Audit">Physical Stock Audit</option>
              <option value="Inventory Discrepancy Correction">
                Inventory Discrepancy Correction
              </option>
              <option value="Damaged / Write-off Correction">
                Damaged / Write-off Correction
              </option>
              <option value="Reconciliation Audit">Reconciliation Audit</option>
            </Select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Audit Notes (Optional)
            </label>
            <TextInput
              placeholder="e.g. Annual stock count verified by auditor"
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
              disabled={isLoading || finalQty < 0}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs"
            >
              <Sliders size={14} className="mr-1.5" />
              {isLoading ? "Saving..." : `Set Stock to ${finalQty} Units`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
