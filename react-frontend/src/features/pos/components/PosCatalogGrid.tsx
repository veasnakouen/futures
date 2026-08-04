import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Store, Tag, Stethoscope, Bed, GraduationCap } from "lucide-react";
import { PosProductDto } from "../../../services/posService";
import { offlineSyncService } from "../../../services/offlineSyncService";

export type CategoryFilter = "ALL" | "RETAIL" | "CLINIC" | "HOTEL" | "SCHOOL";

interface PosCatalogGridProps {
  products: PosProductDto[];
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: PosProductDto) => void;
  onOpenCustomModal: () => void;
  cashierName: string;
}

export default function PosCatalogGrid({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onOpenCustomModal,
  cashierName,
}: PosCatalogGridProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const updateStatus = async () => {
      setIsOnline(offlineSyncService.isOnline());
      const queue = await offlineSyncService.getPendingQueue();
      setPendingCount(queue.length);
    };
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const categoryPills: { id: CategoryFilter; label: string; icon: any }[] = [
    { id: "ALL", label: "All Items", icon: Store },
    { id: "RETAIL", label: "Retail", icon: Tag },
    { id: "CLINIC", label: "Clinic", icon: Stethoscope },
    { id: "HOTEL", label: "Hotel", icon: Bed },
    { id: "SCHOOL", label: "School", icon: GraduationCap },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 p-5 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">POS</div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Square Register</h1>
            <p className="text-[10px] text-slate-400">Cashier: <span className="font-bold text-slate-700 dark:text-slate-300">{cashierName}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-60">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search SKU or item..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button onClick={onOpenCustomModal} className="px-3.5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-extrabold flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
            <PlusCircle size={14} /> Custom Item
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 custom-scrollbar">
        {categoryPills.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <cat.icon size={14} /> {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group border-none"
            >
              <div className="h-28 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <Store size={32} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate mb-1">{product.name}</h3>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</span>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  + Add
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
