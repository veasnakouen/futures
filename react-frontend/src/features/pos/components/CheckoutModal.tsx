import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, CreditCard, Banknote, CheckCircle, Loader2, ArrowRight, UserCheck, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../services/api";
import CheckoutPaymentMethods, { PaymentMethod } from "./checkout/CheckoutPaymentMethods";

export interface CustomerProfile {
  id: string;
  name: string;
  type: "WALK_IN" | "PATIENT" | "GUEST" | "STUDENT" | "CLIENT";
  info?: string;
}

const CUSTOMER_OPTIONS: CustomerProfile[] = [
  { id: "c-0", name: "Walk-in Customer (General)", type: "WALK_IN" },
  { id: "c-1", name: "Sokha Chan (Patient #PT-8801)", type: "PATIENT", info: "Clinic OPD" },
  { id: "c-2", name: "Michael Scott (Guest Room #304)", type: "GUEST", info: "Hotel Deluxe" },
  { id: "c-3", name: "Vireak Bopha (Student #ST-104)", type: "STUDENT", info: "Grade 11-A" },
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  onConfirm: (checkoutDetails: {
    paymentMethod: PaymentMethod;
    tenderedAmount: number;
    changeAmount: number;
    customer: CustomerProfile;
    cardAuthCode?: string;
  }) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
}: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CASH");
  const [qrState, setQrState] = useState<"IDLE" | "WAITING" | "SUCCESS">("IDLE");
  const [tenderedInput, setTenderedInput] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(CUSTOMER_OPTIONS[0]);

  const exchangeRateKHR = 4100;

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod("CASH");
      setQrState("IDLE");
      setTenderedInput(totalAmount.toFixed(2));
      setSelectedCustomer(CUSTOMER_OPTIONS[0]);
    }
  }, [isOpen, totalAmount]);

  const tenderedNum = parseFloat(tenderedInput) || 0;
  const changeDueUSD = Math.max(0, tenderedNum - totalAmount);
  const isCashInsufficient = selectedMethod === "CASH" && tenderedNum < totalAmount;

  const handleConfirmCash = () => {
    if (isCashInsufficient) return;
    onConfirm({ paymentMethod: "CASH", tenderedAmount: tenderedNum, changeAmount: changeDueUSD, customer: selectedCustomer });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2">
              <CreditCard className="text-blue-600" /> POS Checkout Terminal
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Payable</p>
              <h3 className="text-3xl font-black">${totalAmount.toFixed(2)}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold opacity-80">Equivalent KHR</p>
              <p className="text-lg font-extrabold">៛{(Math.round(totalAmount * exchangeRateKHR)).toLocaleString()}</p>
            </div>
          </div>

          <CheckoutPaymentMethods selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />

          {selectedMethod === "CASH" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tendered Cash ($ USD)</label>
                <input type="number" step="0.01" value={tenderedInput} onChange={(e) => setTenderedInput(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border font-black text-lg" />
              </div>
              <button onClick={handleConfirmCash} disabled={isCashInsufficient} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl">
                Complete Cash Transaction
              </button>
            </div>
          )}

          {selectedMethod === "QR_CODE" && (
            <div className="flex flex-col items-center py-4 space-y-3">
              <QRCodeSVG value={`https://mtp.pay/qr?amount=${totalAmount}`} size={160} />
              <p className="text-xs text-slate-500 font-medium">Scan with ABA Mobile, ACLEDA, or Bakong App</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
