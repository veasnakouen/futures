import { useState, useEffect, Suspense } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Button, Spinner } from '@/lib/flowbite-compat';
import { Package, Plus, Activity, History, MapPin, Box, Eye, Edit3, Trash2 } from "lucide-react";
import { Link, useSearchParams } from '@/lib/react-router-compat';
import { useTranslation } from "react-i18next";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, type InventoryFormData } from "../schemas/inventorySchema";

// Modular Components
import InventorySummary from "@/features/inventory/components/InventorySummary";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { Badge, Tooltip } from "@/lib/flowbite-compat";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy Loaded Modular Components
const InventoryItemModal = React.lazy(() => import("@/features/inventory/components/InventoryItemModal"));
const LocationsModule = React.lazy(() => import("@/features/inventory/components/LocationsModule"));
const TransferStockModal = React.lazy(() => import("@/features/inventory/components/TransferStockModal"));
const AssetCategorySettings = React.lazy(() => import("@/features/inventory/components/AssetCategorySettings"));
const AssetsModule = React.lazy(() => import("@/features/hr/components/AssetsModule"));

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
  const initialTab = searchParams?.get('tab') === 'assets' ? 'assets' : searchParams?.get('tab') === 'locations' ? 'locations' : searchParams?.get('tab') === 'categories' ? 'categories' : 'inventory';
  const [activeModule, setActiveModule] = useState<"inventory" | "assets" | "locations" | "categories">(initialTab as any);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'assets' || tab === 'inventory' || tab === 'locations' || tab === 'categories') {
      setActiveModule(tab as any);
      if (tab === 'assets') {
        refetchAssets();
      }
    } else if (activeModule === 'assets') {
      refetchAssets();
    }
  }, [searchParams]);

  const handleTabChange = (tab: "inventory" | "assets" | "locations" | "categories") => {
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
      category: undefined,
      brand: "",
      stockQuantity: 0,
      reorderLevel: 5,
      price: 0,
      departmentId: undefined,
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

  const getStockStatus = (quantity: number, min: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-500/20", barColor: "bg-rose-500" };
    if (quantity <= min) return { label: "Low Stock", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/20", barColor: "bg-amber-500" };
    return { label: "In Stock", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20", barColor: "bg-emerald-500" };
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Item",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <Package size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{item.sku || 'N/A'}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => (
        <Badge color="gray" className="rounded-md font-bold text-[10px] uppercase tracking-wider">
          {item.category?.name || "General"}
        </Badge>
      )
    },
    {
      header: "Stock Level",
      accessorKey: "stockQuantity",
      cell: (item) => {
        const status = getStockStatus(item.stockQuantity, item.reorderLevel);
        const percentage = item.reorderLevel > 0 ? Math.min(100, (item.stockQuantity / (item.reorderLevel * 3)) * 100) : 100;
        return (
          <div className="w-full min-w-[120px]">
            <div className="flex justify-between items-end mb-1 text-xs">
              <span className="font-black text-gray-900 dark:text-white">{item.stockQuantity} <span className="text-gray-400 font-normal">units</span></span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
              <div className={`h-1.5 rounded-full ${status.barColor}`} style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        );
      },
      sortable: true
    },
    {
      header: "Location",
      accessorKey: "department",
      cell: (item) => (
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <MapPin size={12} className="mr-1" />
          {item.department?.name || "Unassigned"}
        </div>
      )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => <div className="font-mono text-sm">${(item.price || 0).toFixed(2)}</div>,
      sortable: true
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item) => (
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip content="View Details">
            <button onClick={() => handleView(item)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors">
              <Eye size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Edit Record">
            <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors">
              <Edit3 size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors">
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  const mockDataList = [
    {
      id: 1,
      name: "Ergonomic Office Chair",
      sku: "FURN-CHR-001",
      category: { id: 1, name: "Furniture" },
      stockQuantity: 45,
      reorderLevel: 10,
      price: 199.99,
      department: { id: 1, name: "Main Warehouse A" },
      description: "High-quality ergonomic mesh office chair.",
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const filteredMockData = mockDataList.filter(item => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || item.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const items = fetchedItems.length > 0 ? fetchedItems : (loading ? [] : filteredMockData);
  const totalFilteredItems = items.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize) || 1;
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      const response = await api.get("/stock/categories");
      return response.data;
    },
    select: (data: any[]) => [...data].sort((a, b) => {
      if (typeof a === 'string') return a.localeCompare(b);
      return (a.name || "").localeCompare(b.name || "");
    }),
  });

  // Locations Query (Mapped to Departments)
  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-departments"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/departments");
      return response.data;
    },
    select: (data: any[]) => [...data].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
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
      category: item.category ? { id: item.category.id } : undefined,
      brand: item.brand || "",
      stockQuantity: item.stockQuantity || 0,
      reorderLevel: item.reorderLevel || 0,
      price: item.price || 0,
      departmentId: item.department?.id || undefined,
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
      category: item.category ? { id: item.category.id } : undefined,
      brand: item.brand || "",
      stockQuantity: item.stockQuantity || 0,
      reorderLevel: item.reorderLevel || 0,
      price: item.price || 0,
      departmentId: item.department?.id || undefined,
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

  const onFormSubmit = async (formData: InventoryFormData) => {
    const { departmentId, department, ...rest } = formData;
    const payload: any = { ...rest };
    if (departmentId) {
      payload.department = { id: departmentId };
    }
    if (payload.category && payload.category.id) {
      payload.category = { id: payload.category.id };
    }

    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
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
              { id: "categories", label: "Categories", icon: <Box size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeModule === item.id ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md ring-0" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30 ring-1 ring-gray-200 dark:ring-gray-700"}`}
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
                  category: categories?.length > 0 ? { id: categories[0].id } : undefined,
                  brand: "",
                  stockQuantity: 0,
                  reorderLevel: 0,
                  price: 0,
                  departmentId: undefined,
                  description: "",
                  imageUrl: "",
                });
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
                  <DataTable
                    data={paginatedItems}
                    columns={columns}
                    searchQuery={search}
                    onSearchChange={(val) => {
                      setSearch(val);
                      setCurrentPage(1);
                    }}
                    searchPlaceholder="Search item name or SKU code..."
                    sortField={sortField}
                    sortDir={sortDir as "asc" | "desc"}
                    onSort={(field) => {
                      if (sortField === field) {
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      } else {
                        setSortField(field);
                        setSortDir("asc");
                      }
                    }}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalFilteredItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    enableViewToggle={true}
                    enableColumnToggle={true}
                    renderGridCard={(item: any) => (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={22} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">{item.name}</h4>
                            <span className="text-[10px] font-mono text-gray-400 font-bold">{item.sku || 'N/A'}</span>
                          </div>

                          {/* Hover Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(item);
                              }}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-gray-700">
                          <Badge color="gray" className="rounded-md font-bold text-[9px] uppercase">
                            {item.category?.name || "General"}
                          </Badge>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">${(item.price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </>
            )}

            {activeModule === "locations" && (
              <Suspense fallback={<div className="flex justify-center p-12"><Spinner size="xl" /></div>}>
                <LocationsModule
                  onOpenTransferModal={(sourceId, itemId) => {
                    setTransferDefaultSource(sourceId || null);
                    setTransferDefaultItem(itemId || null);
                    setIsTransferModalOpen(true);
                  }}
                />
              </Suspense>
            )}
            
            {activeModule === "categories" && (
              <Suspense fallback={<div className="flex justify-center p-12"><Spinner size="xl" /></div>}>
                <AssetCategorySettings />
              </Suspense>
            )}

            {activeModule === "assets" && (
              <Suspense fallback={<div className="flex justify-center p-12"><Spinner size="xl" /></div>}>
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
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Suspense fallback={null}>
        {isModalOpen && (
          <InventoryItemModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingId(null);
              resetForm();
            }}
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
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isTransferModalOpen && (
          <TransferStockModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            defaultSourceLocationId={transferDefaultSource}
            defaultItemId={transferDefaultItem}
          />
        )}
      </Suspense>

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
