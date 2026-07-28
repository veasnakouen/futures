import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Store, Tag, Stethoscope, Bed, GraduationCap, Wifi, WifiOff } from "lucide-react";
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
    const updateStatus = () => {
      setIsOnline(offlineSyncService.isOnline());
      setPendingCount(offlineSyncService.getPendingQueue().length);
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
      <div className="flex items-center justify-between gap-3 mb-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">POS</div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white">Square Register</h1>
            <p className="text-[10px] text-slate-400">Cashier: <span className="font-bold">{cashierName}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search SKU or item..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-slate-50 font-semibold"
            />
          </div>
          <button onClick={onOpenCustomModal} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-1">
            <PlusCircle size={14} /> + Custom Item
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {categoryPills.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              selectedCategory === cat.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <cat.icon size={13} /> {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white dark:bg-slate-900 rounded-xl p-3 border shadow-sm hover:border-blue-500 cursor-pointer flex flex-col justify-between"
            >
              <div className="h-24 rounded-lg bg-slate-100 mb-2 flex items-center justify-center">
                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : <Store size={32} className="text-slate-300" />}
              </div>
              <h3 className="font-bold text-xs truncate">{product.name}</h3>
              <div className="mt-2 flex justify-between items-center border-t pt-1">
                <span className="text-xs font-black text-blue-600">${product.price.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">+ Add</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
