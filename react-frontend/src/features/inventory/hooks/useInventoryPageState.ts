import { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useSearchParams } from "@/lib/react-router-compat";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, type InventoryFormData } from "@/schemas/inventorySchema";
import {
  useHRAssets,
  useAllEmployees,
  useRegisterAsset,
  useAssignAsset,
  useReturnAsset,
  useUpdateAsset,
  useDeleteAsset,
} from "@/hooks/useHR";

export function useInventoryPageState() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab =
    searchParams?.get("tab") === "assets"
      ? "assets"
      : searchParams?.get("tab") === "locations"
        ? "locations"
        : searchParams?.get("tab") === "categories"
          ? "categories"
          : "inventory";

  const [activeModule, setActiveModule] = useState<"inventory" | "assets" | "locations" | "categories">(
    initialTab as any
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: globalAssets = [], refetch: refetchAssets, isLoading: hrLoading } = useHRAssets();
  const { data: globalEmployees = [] } = useAllEmployees();

  const { mutateAsync: registerAsset } = useRegisterAsset();
  const { mutateAsync: assignAsset } = useAssignAsset();
  const { mutateAsync: returnAsset } = useReturnAsset();
  const { mutateAsync: updateAsset } = useUpdateAsset();
  const { mutateAsync: deleteAsset } = useDeleteAsset();

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "assets" || tab === "inventory" || tab === "locations" || tab === "categories") {
      setActiveModule(tab as any);
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
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const fetchedItems = data?.pages.flatMap((page) => page.content) || [];

  const getStockStatus = (quantity: number, min: number) => {
    if (quantity === 0)
      return {
        label: "Out of Stock",
        color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-500/20",
        barColor: "bg-rose-500",
      };
    if (quantity <= min)
      return {
        label: "Low Stock",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/20",
        barColor: "bg-amber-500",
      };
    return {
      label: "In Stock",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20",
      barColor: "bg-emerald-500",
    };
  };

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
      imageUrl:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300",
    },
  ];

  const filteredMockData = mockDataList.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || item.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const rawItems = fetchedItems.length > 0 ? fetchedItems : loading ? [] : filteredMockData;
  const items = rawItems.filter((item: any) => {
    if (search === "stock:critical") {
      return (item.stockQuantity ?? 0) === 0 || (item.trackStock && (item.stockQuantity ?? 0) <= (item.reorderLevel ?? 0));
    }
    if (search === "stock:low") {
      return item.trackStock && (item.stockQuantity ?? 0) <= (item.reorderLevel ?? 0) && (item.stockQuantity ?? 0) > 0;
    }
    return true;
  });
  const totalFilteredItems = items.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize) || 1;
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { data: stats } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/stats");
      return response.data;
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const response = await api.get("/stock/categories");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    select: (data: any[]) =>
      [...data].sort((a, b) => {
        if (typeof a === "string") return a.localeCompare(b);
        return (a.name || "").localeCompare(b.name || "");
      }),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["inventory-departments"],
    queryFn: async () => {
      const response = await api.get("/stock/inventory/departments");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    select: (data: any[]) => [...data].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
  });

  const createMutation = useMutation({
    mutationFn: (newItem: InventoryFormData) => api.post("/stock/inventory", newItem),
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
      costPrice: item.costPrice || 0,
      unitOfMeasure: item.unitOfMeasure || "",
      supplierName: item.supplierName || "",
      donorName: item.donorName || "",
      grantCode: item.grantCode || "",
      locationBin: item.locationBin || "",
      batchNumber: item.batchNumber || "",
      expiryDate: item.expiryDate || "",
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
      costPrice: item.costPrice || 0,
      unitOfMeasure: item.unitOfMeasure || "",
      supplierName: item.supplierName || "",
      donorName: item.donorName || "",
      grantCode: item.grantCode || "",
      locationBin: item.locationBin || "",
      batchNumber: item.batchNumber || "",
      expiryDate: item.expiryDate || "",
      departmentId: item.department?.id || undefined,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
    });
    setEditingId(item.id);
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

    if (payload.trackStock && payload.stockQuantity <= (payload.reorderLevel || 0)) {
      toast(`Low Stock Notice: "${payload.name}" is at or below reorder threshold (${payload.stockQuantity} remaining).`, {
        icon: "⚠️",
        style: {
          border: "1px solid #f59e0b",
          padding: "12px 16px",
          color: "#92400e",
          backgroundColor: "#fef3c7",
          fontWeight: "500",
        },
        duration: 4000,
      });
    }

    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    t,
    activeModule,
    setActiveModule,
    handleTabChange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    setIsEditMode,
    isViewMode,
    setIsViewMode,
    editingId,
    setEditingId,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    isConfirmOpen,
    setIsConfirmOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    transferDefaultSource,
    setTransferDefaultSource,
    transferDefaultItem,
    setTransferDefaultItem,
    itemToDelete,
    setItemToDelete,
    globalAssets,
    refetchAssets,
    hrLoading,
    globalEmployees,
    registerAsset,
    assignAsset,
    returnAsset,
    updateAsset,
    deleteAsset,
    formMethods,
    resetForm,
    hookSubmit,
    fetchedItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
    getStockStatus,
    items,
    totalFilteredItems,
    totalPages,
    paginatedItems,
    stats,
    categories,
    locations,
    handleEdit,
    handleView,
    handleDelete,
    confirmDelete,
    onFormSubmit,
  };
}
