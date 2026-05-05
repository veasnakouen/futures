import React from 'react';
import { Card } from 'flowbite-react';
import { Box, AlertTriangle, ShoppingCart } from 'lucide-react';

interface InventorySummaryProps {
  items: any[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ items }) => {
  const valuation = items.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity && i.quantity > 0).length;
  const outOfStockCount = items.filter(i => i.quantity === 0).length;

  const summaryItems = [
    { label: 'Total Valuation', val: `$${valuation.toLocaleString()}`, icon: <Box size={24}/>, color: 'blue' },
    { label: 'Low Stock Items', val: lowStockCount, icon: <AlertTriangle size={24}/>, color: 'amber' },
    { label: 'Out of Stock', val: outOfStockCount, icon: <ShoppingCart size={24}/>, color: 'rose' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaryItems.map((item, i) => (
        <Card key={i} className="border-none shadow-sm dark:bg-gray-800 rounded-lg p-8 group hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-3xl font-black dark:text-white mt-2 leading-none">{item.val}</p>
            </div>
            <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-${item.color === 'blue' ? 'blue-600' : item.color === 'amber' ? 'amber-500' : 'rose-600'} shadow-sm group-hover:bg-${item.color === 'blue' ? 'blue-600' : item.color === 'amber' ? 'amber-500' : 'rose-600'} group-hover:text-white transition-all`}>
              {item.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InventorySummary;
