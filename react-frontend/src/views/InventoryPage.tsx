import { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Card, Button, Spinner } from '@/lib/flowbite-compat';
import { Package, Plus, Activity, History } from "lucide-react";
import { Link, useSearchParams } from '@/lib/react-router-compat';
import Layout from "@/components/common/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inventorySchema,
  type InventoryFormData,
} from "../schemas/inventorySchema";

// Modular Components
import InventorySummary from "@/features/inventory/components/InventorySummary";
import InventoryFilters from "@/features/inventory/components/InventoryFilters";
import InventoryTable from "@/features/inventory/components/InventoryTable";
import InventoryItemModal from "@/features/inventory/components/InventoryItemModal";
import AssetsModule from "@/features/hr/components/AssetsModule";
import { motion, AnimatePresence } from "framer-motion";
import { useHRStore } from "@/store/hrStore";

const InventoryPage = ({ isDark, setIsDark }: any) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'assets' ? 'assets' : 'inventory';
  const [activeModule, setActiveModule] = useState<"inventory" | "assets">(initialTab);

  useEffect(() => {
    fetchGlobalData();
    const tab = searchParams?.get('tab');
    if (tab === 'assets' || tab === 'inventory') {
      setActiveModule(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "inventory" | "assets") => {
    setActiveModule(tab);
    setSearchParams({ tab });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // HR Store for Assets
  const {
    globalAssets,
    globalEmployees,
    assignAsset,
    returnAsset,
    updateAsset,
    deleteAsset,
    fetchGlobalData,
  } = useHRStore();

  const formMethods = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      category: "Office Supplies",
      quantity: 0,
      unit: "pcs",
      minQuantity: 5,
      unitPrice: 0,
      location: "Warehouse",
      status: "In Stock",
      description: "",
      imageUrl: "",
    },
  });

  const { reset: resetForm, handleSubmit: hookSubmit } = formMethods;

  // Infinite Query for Inventory
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loading,
  } = useInfiniteQuery({
    queryKey: ["inventory", search, categoryFilter],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(`/stock/inventory`, {
        params: {
          page: pageParam,
          size: 15,
          search: search,
          category: categoryFilter,
        },
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });

  const items = data?.pages.flatMap((page) => page.content) || [];

  // Stats Query
  const { data: stats } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/stats");
      return response.data;
    },
  });

  // Categories Query
  const { data: categories = [] } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/categories");
      return response.data;
    },
  });

  // Locations Query
  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-locations"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/locations");
      return response.data;
    },
  });

  // Units Query
  const { data: units = [] } = useQuery({
    queryKey: ["inventory-units"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/units");
      return response.data;
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newItem: InventoryFormData) =>
      api.post("/stock/inventory", newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-units"] });
      toast.success("New item added to inventory");
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InventoryFormData }) =>
      api.put(`/stock/inventory/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-units"] });
      toast.success("Item updated");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-units"] });
      toast.success("Item removed from inventory");
    },
  });

  const handleEdit = (item: any) => {
    resetForm({
      name: item.name,
      sku: item.sku || "",
      category: item.category || "Office Supplies",
      quantity: item.quantity,
      unit: item.unit || "pcs",
      minQuantity: item.minQuantity,
      unitPrice: item.unitPrice || 0,
      location: item.location || "Warehouse",
      status: item.status || "In Stock",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
    });
    setEditingId(item.id);
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    resetForm({
      name: item.name,
      sku: item.sku || "",
      category: item.category || "Office Supplies",
      quantity: item.quantity,
      unit: item.unit || "pcs",
      minQuantity: item.minQuantity,
      unitPrice: item.unitPrice || 0,
      location: item.location || "Warehouse",
      status: item.status || "In Stock",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
    });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };

  const onFormSubmit = async (data: InventoryFormData) => {
    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Inventory & Stock">
      <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
        <header className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 text-white rounded-md shadow-xl shadow-blue-500/20">
              <Package size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black dark:text-white tracking-tight">
                Stock Management
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-md bg-blue-500 animate-pulse"></span>
                Tracking {items.length} unique nodes across 4 locations
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/inventory/history">
              <Button
                color="light"
                className="rounded-md px-6 h-14 border-gray-200 dark:border-gray-700 shadow-sm transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] h-12"
              >
                <History size={18} className="mr-2" /> Import History
              </Button>
            </Link>
            <Button
              color="blue"
              onClick={() => {
                setIsEditMode(false);
                setIsViewMode(false);
                setEditingId(null);
                resetForm();
                setIsModalOpen(true);
              }}
              className="rounded-md px-8 h-14 bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
            >
              <Plus size={20} className="mr-2" /> Add New Item
            </Button>
          </div>
        </header>

        {/* Sub Navigation */}
        <nav className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide mt-4">
          {[
            { id: "inventory", label: "Inventory Ledger", icon: <Package size={18} /> },
            { id: "assets", label: "Company Assets", icon: <Activity size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeModule === item.id ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30 ring-1 ring-gray-200 dark:ring-gray-700"}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeModule === "inventory" && (
              <>
                <InventorySummary stats={stats} />
                <Card className="border-none shadow-sm dark:bg-gray-800 rounded-md bg-white/50 backdrop-blur-xl mt-4">
                  <InventoryFilters
                    search={search}
                    setSearch={setSearch}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    categories={categories}
                  />

                  {loading && items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
                      <Spinner size="xl" />
                      <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em]">
                        Syncing Stock Levels...
                      </p>
                    </div>
                  ) : (
                    <>
                      <InventoryTable
                        items={items}
                        handleEdit={handleEdit}
                        handleView={handleView}
                        handleDelete={handleDelete}
                      />

                      {hasNextPage && (
                        <div className="p-8 flex justify-center bg-gray-50/50 dark:bg-gray-800/50 border-t dark:border-gray-700">
                          <Button
                            color="light"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="rounded-md px-12 font-black uppercase text-[10px] tracking-widest h-12"
                          >
                            {isFetchingNextPage ? (
                              <Spinner size="sm" className="mr-3" />
                            ) : null}
                            {isFetchingNextPage
                              ? "Syncing Ledger..."
                              : "Load More Assets"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <Activity size={18} className="text-blue-500" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Aggregate Stock Visibility: {items.length} Nodes Synchronized
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        color="light"
                        size="xs"
                        className="rounded-md px-5 font-black uppercase text-[9px]"
                      >
                        Export CSV
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        className="rounded-md px-5 font-black uppercase text-[9px]"
                      >
                        Stock Audit
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeModule === "assets" && (
              <AssetsModule
                globalAssets={globalAssets}
                employees={globalEmployees}
                onAssign={async (id, empId) => { await assignAsset(id, empId); toast.success("Asset assigned!"); }}
                onReturn={async (id) => { await returnAsset(id); toast.success("Asset returned!"); }}
                onRegister={async (data) => { await api.post('/stock/hr/assets', data); await fetchGlobalData(); toast.success("Asset registered!"); }}
                onUpdate={async (id, data) => { await updateAsset(id, data); toast.success("Asset updated!"); }}
                onDelete={async (id) => { await deleteAsset(id); toast.success("Asset deleted!"); }}
                onRefresh={fetchGlobalData}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <InventoryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
        register={formMethods.register}
        errors={formMethods.formState.errors}
        setValue={formMethods.setValue}
        watch={formMethods.watch}
        handleSubmit={hookSubmit(onFormSubmit)}
        categories={categories}
        locations={locations}
        units={units}
      />

      <ConfirmModal
        show={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this item? This will remove it from the stock records forever."
      />
    </Layout>
  );
};

export default InventoryPage;
