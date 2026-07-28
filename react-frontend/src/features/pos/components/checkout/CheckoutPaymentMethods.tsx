import React from "react";
import { Banknote, CreditCard } from "lucide-react";

export type PaymentMethod = "CASH" | "QR_CODE" | "CARD";

interface CheckoutPaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const CheckoutPaymentMethods: React.FC<CheckoutPaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={() => onSelectMethod("CASH")}
        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
          selectedMethod === "CASH"
            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 font-bold"
            : "border-slate-200 text-slate-600 hover:border-blue-300"
        }`}
      >
        <Banknote size={24} className="mb-1" />
        <span className="text-xs font-bold">Cash</span>
      </button>

      <button
        onClick={() => onSelectMethod("QR_CODE")}
        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
          selectedMethod === "QR_CODE"
            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 font-bold"
            : "border-slate-200 text-slate-600 hover:border-indigo-300"
        }`}
      >
        <div className="grid grid-cols-2 gap-0.5 mb-1 w-6 h-6 opacity-90">
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
          <div className="bg-current rounded-sm"></div>
        </div>
        <span className="text-xs font-bold">KHQR Scan</span>
      </button>

      <button
        onClick={() => onSelectMethod("CARD")}
        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
          selectedMethod === "CARD"
            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 font-bold"
            : "border-slate-200 text-slate-600 hover:border-emerald-300"
        }`}
      >
        <CreditCard size={24} className="mb-1" />
        <span className="text-xs font-bold">Card</span>
      </button>
    </div>
  );
};

export default CheckoutPaymentMethods;
