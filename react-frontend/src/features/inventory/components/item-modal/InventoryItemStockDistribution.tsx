import React from "react";
import { MapPin } from "lucide-react";

interface InventoryItemStockDistributionProps {
  distLoading: boolean;
  stockDistribution: any[];
}

const InventoryItemStockDistribution: React.FC<InventoryItemStockDistributionProps> = ({
  distLoading,
  stockDistribution,
}) => {
  return (
    <div className="mt-6 pt-6 border-t">
      <h4 className="text-xs font-black dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-blue-500" /> Stock Location Distribution
      </h4>

      {distLoading ? (
        <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>
      ) : stockDistribution.length === 0 ? (
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No stock distribution recorded.</p>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-auto border max-h-[400px] relative">
          <table className="w-full text-left text-xs">
            <thead className="bg-white dark:bg-gray-800 text-[9px] uppercase tracking-widest text-gray-400 font-black sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb] dark:shadow-[0_1px_0_0_#374151]">
              <tr>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {stockDistribution.map((dist: any) => (
                <tr key={dist.id} className="hover:bg-white dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-black dark:text-gray-300">{dist.location?.name || "Main Warehouse"}</td>
                  <td className="px-4 py-2 text-[9px] uppercase">{dist.location?.type || "Storage"}</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-blue-600">{dist.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryItemStockDistribution;
