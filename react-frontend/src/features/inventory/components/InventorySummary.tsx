import React from "react";
import { CheckCircle, Clock, Package, Send, AlertTriangle, Box } from "lucide-react";

interface InventorySummaryProps {
  stats: {
    valuation: number;
    lowStock: number;
    outOfStock: number;
    totalItems?: number;
  } | null;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ stats }) => {
  // Mock data for new UI features
  const mockRequisitionActivity = [
    { label: "Pending Requests", value: 42, icon: <Clock size={18} />, bg: "bg-blue-50 dark:bg-blue-900/20", color: "text-blue-600 dark:text-blue-400", suffix: "Reqs" },
    { label: "Approved", value: 12, icon: <CheckCircle size={18} />, bg: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-600 dark:text-emerald-400", suffix: "Reqs" },
    { label: "Ready to Dispatch", value: 8, icon: <Package size={18} />, bg: "bg-amber-50 dark:bg-amber-900/20", color: "text-amber-600 dark:text-amber-400", suffix: "Pkgs" },
    { label: "Delivered", value: 156, icon: <Send size={18} />, bg: "bg-indigo-50 dark:bg-indigo-900/20", color: "text-indigo-600 dark:text-indigo-400", suffix: "Pkgs" },
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

  const activePercent = 71;

  return (
    <div className="space-y-6 animate-fade-in text-gray-800 dark:text-gray-200">
      
      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requisition Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Requisition Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockRequisitionActivity.map((act, i) => (
              <div key={i} className={`group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${act.bg}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4 transition-transform group-hover:scale-110 ${act.color}`}>
                  {act.icon}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-black ${act.color}`}>{act.value}</span>
                  <span className="text-xs font-bold uppercase text-gray-400">{act.suffix}</span>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">{act.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white dark:bg-[#0d1117] rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-white/[0.05] relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-indigo-500/10 to-violet-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 relative z-10">Inventory Summary</h3>
          <div className="space-y-5 relative z-10 h-full flex flex-col justify-center pb-8">
            <div className="flex flex-col group cursor-pointer">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Total Valuation</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">${(stats?.valuation || 0).toLocaleString()}</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-gray-100 to-transparent dark:from-white/[0.05]"></div>
            <div className="flex flex-col group cursor-pointer">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Pending Inbound (PO)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-800 dark:text-white">124</span>
                <span className="text-xs font-semibold text-gray-400 uppercase">items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Product Details */}
        <div className="bg-white dark:bg-[#0d1117] rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-white/[0.05] flex flex-col sm:flex-row gap-8 transition-all duration-300 hover:shadow-md">
          <div className="flex-1 space-y-5">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/[0.05] pb-3 mb-4">Product Health</h3>
            
            <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2 group-hover:text-amber-500 transition-colors"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Low Stock Items</span>
              <span className="text-base font-black text-amber-500">{stats?.lowStock || 0}</span>
            </div>
            <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2 group-hover:text-rose-500 transition-colors"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Critical Stock</span>
              <span className="text-base font-black text-rose-500">{stats?.outOfStock || 0}</span>
            </div>
            <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2 group-hover:text-indigo-500 transition-colors"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Total Unique SKUs</span>
              <span className="text-base font-black text-gray-800 dark:text-gray-200">{stats?.totalItems || 0}</span>
            </div>
            <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2 group-hover:text-purple-500 transition-colors"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Unconfirmed Items</span>
              <span className="text-base font-black text-purple-500">121</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center shrink-0 min-w-[160px] border-l border-gray-100 dark:border-white/[0.05] pl-8">
             <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Active Items</span>
             <div className="relative w-32 h-32 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(99,102,241,0.15)]" style={{ background: `conic-gradient(#6366f1 ${activePercent}%, transparent ${activePercent}%)`}}>
               <div className="absolute w-24 h-24 bg-white dark:bg-[#0d1117] rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400">{activePercent}%</span>
               </div>
             </div>
          </div>
        </div>

        {/* Most Consumed Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-gray-700/50 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 mb-6">
             <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Most Consumed Items</h3>
             <span className="text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">This Month ▾</span>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {mockConsumedItems.map((item, i) => (
              <div key={i} className="group flex flex-col items-center justify-center text-center p-4 rounded-xl border border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-750/30 transition-all cursor-pointer">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                    <img src={item.img} alt={item.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-gray-300"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></span>'; }}/>
                 </div>
                 <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate w-full px-2 mb-1 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" title={item.name}>{item.name}</p>
                 <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400">{item.qty} <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Purchase Order */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-gray-700/50 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
           <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 mb-6">
             <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Purchase Orders</h3>
             <span className="text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">This Month ▾</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
             <span className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-2">Quantity Ordered</span>
             <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 drop-shadow-sm">652</span>
          </div>
        </div>

        {/* Internal Transfers Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col">
           <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
             <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Recent Internal Transfers</h3>
             <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider">View All</button>
           </div>
           <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr>
                   <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Route</th>
                   <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Draft</th>
                   <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Confirmed</th>
                   <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Packed</th>
                   <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Shipped</th>
                 </tr>
               </thead>
               <tbody>
                 {mockTransfers.map((t, idx) => (
                   <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors group">
                     <td className="py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700/50">{t.route}</td>
                     <td className="py-4 px-4 text-sm text-center font-bold text-gray-500 dark:text-gray-400 border-b border-gray-50 dark:border-gray-700/50"><span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{t.pending}</span></td>
                     <td className="py-4 px-4 text-sm text-center font-bold text-blue-600 dark:text-blue-400 border-b border-gray-50 dark:border-gray-700/50"><span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">{t.approved}</span></td>
                     <td className="py-4 px-4 text-sm text-center font-bold text-amber-600 dark:text-amber-400 border-b border-gray-50 dark:border-gray-700/50"><span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-full">{t.dispatched}</span></td>
                     <td className="py-4 px-4 text-sm text-center font-bold text-emerald-600 dark:text-emerald-400 border-b border-gray-50 dark:border-gray-700/50"><span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">{t.received}</span></td>
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
