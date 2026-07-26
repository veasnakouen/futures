import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PosProductDto } from '../../../services/posService';

interface CustomItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: PosProductDto) => void;
    selectedCategory: string;
}

export default function CustomItemModal({ isOpen, onClose, onAdd, selectedCategory }: CustomItemModalProps) {
    const [customName, setCustomName] = useState('');
    const [customPrice, setCustomPrice] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(customPrice);
        if (!customName.trim() || isNaN(priceNum) || priceNum <= 0) {
            toast.error("Please enter a valid item name and price");
            return;
        }

        const customProduct: PosProductDto = {
            id: `cst-${Date.now()}`,
            name: customName.trim(),
            sku: `CST-${Math.floor(1000 + Math.random() * 9000)}`,
            price: priceNum,
            stockQuantity: 999,
            category: 'Custom Service',
            domain: (selectedCategory === 'ALL' ? 'RETAIL' : selectedCategory) as any,
        };

        onAdd(customProduct);
        setCustomName('');
        setCustomPrice('');
        onClose();
        toast.success(`Added "${customProduct.name}" to cart`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <PlusCircle size={16} className="text-blue-600" /> Add Custom Service Item
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Item Description</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Express Consultation Fee"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Price ($ USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                            Add to Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
