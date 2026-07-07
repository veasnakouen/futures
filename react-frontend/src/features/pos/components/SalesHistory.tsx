import React, { useState, useEffect } from 'react';
import { posService, PosSaleDto } from '../../../services/posService';
import { Receipt, Calendar, ChevronDown, ChevronRight, Package } from 'lucide-react';

import { toast } from 'react-hot-toast';

export default function SalesHistory() {
    const [sales, setSales] = useState<PosSaleDto[]>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const data = await posService.getAllSales();
            setSales(data);
        } catch (error: any) {
            toast.error(`Failed to load sales: ${error.message || "Unknown error"}`);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Receipt className="text-blue-600" /> Sales History
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">View past transactions and itemized receipts.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-4 w-10"></th>
                                <th className="p-4">Receipt #</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Cashier</th>
                                <th className="p-4">Payment Method</th>
                                <th className="p-4 text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {sales.map(sale => (
                                <React.Fragment key={sale.id}>
                                    <tr 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => toggleRow(sale.id)}
                                    >
                                        <td className="p-4 text-gray-400">
                                            {expandedRow === sale.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-900 dark:text-white">
                                            {sale.receiptNumber}
                                        </td>
                                        <td className="p-4 text-gray-500 flex items-center gap-2">
                                            <Calendar size={14} /> {new Date(sale.transactionDate).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-500">{sale.cashierId}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-black text-gray-900 dark:text-white">
                                            ${sale.totalAmount.toFixed(2)}
                                        </td>
                                    </tr>
                                    {expandedRow === sale.id && (
                                        <tr className="bg-gray-50 dark:bg-gray-800/30">
                                            <td colSpan={6} className="p-0 border-t">
                                                <div className="p-6 ml-10">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                        <Package size={16} className="text-gray-400" /> Itemized Receipt
                                                    </h4>
                                                    <table className="w-full max-w-3xl border-collapse">
                                                        <thead>
                                                            <tr className="text-xs uppercase text-gray-500 border-b">
                                                                <th className="pb-2">Product Name</th>
                                                                <th className="pb-2 text-right">Quantity</th>
                                                                <th className="pb-2 text-right">Unit Price</th>
                                                                <th className="pb-2 text-right">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                            {sale.items && sale.items.length > 0 ? (
                                                                sale.items.map(item => (
                                                                    <tr key={item.id}>
                                                                        <td className="py-2 text-sm text-gray-900 dark:text-gray-300 font-semibold">{item.productName}</td>
                                                                        <td className="py-2 text-sm text-gray-500 text-right">{item.quantity}</td>
                                                                        <td className="py-2 text-sm text-gray-500 text-right">${item.unitPrice.toFixed(2)}</td>
                                                                        <td className="py-2 text-sm text-gray-900 dark:text-white text-right font-bold">${item.subtotal.toFixed(2)}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4} className="py-4 text-sm text-gray-500 italic">No item details available for this legacy transaction.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No sales recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
