import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {
  X,
  ShoppingCart,
  Heart,
  Send,
  Plus,
  Minus,
  DollarSign,
  User,
} from "lucide-react";
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
      setSuppliers(sRes.data);
      setDonors(dRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error("Failed to load reference data");
    }
  };

  const handleSubmit = async () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    try {
      setIsProcessing(true);
      const payload = {
        item: { id: item.id },
        type: type,
        quantity: ["SALE", "DONATION_OUT", "TRANSFER_OUT"].includes(type)
          ? -quantity
          : quantity,
        unitPrice: price,
        remarks: remarks,
        supplier: type === "PURCHASE" && selectedPartyId ? { id: selectedPartyId } : null,
        donor: type === "DONATION_IN" && selectedPartyId ? { id: selectedPartyId } : null,
        department: type.includes("TRANSFER") && selectedPartyId ? { id: selectedPartyId } : null,
      };

      await api.post("/stock/inventory/transactions", payload);
      toast.success("Transaction synchronized successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to commit transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "PURCHASE":
        return <Plus className="text-emerald-500" />;
      case "SALE":
        return <ShoppingCart className="text-blue-500" />;
      case "DONATION_IN":
      case "DONATION_OUT":
        return <Heart className="text-pink-500" />;
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return <Send className="text-amber-500" />;
      default:
        return <Minus />;
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title="Stock Movement"
        subtitle="Inventory Transaction"
        icon={getIcon()}
        onClose={onClose}
      />
      <ModalBody className="p-6">
        <div className="space-y-6">
          {/* Item Target Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-500 mb-1 tracking-widest">
                Target Asset
              </p>
              <h4 className="text-lg font-black dark:text-white">
                {item?.name}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">
                Current Stock
              </p>
              <div className="inline-flex items-center justify-center px-3 py-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-base font-mono font-black text-indigo-600 dark:text-indigo-400">
                  {item?.quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 space-y-5">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">
                Action Type
              </Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full shadow-sm"
              >
                <option value="PURCHASE">🛒 Buy (Purchase)</option>
                <option value="SALE">💰 Sell (Shop Mode)</option>
                <option value="DONATION_IN">🎁 Receive Donation</option>
                <option value="DONATION_OUT">💝 Give Donation</option>
                <option value="TRANSFER_OUT">🚚 Transfer to Dept</option>
                <option value="ADJUSTMENT">⚙️ Stock Adjustment</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">
                  Quantity
                </Label>
                <TextInput
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  icon={Plus}
                  className="shadow-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">
                  Price per Unit
                </Label>
                <TextInput
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  icon={DollarSign}
                  className="shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Reference Fields */}
          {(type === "PURCHASE" ||
            type === "DONATION_IN" ||
            type === "DONATION_OUT" ||
            type.includes("TRANSFER")) && (
            <div className="p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
              {type === "PURCHASE" && (
                <div>
                  <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest flex items-center gap-2">
                    <User size={12} /> Supplier
                  </Label>
                  <Select
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {(type === "DONATION_IN" || type === "DONATION_OUT") && (
                <div>
                  <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest flex items-center gap-2">
                    <Heart size={12} /> Donor / Recipient
                  </Label>
                  <Select
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="">Select Party</option>
                    {donors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {type.includes("TRANSFER") && (
                <div>
                  <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest flex items-center gap-2">
                    <Send size={12} /> Target Department
                  </Label>
                  <Select
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Remarks */}
          <div>
            <Label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">
              Remarks
            </Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter transaction details or notes..."
              rows={3}
              className="shadow-sm resize-none"
            />
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
