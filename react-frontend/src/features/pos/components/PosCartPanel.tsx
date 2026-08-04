import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { CartItem } from '../hooks/usePosCart';

interface PosCartPanelProps {
    cart: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onClearCart: () => void;
    taxRate: number;
    onTaxRateChange: (rate: number) => void;
    orderDiscount: number;
    onOrderDiscountChange: (discount: number) => void;
    subtotal: number;
    taxAmount: number;
    finalTotal: number;
    totalItemCount: number;
    onProceedCheckout: () => void;
}

export default function PosCartPanel({
    cart,
    onUpdateQuantity,
    onClearCart,
    taxRate,
    onTaxRateChange,
    orderDiscount,
    onOrderDiscountChange,
    subtotal,
    taxAmount,
    finalTotal,
    totalItemCount,
    onProceedCheckout,
}: PosCartPanelProps) {
    return (
        <div className="w-80 xl:w-96 bg-white dark:bg-slate-900 flex flex-col shadow-2xl rounded-l-3xl shrink-0 border-none">
            {/* Header */}
            <div className="p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <ShoppingCart size={18} />
                    </div>
                    <h2 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                        Current Order <span className="text-blue-600 font-extrabold">({totalItemCount})</span>
                    </h2>
                </div>
                {cart.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-3">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center mb-3 shadow-inner">
                            <ShoppingCart size={28} className="opacity-40 text-slate-500" />
                        </div>
                        <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Cart is empty</p>
                        <p className="text-[11px] text-slate-400 mt-1">Click any item from the catalog to build an order</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.product.id} className="bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-2.5">
                            <div className="flex-1 min-w-0 pr-1">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                                    {item.product.name}
                                </h4>
                                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                                    ${item.product.price.toFixed(2)} / unit
                                </p>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 shadow-xs rounded-xl p-1 shrink-0">
                                <button
                                    onClick={() => onUpdateQuantity(item.product.id!, -1)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                </button>
                                <span className="font-black text-xs w-4 text-center text-slate-900 dark:text-white">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.product.id!, 1)}
                                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>

                            {/* Line Subtotal */}
                            <div className="w-16 text-right font-black text-xs text-slate-900 dark:text-white shrink-0">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Calculations Footer */}
            <div className="p-5 bg-slate-50/90 dark:bg-slate-800/50 rounded-t-3xl shadow-inner space-y-3 shrink-0">
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax</label>
                        <select
                            value={taxRate}
                            onChange={(e) => onTaxRateChange(parseFloat(e.target.value))}
                            className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shadow-xs"
                        >
                            <option value={0.10}>10% VAT</option>
                            <option value={0.05}>5% Tax</option>
                            <option value={0.00}>Exempt (0%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discount ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={orderDiscount || ''}
                            onChange={(e) => onOrderDiscountChange(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shadow-xs"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2">
                    <div className="flex justify-between text-slate-500 font-medium">
                        <span>Subtotal</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
                    </div>
                    {orderDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Discount</span>
                            <span>-${orderDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-slate-500 font-medium">
                        <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-3">
                        <span>Total</span>
                        <span className="text-blue-600 font-black">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={onProceedCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] text-sm"
                >
                    <CreditCard size={18} /> Pay Now (${finalTotal.toFixed(2)})
                </button>
            </div>
        </div>
    );
}
