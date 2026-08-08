import React from "react";
import { History } from "lucide-react";

interface InventoryItemStockHistoryProps {
  historyLoading: boolean;
  stockHistory: any[];
}

const InventoryItemStockHistory: React.FC<InventoryItemStockHistoryProps> = ({
  historyLoading,
  stockHistory,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-black dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
        <History size={16} className="text-blue-500" /> Stock Movement Ledger
      </h4>

      {historyLoading ? (
        <div className="animate-pulse h-12 bg-gray-200 rounded w-full"></div>
      ) : stockHistory.length === 0 ? (
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No stock movement history available.</p>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-auto border max-h-[400px] relative">
          <table className="w-full text-left text-xs">
            <thead className="bg-white dark:bg-gray-800 text-[9px] uppercase tracking-widest text-gray-400 font-black sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb] dark:shadow-[0_1px_0_0_#374151]">
              <tr>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Qty Shift</th>
                <th className="px-4 py-2 border-b">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stockHistory.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-white dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-mono text-[10px]">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-bold">{tx.type}</td>
                  <td className={`px-4 py-2 font-mono font-bold ${tx.quantity > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                  </td>
                  <td className="px-4 py-2 font-bold">{tx.createdBy || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryItemStockHistory;
