import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, type AssetFormData } from "@/schemas/assetSchema";
import { format } from "date-fns";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

interface UseAssetsModuleProps {
  globalAssets: any[];
  employees: any[];
  onAssign: (assetId: number, employeeId: number) => Promise<void>;
  onReturn: (assetId: number) => Promise<void>;
  onRegister: (assetData: any) => Promise<void>;
  onUpdate: (assetId: number, assetData: any) => Promise<void>;
  onDelete: (assetId: number) => Promise<void>;
}

const defaultAssetValues: AssetFormData = {
  name: "",
  serialNumber: "",
  assetType: "Laptop",
  status: "Available",
  imageUrl: "",
  vendor: "",
  purchaseDate: "",
  purchaseCost: 0,
  warrantyExpiryDate: "",
  assetCondition: "New",
  barcode: "",
  location: "",
  isReturnable: true,
  isKit: false,
  isIntangible: false,
  isSubscription: false,
  isActive: true,
  renewalDate: "",
  acquisitionType: "Purchased",
  donorOrPartnerName: "",
  costCenter: "",
  usefulLifeYears: 0,
  productFamily: "",
  brand: "",
  modelNumber: "",
};

export const useAssetsModule = ({
  globalAssets,
  employees,
  onAssign,
  onReturn,
  onRegister,
  onUpdate,
  onDelete,
}: UseAssetsModuleProps) => {
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [itemsPerRow, setItemsPerRow] = useState("4");

  // React Hook Form
  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: defaultAssetValues,
  });
  const { reset, setValue } = form;

  // Modals & Registration State
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Details State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<any>(null);

  // Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assignSearch, setAssignSearch] = useState("");

  // Processing & Category State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    show: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: () => {},
  });

  const safeAssets = Array.isArray(globalAssets) ? globalAssets : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Analytics
  const totalAssets = safeAssets.length;
  const assignedCount = safeAssets.filter((a) => a.status === "Assigned").length;
  const availableCount = safeAssets.filter((a) => a.status === "Available" || !a.status).length;

  // Asset Categories
  const [assetCategories, setAssetCategories] = useState<string[]>(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("mtp_asset_categories")
        : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return ["Laptop", "Mobile", "Monitor", "Peripherals", "Server", "Other"];
  });

  const assetTypes = ["ALL", ...assetCategories];

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (assetCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    const updated = [...assetCategories.filter((c) => c !== "Other"), trimmed, "Other"];
    setAssetCategories(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mtp_asset_categories", JSON.stringify(updated));
    }
    setNewCategoryName("");
    toast.success(`Category "${trimmed}" added`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (catToDelete === "Other") {
      toast.error("Cannot delete the default 'Other' category");
      return;
    }
    setConfirmModal({
      show: true,
      title: "Delete Category",
      message: `Are you sure you want to delete category "${catToDelete}"?`,
      confirmText: "Delete Category",
      type: "danger",
      onConfirm: async () => {
        const updated = assetCategories.filter((c) => c.toLowerCase() !== catToDelete.toLowerCase());
        setAssetCategories(updated);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mtp_asset_categories", JSON.stringify(updated));
        }
        toast.success(`Category "${catToDelete}" deleted successfully`);
      },
    });
  };

  const handleEditCategory = (index: number) => {
    const newName = editingCatValue.trim();
    if (!newName) return;
    const updated = [...assetCategories];
    updated[index] = newName;
    setAssetCategories(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mtp_asset_categories", JSON.stringify(updated));
    }
    setEditingCatIndex(null);
    toast.success(`Category renamed to "${newName}"`);
  };

  const filteredAssets = safeAssets.filter((a) => {
    const matchesSearch =
      (a.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.employee ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}` : "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "ALL" || (a.assetType || "Other").toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const totalFiltered = filteredAssets.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filteredEmployeesForAssign = safeEmployees.filter(
    (e) =>
      `${e.firstNameEnglish} ${e.lastNameEnglish}`
        .toLowerCase()
        .includes(assignSearch.toLowerCase()) && e.status === "Active"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue("imageUrl", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenRegister = () => {
    setIsEditMode(false);
    setEditingId(null);
    setCurrentStep(1);
    reset(defaultAssetValues);
    setIsRegModalOpen(true);
  };

  const handleOpenEdit = (asset: any) => {
    setIsEditMode(true);
    setEditingId(asset.id);
    setCurrentStep(1);
    reset({
      name: asset.name,
      serialNumber: asset.serialNumber,
      assetType: asset.assetType || "Other",
      status: asset.status || "Available",
      imageUrl: asset.imageUrl || "",
      vendor: asset.vendor || "",
      purchaseDate: asset.purchaseDate || "",
      purchaseCost: asset.purchaseCost || 0,
      warrantyExpiryDate: asset.warrantyExpiryDate || "",
      assetCondition: asset.assetCondition || "Good",
      barcode: asset.barcode || "",
      location: asset.location || "",
      isReturnable: asset.isReturnable ?? true,
      isKit: asset.isKit ?? false,
      isIntangible: asset.isIntangible ?? false,
      isSubscription: asset.isSubscription ?? false,
      isActive: asset.isActive ?? true,
      renewalDate: asset.renewalDate || "",
      acquisitionType: asset.acquisitionType || "Purchased",
      donorOrPartnerName: asset.donorOrPartnerName || "",
      costCenter: asset.costCenter || "",
      usefulLifeYears: asset.usefulLifeYears || 0,
      productFamily: asset.productFamily || "",
      brand: asset.brand || "",
      modelNumber: asset.modelNumber || "",
    });
    setIsRegModalOpen(true);
  };

  const handleOpenDetails = (asset: any) => {
    setViewingAsset(asset);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      show: true,
      title: "Delete Hardware Asset",
      message: "Are you sure you want to permanently delete this asset?",
      confirmText: "Delete Asset",
      type: "danger",
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          await onDelete(id);
          toast.success("Asset record deleted successfully");
        } catch (e) {
          toast.error("Failed to delete asset record");
        } finally {
          setIsProcessing(false);
        }
      },
    });
  };

  const onFormSubmit = async (data: AssetFormData) => {
    try {
      setIsProcessing(true);
      if (isEditMode && editingId) {
        await onUpdate(editingId, data);
        toast.success("Hardware record updated");
      } else {
        await onRegister(data);
        toast.success("Registration node committed successfully");
      }
      setIsRegModalOpen(false);
      reset();
    } catch (err) {
      toast.error("Validation or Network Sync failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenAssign = (asset: any) => {
    setSelectedAsset(asset);
    setAssignSearch("");
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = async (employeeId: number) => {
    if (!selectedAsset) return;
    try {
      setIsProcessing(true);
      await onAssign(selectedAsset.id, employeeId);
      setIsAssignModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessReturn = (asset: any) => {
    setConfirmModal({
      show: true,
      title: "Release Asset to Inventory",
      message: `Release ${asset.name} back to general inventory?`,
      confirmText: "Release Asset",
      type: "warning",
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          await onReturn(asset.id);
        } finally {
          setIsProcessing(false);
        }
      },
    });
  };

  const exportInventoryReport = () => {
    const data = safeAssets.map((a) => ({
      "Asset Name": a.name,
      "Serial Number": a.serialNumber,
      Type: a.assetType || "Other",
      Status: a.status || "Available",
      Custodian: a.employee ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}` : "Unassigned",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_Audit_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Inventory audit exported to Excel");
  };

  const generateAssetLabel = (asset: any) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [80, 50] });
    doc.setFontSize(10);
    doc.text("MTP PROPERTY TAG", 40, 10, { align: "center" });
    doc.text(`ASSET: ${asset.name}`, 10, 20);
    doc.text(`S/N: ${asset.serialNumber}`, 10, 25);
    doc.save(`Label_${asset.serialNumber}.pdf`);
    toast.success("Asset identification tag generated");
  };

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    itemsPerRow,
    setItemsPerRow,
    form,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalAssets,
    assignedCount,
    availableCount,
    assetCategories,
    assetTypes,
    totalFiltered,
    totalPages,
    paginatedAssets,
    filteredEmployeesForAssign,
    isProcessing,
    // Modals
    isRegModalOpen,
    setIsRegModalOpen,
    isEditMode,
    currentStep,
    setCurrentStep,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    viewingAsset,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedAsset,
    assignSearch,
    setAssignSearch,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    newCategoryName,
    setNewCategoryName,
    editingCatIndex,
    setEditingCatIndex,
    editingCatValue,
    setEditingCatValue,
    confirmModal,
    setConfirmModal,
    // Handlers
    handleAddCategory,
    handleDeleteCategory,
    handleEditCategory,
    handleImageChange,
    handleOpenRegister,
    handleOpenEdit,
    handleOpenDetails,
    handleDelete,
    onFormSubmit,
    handleOpenAssign,
    handleConfirmAssign,
    handleProcessReturn,
    exportInventoryReport,
    generateAssetLabel,
  };
};

export default useAssetsModule;
