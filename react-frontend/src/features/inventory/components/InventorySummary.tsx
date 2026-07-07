import React from "react";
import { CheckCircle, Clock, Package, Send, AlertTriangle } from "lucide-react";

interface InventorySummaryProps {
  stats: {
    valuation: number;
    lowStock: number;
    outOfStock: number;
  } | null;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ stats }) => {
  // Mock data for new UI features
  const mockRequisitionActivity = [
    { label: "Pending Requests", value: 42, icon: <Clock size={16} />, color: "text-blue-500", suffix: "Reqs" },
    { label: "Approved", value: 12, icon: <CheckCircle size={16} />, color: "text-emerald-500", suffix: "Reqs" },
    { label: "Ready for Dispatch", value: 8, icon: <Package size={16} />, color: "text-amber-500", suffix: "Pkgs" },
    { label: "Delivered", value: 156, icon: <Send size={16} />, color: "text-indigo-500", suffix: "Pkgs" },
  ];

  const mockConsumedItems = [
    { name: "Surgical Masks (Box of 50)", category: "Medical Supplies", qty: 245, unit: "boxes", img: "https://res.cloudinary.com/dvfni2xli/image/upload/v1718042457/mask_placeholder.png" },
    { name: "Printer Paper A4", category: "Office Supplies", qty: 85, unit: "reams", img: "https://res.cloudinary.com/dvfni2xli/image/upload/v1718042457/paper_placeholder.png" }
  ];

  const mockTransfers = [
    { route: "Main WH -> Clinic A", pending: 0, approved: 12, dispatched: 0, received: 45 },
    { route: "Main WH -> School Library", pending: 5, approved: 2, dispatched: 1, received: 0 },
    { route: "Clinic B -> Lab", pending: 0, approved: 0, dispatched: 0, received: 18 },
  ];

  const activePercent = 71; // Match screenshot

  return (
    <div className="space-y-6 animate-fade-in text-gray-800 dark:text-gray-200">
      
      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requisition Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Requisition Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockRequisitionActivity.map((act, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-5 px-2 rounded-lg hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-750/50">
                <span className={`text-4xl font-light ${act.color}`}>{act.value}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2 mt-1">{act.suffix}</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 border-t pt-3 w-full justify-center">
                  {act.icon} {act.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Inventory Summary</h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center p-4 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Valuation</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">${(stats?.valuation || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Inbound (PO)</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">124 <span className="text-xs text-gray-400 font-normal">items</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Product Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row gap-8">
          <div className="flex-1 space-y-5">
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b pb-2 mb-4">Product Details</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-rose-500 flex items-center gap-2"><AlertTriangle size={14}/> Low Stock Items</span>
              <span className="text-base font-bold text-rose-500">{stats?.lowStock || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Critical Stock</span>
              <span className="text-base font-bold text-gray-800 dark:text-gray-200">{stats?.outOfStock || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Unique SKUs</span>
              <span className="text-base font-bold text-gray-800 dark:text-gray-200">190</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-rose-500 flex items-center gap-2"><AlertTriangle size={14}/> Unconfirmed Items</span>
              <span className="text-base font-bold text-rose-500">121</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center shrink-0 min-w-[140px]">
             <span className="text-xs font-semibold text-gray-500 mb-2">Active Items</span>
             <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-emerald-500" style={{ background: `conic-gradient(#10b981 ${activePercent}%, #e5e7eb ${activePercent}%)`}}>
               <div className="absolute w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{activePercent}%</span>
               </div>
             </div>
          </div>
        </div>

        {/* Most Consumed Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
             <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Most Consumed Items</h3>
             <span className="text-xs text-gray-400 font-semibold cursor-pointer hover:text-blue-500">This Month ▾</span>
          </div>
          <div className="grid grid-cols-2 gap-4 h-[160px]">
            {mockConsumedItems.map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-3 border-r last:border-0">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    <img src={item.img} alt={item.name} className="object-cover w-full h-full opacity-60" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-400">No Image</span>'; }}/>
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 truncate w-full px-2" title={item.name}>{item.name}</p>
                 <p className="text-2xl font-black text-gray-800 dark:text-gray-200 mt-1">{item.qty} <span className="text-[10px] font-semibold text-gray-500 uppercase">{item.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Purchase Order */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
           <div className="flex justify-between items-center border-b pb-2 mb-4">
             <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Purchase Order</h3>
             <span className="text-xs text-gray-400 font-semibold cursor-pointer hover:text-blue-500">This Month ▾</span>
          </div>
          <div className="flex flex-col items-center justify-center h-32">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Quantity Ordered</span>
             <span className="text-5xl font-light text-blue-600">652.00</span>
          </div>
        </div>

        {/* Internal Transfers Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
           <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b pb-2 mb-4">Recent Internal Transfers</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr>
                   <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b bg-gray-50 dark:bg-gray-800/50">Route</th>
                   <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b bg-gray-50 dark:bg-gray-800/50 text-center">Draft</th>
                   <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b bg-gray-50 dark:bg-gray-800/50 text-center">Confirmed</th>
                   <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b bg-gray-50 dark:bg-gray-800/50 text-center">Packed</th>
                   <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b bg-gray-50 dark:bg-gray-800/50 text-center">Shipped</th>
                 </tr>
               </thead>
               <tbody>
                 {mockTransfers.map((t, idx) => (
                   <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                     <td className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b">{t.route}</td>
                     <td className="py-3 px-4 text-sm text-center font-medium text-gray-600 dark:text-gray-400 border-b">{t.pending}</td>
                     <td className="py-3 px-4 text-sm text-center font-medium text-gray-600 dark:text-gray-400 border-b">{t.approved}</td>
                     <td className="py-3 px-4 text-sm text-center font-medium text-gray-600 dark:text-gray-400 border-b">{t.dispatched}</td>
                     <td className="py-3 px-4 text-sm text-center font-medium text-gray-600 dark:text-gray-400 border-b">{t.received}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default InventorySummary;
