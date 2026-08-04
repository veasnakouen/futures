import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { Package, MapPin, Activity, Box, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

interface Props {
  state: any;
}

export default function InventoryHeaderBar({ state }: Props) {
  const queryClient = useQueryClient();
  const {
    t,
    activeModule,
    handleTabChange,
    fetchedItems,
    search,
    setSearch,
    setTransferDefaultSource,
    setTransferDefaultItem,
    setIsTransferModalOpen,
    setIsEditMode,
    setIsViewMode,
    setEditingId,
    resetForm,
    setIsModalOpen,
  } = state;

  const prefetchTab = (tabId: string) => {
    if (tabId === "locations") {
      queryClient.prefetchQuery({
        queryKey: ["locations-management"],
        queryFn: async () => {
          const res = await api.get("/stock/locations");
          return res.data || [];
        },
        staleTime: 60 * 1000,
      });
    } else if (tabId === "assets") {
      queryClient.prefetchQuery({
        queryKey: ["hrAssets"],
        queryFn: async () => {
          const { data } = await api.get("/stock/hr/assets?page=0&size=1000");
          const list = data?.data?.content || data?.content || data?.data || data || [];
          return Array.isArray(list) ? list : [];
        },
        staleTime: 60 * 1000,
      });
    } else if (tabId === "categories") {
      queryClient.prefetchQuery({
        queryKey: ["inventory-categories"],
        queryFn: async () => {
          const res = await api.get("/stock/categories");
          return res.data || [];
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const criticalItems = fetchedItems.filter(
    (item: any) =>
      item.trackStock && (item.stockQuantity === 0 || item.stockQuantity <= (item.reorderLevel || 0))
  );
  const outOfStockCount = criticalItems.filter((item: any) => item.stockQuantity === 0).length;
  const lowStockCount = criticalItems.length - outOfStockCount;

  return (
    <div className="space-y-4">
      {/* Real-Time Low Stock & Out-of-Stock Alert Banner */}
      {criticalItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30 shrink-0">
              <Package size={20} className="animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                Automated Stock Monitor & Real-Time Warning
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {outOfStockCount} items Out of Stock
                </span>{" "}
                and{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {lowStockCount} items below minimum reorder threshold
                </span>
                .
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearch(search === "stock:critical" ? "" : "stock:critical")}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {search === "stock:critical"
                ? "Show All Items"
                : `Filter Alert Items (${criticalItems.length})`}
            </button>
          </div>
        </div>
      )}

      {/* Action Bar & Sub Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <nav className="flex overflow-x-auto px-2 gap-3 pb-2 scrollbar-hide">
          {[
            { id: "inventory", label: t("inventoryLedger"), icon: <Package size={18} /> },
            { id: "locations", label: t("locationsManagement"), icon: <MapPin size={18} /> },
            { id: "assets", label: t("companyAssets"), icon: <Activity size={18} /> },
            { id: "categories", label: "Categories", icon: <Box size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as any)}
              onMouseEnter={() => prefetchTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
                activeModule === item.id
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md ring-0"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30 ring-1 ring-gray-200 dark:ring-gray-700"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-2">
          <Button
            color="light"
            size="sm"
            onClick={() => {
              setTransferDefaultSource(null);
              setTransferDefaultItem(null);
              setIsTransferModalOpen(true);
            }}
            className="rounded text-[10px] font-bold uppercase tracking-wider h-9"
          >
            <Activity size={14} className="mr-2 text-blue-500" /> {t("transferStock")}
          </Button>
          <Button
            color="blue"
            size="sm"
            onClick={() => {
              setIsEditMode(false);
              setIsViewMode(false);
              setEditingId(null);
              resetForm({
                name: "",
                sku: "",
                category: undefined,
                brand: "",
                stockQuantity: 0,
                reorderLevel: 5,
                price: 0,
                departmentId: undefined,
                description: "",
                imageUrl: "",
              });
              setIsModalOpen(true);
            }}
            className="rounded text-[10px] font-bold uppercase tracking-wider h-9 shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} className="mr-2" /> {t("onboardNewItem")}
          </Button>
        </div>
      </div>
    </div>
  );
}
