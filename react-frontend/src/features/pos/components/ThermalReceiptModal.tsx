import React from 'react';
import { Printer, CheckCircle2 } from 'lucide-react';
import { PosSaleDto } from '../../../services/posService';
import { CustomerProfile } from './CheckoutModal';

interface ThermalReceiptModalProps {
    data: {
        sale: PosSaleDto;
        customer: CustomerProfile;
        tendered: number;
        change: number;
    } | null;
    onClose: () => void;
}

export default function ThermalReceiptModal({ data, onClose }: ThermalReceiptModalProps) {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 w-full max-w-xs border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col space-y-3">
                <div className="text-center pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
                    <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-1" />
                    <h3 className="font-black text-sm uppercase tracking-wider">Square POS Receipt</h3>
                    <p className="text-[10px] text-slate-400">Date: {new Date(data.sale.transactionDate).toLocaleString()}</p>
                    <p className="text-[11px] font-black text-blue-600 mt-0.5">#{data.sale.receiptNumber}</p>
                </div>

                <div className="text-[11px] space-y-0.5 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                    <p><span className="font-bold text-slate-400">Cashier:</span> {data.sale.cashierName}</p>
                    <p><span className="font-bold text-slate-400">Customer:</span> {data.customer.name}</p>
                    <p><span className="font-bold text-slate-400">Paid Via:</span> {data.sale.paymentMethod}</p>
                </div>

                <div className="max-h-36 overflow-y-auto custom-scrollbar text-[11px] space-y-1 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                    {data.sale.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <span className="font-semibold">{item.quantity}x {item.productName}</span>
                            <span className="font-bold">${item.subtotal.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="text-[11px] space-y-1 font-semibold">
                    <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span>${(data.sale.subtotalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>Total Paid</span>
                        <span className="text-blue-600">${data.sale.totalAmount.toFixed(2)}</span>
                    </div>
                    {data.sale.paymentMethod === 'CASH' && (
                        <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                            <span>Change Due</span>
                            <span>${data.change.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                    >
                        <Printer size={14} /> Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-2 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
