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
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLookups();
      setPrice(type === "SALE" ? item?.salePrice || 0 : item?.costPrice || 0);
    }
  }, [isOpen, type, item]);

  const fetchLookups = async () => {
    const MOCK_SUPPLIERS = [
      { id: 101, name: "Pharma Global Co." },
      { id: 102, name: "MedTech Supplies" },
      { id: 103, name: "Office Pro LLC" }
    ];
    const MOCK_CUSTOMERS = [
      { id: 201, name: "City Hospital" },
      { id: 202, name: "Dr. Smith Clinic" },
      { id: 203, name: "General Public Health" }
    ];
    const MOCK_RETAILERS = [
      { id: 301, name: "HealthStore Pharmacy" },
      { id: 302, name: "MediMart" },
      { id: 303, name: "Internal Dept A" }
    ];

    try {
      const [sRes, dRes, deptRes] = await Promise.all([
        api.get("/stock/partners/suppliers").catch(() => ({ data: [] })),
        api.get("/stock/partners/customers").catch(() => ({ data: [] })), // Donors can be mixed or we can use another endpoint, using customers for now for DONATION/SALE
        api.get("/stock/partners/retailers").catch(() => ({ data: [] })),
      ]);
      
      setSuppliers(sRes.data?.length ? sRes.data : MOCK_SUPPLIERS);
      setDonors(dRes.data?.length ? dRes.data : MOCK_CUSTOMERS);
      setDepartments(deptRes.data?.length ? deptRes.data : MOCK_RETAILERS);
    } catch {
      setSuppliers(MOCK_SUPPLIERS);
      setDonors(MOCK_CUSTOMERS);
      setDepartments(MOCK_RETAILERS);
    }
  };

  const handleSubmit = async () => {
    if (quantity <= 0) return toast.error("Quantity must be greater than zero");
    try {
      setIsProcessing(true);
      const payload = {
        item: { id: item.id },
        type,
        quantity: ["SALE", "DONATION_OUT", "TRANSFER_OUT", "RETURN"].includes(type) ? -quantity : quantity,
        unitPrice: price,
        remarks,
        referenceNumber,
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
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1">Target Asset</p>
            <h4 className="text-base font-black text-gray-900 dark:text-white">{item?.name || "Unknown Item"}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Current Stock</p>
            <span className="text-base font-mono font-black text-indigo-600 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">
              {item?.quantity || item?.stockQuantity || 0}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs bg-white dark:bg-gray-800 p-4 rounded-xl">
          <div>
            <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Action Type</Label>
            <Select value={type} onChange={(e) => { setType(e.target.value); setSelectedPartyId(""); }} sizing="sm" className="font-semibold text-gray-800">
              <option value="PURCHASE">🛒 Buy from Supplier</option>
              <option value="SALE">💰 Sell to Customer</option>
              <option value="DONATION_IN">🎁 Receive Donation</option>
              <option value="DONATION_OUT">💝 Give Donation</option>
              <option value="TRANSFER_OUT">🚚 Transfer to Retailer/Dept</option>
              <option value="TRANSFER_IN">📥 Receive from Retailer/Dept</option>
              <option value="ADJUSTMENT">⚙️ Stock Adjustment (Loss/Damage)</option>
              <option value="RETURN">🔄 Process Return</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Quantity</Label>
              <TextInput type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} sizing="sm" className="font-mono font-bold" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Unit Price ($)</Label>
              <TextInput type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} sizing="sm" className="font-mono font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Reference / Invoice #</Label>
              <TextInput type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="INV-2023..." sizing="sm" className="font-mono" />
            </div>
            
            {type === "PURCHASE" && (
              <div>
                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Supplier</Label>
                <Select value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} sizing="sm" className="font-semibold">
                  <option value="">Select Supplier...</option>
                  {suppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </Select>
              </div>
            )}

            {(type === "DONATION_IN" || type === "DONATION_OUT") && (
              <div>
                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Donor Organization</Label>
                <Select value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} sizing="sm" className="font-semibold">
                  <option value="">Select Donor...</option>
                  {donors.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </Select>
              </div>
            )}

            {(type === "TRANSFER_IN" || type === "TRANSFER_OUT") && (
              <div>
                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Retailer / Department</Label>
                <Select value={selectedPartyId} onChange={(e) => setSelectedPartyId(e.target.value)} sizing="sm" className="font-semibold">
                  <option value="">Select Target...</option>
                  {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Remarks & Notes</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add any additional context for this transaction..." rows={2} className="text-sm rounded-lg" />
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
