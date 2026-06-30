import React from "react";
import { Card } from '@/lib/flowbite-compat';
import { Box, AlertTriangle, ShoppingCart } from "lucide-react";

interface InventorySummaryProps {
  stats: {
    valuation: number;
    lowStock: number;
    outOfStock: number;
  } | null;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ stats }) => {
  const summaryItems = [
    {
      label: "Total Valuation",
      val: `$${(stats?.valuation || 0).toLocaleString()}`,
      icon: <Box size={24} />,
      color: "blue",
    },
    {
      label: "Low Stock Items",
      val: stats?.lowStock || 0,
      icon: <AlertTriangle size={24} />,
      color: "amber",
    },
    {
      label: "Out of Stock",
      val: stats?.outOfStock || 0,
      icon: <ShoppingCart size={24} />,
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaryItems.map((item, i) => (
        <Card
          key={i}
          className="border-none shadow-sm dark:bg-gray-800 rounded-md p-8 group hover:scale-[1.02] transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {item.label}
              </p>
              <p className="text-3xl font-black dark:text-white mt-2 leading-none">
                {item.val}
              </p>
            </div>
            <div
              className={`p-4 rounded-md shadow-sm transition-all ${
                item.color === "blue" ? "bg-gray-50 dark:bg-gray-700/50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
                item.color === "amber" ? "bg-gray-50 dark:bg-gray-700/50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white" :
                "bg-gray-50 dark:bg-gray-700/50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
              }`}
            >
              {item.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InventorySummary;
