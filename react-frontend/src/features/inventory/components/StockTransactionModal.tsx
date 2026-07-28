import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Label, TextInput, Select, Textarea } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { ShoppingCart, Heart, Send, Plus, Minus, DollarSign, User } from "lucide-react";
import { toast } from "react-hot-toast";
import api from '@/services/api';

interface StockTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSuccess: () => void;
}

const StockTransactionModal: React.FC<StockTransactionModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [type, setType] = useState("PURCHASE");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLookups();
      setPrice(type === "SALE" ? item?.salePrice || 0 : item?.costPrice || 0);
    }
  }, [isOpen, type, item]);

  const fetchLookups = async () => {
    try {
      const [sRes, dRes, deptRes] = await Promise.all([
        api.get("/stock/assets/lookups/suppliers").catch(() => ({ data: [] })),
        api.get("/stock/assets/lookups/donors").catch(() => ({ data: [] })),
        api.get("/departments").catch(() => ({ data: [] })),
      ]);
      setSuppliers(sRes.data || []);
      setDonors(dRes.data || []);
      setDepartments(deptRes.data || []);
    } catch {
      console.error("Failed to load reference data");
    }
  };

  const handleSubmit = async () => {
    if (quantity <= 0) return toast.error("Quantity must be greater than zero");
    try {
      setIsProcessing(true);
      const payload = {
        item: { id: item.id },
        type,
        quantity: ["SALE", "DONATION_OUT", "TRANSFER_OUT"].includes(type) ? -quantity : quantity,
        unitPrice: price,
        remarks,
        supplier: type === "PURCHASE" && selectedPartyId ? { id: selectedPartyId } : null,
        donor: (type === "DONATION_IN" || type === "DONATION_OUT") && selectedPartyId ? { id: selectedPartyId } : null,
        department: type.includes("TRANSFER") && selectedPartyId ? { id: selectedPartyId } : null,
      };

      await api.post("/stock/inventory/transactions", payload);
      toast.success("Transaction synchronized successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to commit transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title="Stock Movement" subtitle="Inventory Transaction" onClose={onClose} />
      <ModalBody className="p-6 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase text-blue-500 mb-1">Target Asset</p>
            <h4 className="text-base font-black dark:text-white">{item?.name}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Current Stock</p>
            <span className="text-base font-mono font-black text-indigo-600 px-3 py-1 bg-white rounded-md shadow-sm">{item?.quantity || 0}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Action Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)} sizing="sm">
              <option value="PURCHASE">🛒 Buy (Purchase)</option>
              <option value="SALE">💰 Sell (Shop Mode)</option>
              <option value="DONATION_IN">🎁 Receive Donation</option>
              <option value="DONATION_OUT">💝 Give Donation</option>
              <option value="TRANSFER_OUT">🚚 Transfer to Dept</option>
              <option value="ADJUSTMENT">⚙️ Stock Adjustment</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Quantity</Label>
              <TextInput type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} sizing="sm" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Unit Price ($)</Label>
              <TextInput type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} sizing="sm" />
            </div>
          </div>

          {type === "PURCHASE" && (
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Supplier</Label>
              <Select value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} sizing="sm">
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </Select>
            </div>
          )}

          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Transaction notes..." rows={2} />
          </div>
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={false}
        submitText={isProcessing ? "Processing..." : "Commit Transaction"}
        onSubmit={handleSubmit}
        submitDisabled={isProcessing}
      />
    </Modal>
  );
};

export default StockTransactionModal;
