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
        <div className="w-80 xl:w-96 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 flex flex-col shadow-xl shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-blue-600" />
                    <h2 className="font-black text-sm text-slate-900 dark:text-white">
                        Current Order ({totalItemCount})
                    </h2>
                </div>
                {cart.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2.5">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                            <ShoppingCart size={24} className="opacity-40" />
                        </div>
                        <p className="font-bold text-xs text-slate-600 dark:text-slate-400">Cart is empty</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click any item from the catalog to build an order</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.product.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0 pr-1">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                                    {item.product.name}
                                </h4>
                                <p className="text-[11px] font-semibold text-slate-400">
                                    ${item.product.price.toFixed(2)} / unit
                                </p>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shrink-0">
                                <button
                                    onClick={() => onUpdateQuantity(item.product.id!, -1)}
                                    className="p-1 text-slate-500 hover:text-red-500 transition-colors"
                                >
                                    {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                </button>
                                <span className="font-black text-xs w-4 text-center text-slate-900 dark:text-white">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.product.id!, 1)}
                                    className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
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
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 space-y-2.5 shrink-0">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tax</label>
                        <select
                            value={taxRate}
                            onChange={(e) => onTaxRateChange(parseFloat(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
                        >
                            <option value={0.10}>10% VAT</option>
                            <option value={0.05}>5% Tax</option>
                            <option value={0.00}>Exempt (0%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Discount ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={orderDiscount || ''}
                            onChange={(e) => onOrderDiscountChange(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
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
                    <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span>Total</span>
                        <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={onProceedCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-sm"
                >
                    <CreditCard size={18} /> Proceed to Checkout
                </button>
            </div>
        </div>
    );
}
