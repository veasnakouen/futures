import React, { useState, useEffect } from "react";
import { Receipt, DollarSign, Percent, Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../services/api";

const PROMOTIONS = [
  { id: "NONE", name: "No Promotion", type: "PERCENT", value: 0 },
  { id: "DENTAL20", name: "Dental Services 20% Off", type: "PERCENT", value: 20 },
  { id: "SENIOR10", name: "Senior Citizen 10% Off", type: "PERCENT", value: 10 },
  { id: "NEWYEAR50", name: "New Year Flat $50 Off", type: "FLAT", value: 50 },
];

const TAX_RATE = 10; // 10% default tax

export default function GenerateInvoiceModal({ record, onClose }: { record: any; onClose: () => void }) {
  const [baseAmount, setBaseAmount] = useState(150.0); // Mocking base amount since the service doesn't store price per diagnosis directly
  const [selectedPromoId, setSelectedPromoId] = useState("NONE");
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculations
  const hasPoorId = !!record.patient.poorId;
  const poorIdDiscountValue = hasPoorId ? (baseAmount * 0.5) : 0; // 50% discount for poor ID
  
  const selectedPromo = PROMOTIONS.find(p => p.id === selectedPromoId)!;
  let promoDiscountValue = 0;
  if (selectedPromo.type === "PERCENT") {
    promoDiscountValue = baseAmount * (selectedPromo.value / 100);
  } else {
    promoDiscountValue = selectedPromo.value;
  }

  const subTotal = baseAmount;
  const totalDiscounts = poorIdDiscountValue + promoDiscountValue;
  const taxableAmount = Math.max(0, subTotal - totalDiscounts);
  const taxAmount = taxableAmount * (TAX_RATE / 100);
  const grandTotal = taxableAmount + taxAmount;

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        invoiceNumber: `INV-${Date.now()}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "DRAFT",
        referenceId: record.id,
        sourceModule: "CLINIC",
        subTotal,
        taxRate: TAX_RATE,
        taxTotal: taxAmount,
        promotionDiscount: promoDiscountValue,
        poorIdDiscount: poorIdDiscountValue,
        discountTotal: totalDiscounts,
        grandTotal,
        lineItems: [
          {
            itemCode: "CONSULT",
            description: `Consultation - ${record.diagnosis || "General"}`,
            quantity: 1,
            unitPrice: baseAmount,
            total: baseAmount
          }
        ]
      };
      
      // Assume billing service is at API gateway /api/billing/invoices
      await api.post('/billing/invoices', payload);
      alert("Invoice generated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to generate invoice", error);
      alert("Failed to generate invoice. Ensure Billing Service is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Receipt className="text-emerald-500" /> Generate Invoice
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {/* Patient summary */}
          <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-600 font-bold">
              {record.patient.firstName.charAt(0)}{record.patient.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{record.patient.firstName} {record.patient.lastName}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Diagnosis: {record.diagnosis || "Consultation"}</span>
                {hasPoorId && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Poor ID: {record.patient.poorId}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Base Consultation Fee ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Apply Promotion</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={selectedPromoId}
                    onChange={(e) => setSelectedPromoId(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                  >
                    {PROMOTIONS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calculator size={18} className="text-gray-400" /> Calculation Summary
              </h3>
              
              <div className="space-y-3 text-sm flex-1">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium">${subTotal.toFixed(2)}</span>
                </div>
                
                {hasPoorId && (
                  <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                    <span>Poor ID Discount (50%)</span>
                    <span className="font-medium">-${poorIdDiscountValue.toFixed(2)}</span>
                  </div>
                )}
                
                {promoDiscountValue > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <span>Promotion Discount</span>
                    <span className="font-medium">-${promoDiscountValue.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Tax ({TAX_RATE}%)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white text-lg">Grand Total</span>
                <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateInvoice}
            disabled={isGenerating}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
          >
            {isGenerating ? "Processing..." : "Confirm & Create Invoice"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
