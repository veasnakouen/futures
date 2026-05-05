import React from 'react';
import { Badge, Progress, Button } from 'flowbite-react';
import { Box, MapPin, Edit3, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  items: any[];
  handleEdit: (item: any) => void;
  handleDelete: (id: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, handleEdit, handleDelete }) => {
  const getStockStatus = (quantity: number, min: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'failure' };
    if (quantity <= min) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const calculateStockPercentage = (quantity: number, min: number) => {
    const target = min * 3;
    return Math.min(Math.round((quantity / target) * 100), 100);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-700/30 border-b dark:border-gray-700">
          <tr>
            <th className="px-8 py-5">Item Description</th>
            <th className="px-8 py-5">Stock Level</th>
            <th className="px-8 py-5">Unit Valuation</th>
            <th className="px-8 py-5">Storage Node</th>
            <th className="px-8 py-5">System Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((item) => {
            const status = getStockStatus(item.quantity, item.minQuantity);
            return (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-inner group-hover:bg-white dark:group-hover:bg-gray-700 transition-all overflow-hidden border dark:border-gray-600">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Box size={22} />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-gray-900 dark:text-white leading-tight text-lg">{item.name}</p>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{item.sku || 'NO-SKU'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 w-72">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="dark:text-gray-300">{item.quantity} <span className="text-gray-400">{item.unit}</span></span>
                      <span className="text-gray-400">Min Threshold: {item.minQuantity}</span>
                    </div>
                    <Progress
                      progress={calculateStockPercentage(item.quantity, item.minQuantity)}
                      color={status.color === 'failure' ? 'red' : status.color === 'warning' ? 'yellow' : 'green'}
                      size="sm"
                      className="shadow-sm"
                    />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black dark:text-white text-md tabular-nums">${item.unitPrice?.toFixed(2)}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-black uppercase text-[10px] tracking-widest">
                    <MapPin size={14} className="text-rose-500" />
                    <span>{item.location || 'Warehouse'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge color={status.color} className="rounded-full px-5 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {status.label}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => handleEdit(item)} className="p-3 bg-white dark:bg-gray-700 text-blue-600 border dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-sm transition-all"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-white dark:bg-gray-700 text-rose-600 border dark:border-gray-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 shadow-sm transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
