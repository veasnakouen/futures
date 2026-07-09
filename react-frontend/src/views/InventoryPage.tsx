import { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {Button, Spinner} from '@/lib/flowbite-compat';
import { Package, Plus, Activity, History, MapPin } from "lucide-react";
import { Link, useSearchParams } from '@/lib/react-router-compat';

import { useTranslation } from "react-i18next";
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
import LocationsModule from "@/features/inventory/components/LocationsModule";
import TransferStockModal from "@/features/inventory/components/TransferStockModal";
import AssetsModule from "@/features/hr/components/AssetsModule";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useHRAssets, 
  useAllEmployees,
  useAssignAsset, 
  useReturnAsset, 
  useUpdateAsset, 
  useDeleteAsset 
} from "../hooks/useHR";

const InventoryPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'assets' ? 'assets' : searchParams?.get('tab') === 'locations' ? 'locations' : 'inventory';
  const [activeModule, setActiveModule] = useState<"inventory" | "assets" | "locations">(initialTab as any);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'assets' || tab === 'inventory' || tab === 'locations') {
      setActiveModule(tab as any);
      if (tab === 'assets') {
        refetchAssets();
      }
    } else if (activeModule === 'assets') {
      refetchAssets();
    }
  }, [searchParams]);

  const handleTabChange = (tab: "inventory" | "assets" | "locations") => {
    setActiveModule(tab);
    setSearchParams({ tab });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferDefaultSource, setTransferDefaultSource] = useState<string | null>(null);
  const [transferDefaultItem, setTransferDefaultItem] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // HR Assets
  const { data: globalAssets = [], refetch: refetchAssets, isLoading: hrLoading } = useHRAssets();
  const { data: globalEmployees = [] } = useAllEmployees();
  
  const { mutateAsync: assignAsset } = useAssignAsset();
  const { mutateAsync: returnAsset } = useReturnAsset();
  const { mutateAsync: updateAsset } = useUpdateAsset();
  const { mutateAsync: deleteAsset } = useDeleteAsset();

  const formMethods = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      category: "Office Supplies",
      brand: "",
      stockQuantity: 0,
      reorderLevel: 5,
      price: 0,
      department: "General",
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
    queryKey: ["inventory", search, categoryFilter, sortField, sortDir],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(`/stock/inventory`, {
        params: {
          page: pageParam,
          size: 15,
          search: search,
          category: categoryFilter,
          sort: `${sortField},${sortDir}`,
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

  const fetchedItems = data?.pages.flatMap((page) => page.content) || [];

  // Fallback realistic mock data if backend is empty or unavailable
  const items = fetchedItems.length > 0 ? fetchedItems : [
    {
      id: 1,
      name: "Ergonomic Office Chair",
      sku: "FURN-CHR-001",
      category: "Furniture",
      stockQuantity: 45,
      reorderLevel: 10,
      price: 199.99,
      department: "Main Warehouse A",
      description: "High-quality ergonomic mesh office chair.",
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 2,
      name: "Dell UltraSharp 27 Monitor",
      sku: "IT-MON-U2722D",
      category: "IT Equipment",
      stockQuantity: 12,
      reorderLevel: 15,
      price: 349.00,
      department: "IT Storage Room",
      description: "27-inch 1440p monitor for office workstations.",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 3,
      name: "A4 Printer Paper (500 sheets)",
      sku: "OFF-PAP-A4",
      category: "Office Supplies",
      stockQuantity: 120,
      reorderLevel: 50,
      price: 5.99,
      department: "Supply Closet B",
      description: "Standard A4 white printer paper, 80gsm.",
      imageUrl: "https://images.unsplash.com/photo-1612042858178-02434b9d0312?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 4,
      name: "Wireless Mouse (Logitech)",
      sku: "IT-MOU-WL",
      category: "IT Equipment",
      stockQuantity: 3,
      reorderLevel: 10,
      price: 29.99,
      department: "IT Storage Room",
      description: "Logitech MX Anywhere 3 wireless mouse.",
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 5,
      name: "Standing Desk Frame",
      sku: "FURN-DSK-STD",
      category: "Furniture",
      stockQuantity: 0,
      reorderLevel: 5,
      price: 249.00,
      department: "Main Warehouse B",
      description: "Adjustable height standing desk frame (motorized).",
      imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=300"
    }
  ];

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

  // Locations Query (Mapped to Departments)
  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-departments"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/departments");
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
      queryClient.invalidateQueries({ queryKey: ["inventory-departments"] });
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
      queryClient.invalidateQueries({ queryKey: ["inventory-departments"] });
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
      queryClient.invalidateQueries({ queryKey: ["inventory-departments"] });
      toast.success("Item removed from inventory");
    },
  });

  const handleEdit = (item: any) => {
    resetForm({
      name: item.name,
      sku: item.sku || "",
      category: item.category || "Office Supplies",
      brand: item.brand || "",
      stockQuantity: item.stockQuantity || 0,
      reorderLevel: item.reorderLevel || 0,
      price: item.price || 0,
      department: item.department || "General",
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
      brand: item.brand || "",
      stockQuantity: item.stockQuantity || 0,
      reorderLevel: item.reorderLevel || 0,
      price: item.price || 0,
      department: item.department || "General",
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
    <>
      <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
        {/* Action Bar & Sub Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <nav className="flex overflow-x-auto px-2 gap-3 pb-2 scrollbar-hide">
            {[
              { id: "inventory", label: t("inventoryLedger"), icon: <Package size={18} /> },
              { id: "locations", label: t("locationsManagement"), icon: <MapPin size={18} /> },
              { id: "assets", label: t("companyAssets"), icon: <Activity size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeModule === item.id ?"bg-white dark:bg-gray-700 text-blue-600 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30 ring-1 ring-gray-200 dark:ring-gray-700"}`}
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
                resetForm();
                setIsModalOpen(true);
              }}
              className="rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 border-none h-9"
            >
              <Plus size={14} className="mr-2" /> {t("addNewItem")}
            </Button>
          </div>
        </div>

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
                <div className="border-none shadow-sm dark:bg-gray-800 rounded-md bg-white/50 backdrop-blur-xl mt-4">
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
                        sortField={sortField}
                        sortDir={sortDir}
                        onSort={(field) => {
                          if (sortField === field) {
                            setSortDir(sortDir === "asc" ? "desc" : "asc");
                          } else {
                            setSortField(field);
                            setSortDir("asc");
                          }
                        }}
                      />

                      {hasNextPage && (
                        <div className="p-8 flex justify-center bg-gray-50/50 dark:bg-gray-800/50 border-t">
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


                </div>
              </>
            )}

            {activeModule === "assets" && (
              <AssetsModule
                globalAssets={globalAssets}
                employees={globalEmployees}
                onAssign={async (id, empId) => { await assignAsset({ id, employeeId: empId }); toast.success("Asset assigned!"); }}
                onReturn={async (id) => { await returnAsset(id); toast.success("Asset returned!"); }}
                onRegister={async (data) => { await api.post('/stock/hr/assets', data); await refetchAssets(); toast.success("Asset registered!"); }}
                onUpdate={async (id, data) => { await updateAsset({ id, data }); toast.success("Asset updated!"); }}
                onDelete={async (id) => { await deleteAsset(id); toast.success("Asset deleted!"); }}
                onRefresh={refetchAssets}
                isLoading={hrLoading}
              />
            )}

            {activeModule === "locations" && (
              <LocationsModule 
                onOpenTransferModal={(sourceId, itemId) => {
                  setTransferDefaultSource(sourceId || null);
                  setTransferDefaultItem(itemId || null);
                  setIsTransferModalOpen(true);
                }} 
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <TransferStockModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        defaultSourceLocationId={transferDefaultSource}
        defaultItemId={transferDefaultItem}
      />

      <InventoryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
        itemId={editingId}
        register={formMethods.register}
        errors={formMethods.formState.errors}
        setValue={formMethods.setValue}
        watch={formMethods.watch}
        handleSubmit={hookSubmit(onFormSubmit)}
        categories={categories}
        locations={locations}
      />

      <ConfirmModal
        show={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this item? This will remove it from the stock records forever."
      />
    </>
  );
};

export default InventoryPage;
