import React, { useState } from "react";
import {Badge, Button, TextInput, Label, Avatar, Tooltip, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Progress, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, Checkbox} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import {
  X,
  Monitor,
  Cpu,
  Plus,
  Smartphone,
  Search,
  CheckCircle,
  Clock,
  Zap,
  List,
  LayoutGrid,
  Download,
  UserPlus,
  RotateCcw,
  Shield,
  Box,
  Database,
  Printer,
  Filter,
  MoreVertical,
  HardDrive,
  MousePointer2,
  Save,
  Trash2,
  Upload,
  ChevronDown,
  SlidersHorizontal,
  UserCheck,
  Archive,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, type AssetFormData } from '@/schemas/assetSchema';
import api from '@/services/api';
import SearchInput from "@/components/common/SearchInput";

interface AssetsModuleProps {
  globalAssets: any[];
  employees: any[];
  onAssign: (assetId: number, employeeId: number) => Promise<void>;
  onReturn: (assetId: number) => Promise<void>;
  onRegister: (assetData: any) => Promise<void>;
  onUpdate: (assetId: number, assetData: any) => Promise<void>;
  onDelete: (assetId: number) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const AssetsModule: React.FC<AssetsModuleProps> = ({
  globalAssets,
  employees,
  onAssign,
  onReturn,
  onRegister,
  onUpdate,
  onDelete,
  onRefresh,
  isLoading,
}) => {
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const defaultAssetValues = {
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

  // React Hook Form
  const {
    register,
    handleSubmit: hookSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: defaultAssetValues,
  });
  const imageUrl = watch("imageUrl");
  const purchaseDate = watch("purchaseDate");
  const warrantyExpiryDate = watch("warrantyExpiryDate");

  // Registration & Edit State
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Details & View State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<any>(null);

  // Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assignSearch, setAssignSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clearBeforeImport, setClearBeforeImport] = useState(false);
  const [importJobId, setImportJobId] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<{
    processed: number;
    total: number;
    status: string;
    message: string;
  } | null>(null);

  const safeAssets = Array.isArray(globalAssets) ? globalAssets : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Analytics
  const totalAssets = safeAssets.length;
  const assignedCount = safeAssets.filter(
    (a) => a.status === "Assigned",
  ).length;
  const availableCount = safeAssets.filter(
    (a) => a.status === "Available" || !a.status,
  ).length;

  // Dynamic Asset Categories State
  const [assetCategories, setAssetCategories] = useState<string[]>(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("mtp_asset_categories");
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

  // Category Management State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  // Category Functions
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (
      assetCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("Category already exists");
      return;
    }
    const updated = [
      ...assetCategories.filter((c) => c !== "Other"),
      trimmed,
      "Other",
    ];
    setAssetCategories(updated);
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_asset_categories", JSON.stringify(updated));
    setNewCategoryName("");
    toast.success(`Category "${trimmed}" added`);
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (catToDelete === "Other") {
      toast.error("Cannot delete the default 'Other' category");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${catToDelete}"? Any items matching this category will be updated to "Other".`,
      )
    )
      return;

    try {
      setIsProcessing(true);
      const matchingAssets = safeAssets.filter(
        (a) =>
          (a.assetType || "Other").toLowerCase() === catToDelete.toLowerCase(),
      );
      if (matchingAssets.length > 0) {
        toast.loading(
          `Updating ${matchingAssets.length} matching hardware assets...`,
          { id: "category-update" },
        );
        await Promise.all(
          matchingAssets.map((a) =>
            onUpdate(a.id, {
              name: a.name,
              serialNumber: a.serialNumber,
              assetType: "Other",
              status: a.status || "Available",
              imageUrl: a.imageUrl || "",
            }),
          ),
        );
        toast.dismiss("category-update");
        toast.success(`Updated ${matchingAssets.length} items to "Other"`);
      }

      const updated = assetCategories.filter(
        (c) => c.toLowerCase() !== catToDelete.toLowerCase(),
      );
      setAssetCategories(updated);
      (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_asset_categories", JSON.stringify(updated));
      toast.success(`Category "${catToDelete}" deleted successfully`);
    } catch (err) {
      toast.error("Failed to migrate asset categories in database");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCategory = async (index: number) => {
    const oldName = assetCategories[index];
    const newName = editingCatValue.trim();
    if (!newName) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (oldName === "Other") {
      toast.error("Cannot rename the default 'Other' category");
      return;
    }
    if (oldName.toLowerCase() === newName.toLowerCase()) {
      setEditingCatIndex(null);
      return;
    }
    if (
      assetCategories.some(
        (c, idx) => idx !== index && c.toLowerCase() === newName.toLowerCase(),
      )
    ) {
      toast.error("Category name already exists");
      return;
    }

    try {
      setIsProcessing(true);
      const matchingAssets = safeAssets.filter(
        (a) => (a.assetType || "Other").toLowerCase() === oldName.toLowerCase(),
      );
      if (matchingAssets.length > 0) {
        toast.loading(
          `Renaming category for ${matchingAssets.length} hardware assets...`,
          { id: "category-rename" },
        );
        await Promise.all(
          matchingAssets.map((a) =>
            onUpdate(a.id, {
              name: a.name,
              serialNumber: a.serialNumber,
              assetType: newName,
              status: a.status || "Available",
              imageUrl: a.imageUrl || "",
            }),
          ),
        );
        toast.dismiss("category-rename");
        toast.success(`Successfully renamed items in database`);
      }

      const updated = [...assetCategories];
      updated[index] = newName;
      setAssetCategories(updated);
      (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_asset_categories", JSON.stringify(updated));
      setEditingCatIndex(null);
      toast.success(`Category renamed to "${newName}"`);
    } catch (err) {
      toast.error("Failed to update asset categories in database");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredAssets = safeAssets.filter((a) => {
    const matchesSearch =
      (a.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.serialNumber || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (a.employee
        ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
        : ""
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "ALL" ||
      (a.assetType || "Other").toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Apply Pagination
  const totalFiltered = filteredAssets.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const filteredEmployeesForAssign = safeEmployees.filter(
    (e) =>
      `${e.firstNameEnglish} ${e.lastNameEnglish}`
        .toLowerCase()
        .includes(assignSearch.toLowerCase()) && e.status === "Active",
  );

  const getAssetIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "laptop":
        return <Cpu size={20} />;
      case "mobile":
      case "smartphone":
        return <Smartphone size={20} />;
      case "monitor":
        return <Monitor size={20} />;
      case "peripherals":
        return <MousePointer2 size={20} />;
      case "server":
        return <HardDrive size={20} />;
      default:
        return <Box size={20} />;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("imageUrl", reader.result as string);
      };
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

  const handleDelete = async (id: number) => {
    try {
      setIsProcessing(true);
      await onDelete(id);
    } finally {
      setIsProcessing(false);
    }
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
      console.error("Asset Operation Hub Error:", err);
      toast.error("Validation or Network Sync failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsProcessing(true);
      if (clearBeforeImport) {
        await api.delete("/stock/assets/import/clear/staging");
      }

      const response = await api.post("/stock/assets/import/async", formData);
      const jobId = response.data.jobId;
      setImportJobId(jobId);
      pollImportProgress(jobId);
    } catch (err) {
      console.error("Import Error:", err);
      toast.error("Network error during import");
      setIsProcessing(false);
    }
  };

  const pollImportProgress = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/stock/assets/import/progress/${jobId}`);
        const progress = res.data;
        setImportProgress(progress);

        if (progress.completed) {
          clearInterval(interval);
          setIsProcessing(false);
          setImportJobId(null);
          setImportProgress(null);
          if (progress.status === "COMPLETED") {
            toast.success(progress.message);
          } else {
            toast.error(progress.message);
          }
        }
      } catch (err) {
        console.error("Polling Error:", err);
        clearInterval(interval);
        setIsProcessing(false);
        setImportJobId(null);
        setImportProgress(null);
      }
    }, 1000);
  };

  const exportInventoryReport = () => {
    const data = safeAssets.map((a) => ({
      "Asset Name": a.name,
      "Serial Number": a.serialNumber,
      Type: a.assetType || "Other",
      Status: a.status || "Available",
      Custodian: a.employee
        ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
        : "Unassigned",
      "Deployed Date": a.assignedDate
        ? format(new Date(a.assignedDate), "yyyy-MM-dd")
        : "N/A",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(
      wb,
      `Inventory_Audit_${format(new Date(), "yyyy-MM-dd")}.xlsx`,
    );
    toast.success("Inventory audit exported to Excel");
  };

  const generateAssetLabel = (asset: any) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [80, 50],
    });
    doc.setFontSize(10);
    doc.text("MTP PROPERTY TAG", 40, 10, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 12, 70, 12);

    doc.setFontSize(8);
    doc.text(`ASSET: ${asset.name}`, 10, 20);
    doc.text(`S/N: ${asset.serialNumber}`, 10, 25);
    doc.text(`TYPE: ${asset.assetType || "Standard"}`, 10, 30);
    doc.text(`STATUS: ${asset.status || "Verified"}`, 10, 35);

    doc.setFontSize(6);
    doc.text(`TAGGED: ${format(new Date(), "yyyy-MM-dd")}`, 40, 45, {
      align: "center",
    });

    doc.save(`Label_${asset.serialNumber}.pdf`);
    toast.success("Asset identification tag generated");
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

  const handleProcessReturn = async (asset: any) => {
    if (!window.confirm(`Release ${asset.name} back to general inventory?`))
      return;
    try {
      setIsProcessing(true);
      await onReturn(asset.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Inventory Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 rounded-none group cursor-pointer transition-all hover:shadow-md">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 rounded-none transition-all group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
            <Box size={24} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xl font-black dark:text-white uppercase">
              {totalAssets}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Total Inventory
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 rounded-none group cursor-pointer transition-all hover:shadow-md">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 rounded-none transition-all group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
            <UserCheck size={24} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xl font-black dark:text-white uppercase">
              {assignedCount}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Deployed Assets
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 rounded-none group cursor-pointer transition-all hover:shadow-md">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 rounded-none transition-all group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
            <Archive size={24} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xl font-black dark:text-white uppercase">
              {availableCount}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Available Stock
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 rounded-none group cursor-pointer transition-all hover:shadow-md">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 rounded-none transition-all group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
            <Shield size={24} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xl font-black dark:text-white uppercase">
              98.4%
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Asset Compliance
            </p>
          </div>
        </div>
      </div>

      {importProgress && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-md shadow-md animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest dark:text-white">
                Background Import Active
              </h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                {importProgress.message}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                {importProgress.total > 0
                  ? Math.round(
                    (importProgress.processed / importProgress.total) * 100,
                  )
                  : 0}
                %
              </p>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                {importProgress.processed} / {importProgress.total} Nodes
              </p>
            </div>
          </div>
          <Progress
            progress={
              importProgress.total > 0
                ? (importProgress.processed / importProgress.total) * 100
                : 0
            }
            color="blue"
            size="lg"
            className="rounded-md"
          />
        </div>
      )}

      {/* Navigation & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-md shadow-sm">
        <div className="relative flex shrink-0 bg-gray-100/80 dark:bg-gray-900/60 p-1 rounded-md w-24 shadow-inner overflow-hidden">
          {/* Sliding Pill */}
          <div
            className="absolute top-1 bottom-1 left-1 rounded-md bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-out pointer-events-none"
            style={{
              width: "calc(50% - 4px)",
              transform: `translateX(${viewMode === "GRID" ? "0" : "100%"})`,
            }}
          />
          <button
            onClick={() => setViewMode("GRID")}
            title="Grid View"
            className={`relative z-10 flex-1 py-1.5 transition-all duration-300 flex items-center justify-center rounded-md focus:outline-none ${viewMode ==="GRID"?"text-blue-600 dark:text-blue-400":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <LayoutGrid
              size={16}
              className={`transition-transform duration-300 ${viewMode ==="GRID"?"scale-110":""}`}
            />
          </button>
          <button
            onClick={() => setViewMode("TABLE")}
            title="List View"
            className={`relative z-10 flex-1 py-1.5 transition-all duration-300 flex items-center justify-center rounded-md focus:outline-none ${viewMode ==="TABLE"?"text-blue-600 dark:text-blue-400":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <List
              size={16}
              className={`transition-transform duration-300 ${viewMode ==="TABLE"?"scale-110":""}`}
            />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 flex-1 lg:flex-none justify-end">
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
              className="bg-white dark:bg-gray-800 border-transparent rounded-md text-gray-900 dark:text-white text-xs shadow-sm h-12 focus:ring-0 focus:border-transparent px-3 w-[110px] flex-1 sm:flex-none"
            >
              {assetTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {viewMode === "GRID" && (
              <select
                value={itemsPerRow}
                onChange={(e) => setItemsPerRow(e.target.value)}
                className="bg-white dark:bg-gray-800 border-transparent rounded-md text-gray-900 dark:text-white text-xs shadow-sm h-12 focus:ring-0 focus:border-transparent px-3 w-[120px] flex-1 sm:flex-none"
              >
                <option value="3">3 per row</option>
                <option value="4">4 per row</option>
                <option value="5">5 per row</option>
              </select>
            )}

            <div className="relative flex-1 min-w-[140px] sm:w-40 lg:w-44 group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={14} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-10 h-12 transition-colors"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors focus:outline-none"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <Dropdown
              placement="bottom-end"
              label={
                <div className="rounded-md h-12 px-4 font-black uppercase text-[10px] shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <SlidersHorizontal size={14} className="text-blue-500" />{" "}
                  Actions{" "}
                  <ChevronDown size={14} className="ml-1 text-gray-400" />
                </div>
              }
              arrowIcon={false}
              inline
              className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 !border-transparent !border-0 !ring-0 shadow-md rounded-md p-1.5 min-w-[240px] z-50"
            >
              <DropdownHeader className="border-none">
                <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-3 py-1">
                  Bulk Operations
                </span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 shadow-sm">
                  <Checkbox
                    id="clear-data-check-dropdown"
                    checked={clearBeforeImport}
                    onChange={(e) => setClearBeforeImport(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <label
                    htmlFor="clear-data-check-dropdown"
                    className="text-[8px] font-black uppercase tracking-widest text-gray-400 cursor-pointer select-none"
                  >
                    Clear Staging First
                  </label>
                </div>
              </DropdownHeader>

              <DropdownItem
                onClick={exportInventoryReport}
                className="rounded-md font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2.5 px-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                    <Download size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white leading-none">
                      Export Ledger
                    </p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1.5">
                      Download live & staging CSV
                    </p>
                  </div>
                </div>
              </DropdownItem>

              <DropdownItem
                onClick={() => document.getElementById("excel-import")?.click()}
                className="rounded-md font-bold text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-2.5 px-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md">
                    <Upload size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white leading-none">
                      Import Excel
                    </p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1.5">
                      Upload new staging records
                    </p>
                  </div>
                </div>
              </DropdownItem>

              <DropdownItem
                onClick={async () => {
                  try {
                    setIsProcessing(true);
                    const res = await api.post(
                      "/stock/assets/import/commit/all",
                    );
                    toast.success(
                      res.data.message || "Data committed to live inventory",
                    );
                    onRefresh?.();
                  } catch (err) {
                    toast.error("Failed to commit data");
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                disabled={isProcessing}
                className="rounded-md font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2.5 px-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md">
                    <Database size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white leading-none">
                      Commit to Live
                    </p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1.5">
                      Publish staging to live stock
                    </p>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => setIsCategoryModalOpen(true)}
                className="rounded-md font-bold text-xs hover:bg-amber-50 dark:hover:bg-amber-900/20 py-2.5 px-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md">
                    <SlidersHorizontal size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white leading-none">
                      Manage Categories
                    </p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1.5">
                      Add, edit, or delete categories
                    </p>
                  </div>
                </div>
              </DropdownItem>
            </Dropdown>

            {/* Hidden File Input for Excel Import */}
            <input
              type="file"
              id="excel-import"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportExcel(file);
              }}
            />

            <button
              onClick={handleOpenRegister}
              className="rounded-md px-5 h-12 shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest border-none flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus size={16} className="mr-1.5" /> Register
            </button>
          </div>
        </div>
      </div>

      {viewMode === "GRID" ? (
        <div className={`grid gap-6 animate-slide-up ${itemsPerRow ==="3"?"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": itemsPerRow ==="5"?"grid-cols-1 sm:grid-cols-3 lg:grid-cols-5":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {isLoading ? (
            <div className="col-span-full py-32 text-center rounded-md bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm flex flex-col items-center justify-center">
              <Spinner size="xl" />
              <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Syncing Hardware Ledger...
              </p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="col-span-full py-32 text-center rounded-md bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm">
              <Monitor size={64} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">
                No Assets Detected
              </h3>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                Adjust your search or register new hardware
              </p>
            </div>
          ) : (
            paginatedAssets.map((a) => (
              <div
                key={a.id}
                className="shadow-sm dark:bg-gray-800 p-0 hover:shadow-md transition-all group relative bg-white flex flex-col rounded-none"
              >
                {/* Image Area - Top Half */}
                <div className="w-full h-36 sm:h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0 relative overflow-hidden group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="scale-150">
                      {getAssetIcon(a.assetType)}
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      color={a.status === "Assigned" ? "blue" : "success"}
                      className="rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm"
                    >
                      {a.status || "Available"}
                    </Badge>
                  </div>
                  {/* Actions Dropdown */}
                  <div className="absolute top-4 right-4">
                    <Dropdown
                      placement="bottom-end"
                      label={
                        <div className="p-2 bg-transparent hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer rounded-none">
                          <MoreVertical size={16} />
                        </div>
                      }
                      arrowIcon={false}
                      inline
                      theme={{
                        floating: {
                          base: "z-50 w-fit focus:outline-none shadow-2xl",
                          style: {
                            auto: "border-none !rounded-none bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white"
                          }
                        }
                      }}
                    >
                      <DropdownHeader className="border-none">
                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1">
                          Asset Operations
                        </span>
                      </DropdownHeader>
                      {a?.status === "Assigned" ? (
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => handleProcessReturn(a), 0)
                          }
                          className="rounded-none mb-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 group/item"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 rounded-none group-hover/item:scale-110 transition-transform">
                              <RotateCcw size={14} />
                            </div>
                            <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                              Return to Stock
                            </span>
                          </div>
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => handleOpenAssign(a), 0)
                          }
                          className="rounded-none mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-none group-hover/item:scale-110 transition-transform">
                              <UserPlus size={14} />
                            </div>
                            <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                              Assign to Staff
                            </span>
                          </div>
                        </DropdownItem>
                      )}
                      <DropdownItem
                        onClick={() =>
                          setTimeout(() => generateAssetLabel(a), 0)
                        }
                        className="rounded-none mb-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700/40 text-gray-600 rounded-none group-hover/item:scale-110 transition-transform">
                            <Printer size={14} />
                          </div>
                          <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                            Print Tag
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        onClick={() =>
                          setTimeout(() => handleOpenDetails(a), 0)
                        }
                        className="rounded-none mb-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-none group-hover/item:scale-110 transition-transform">
                            <Zap size={14} />
                          </div>
                          <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                            View Details
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => setTimeout(() => handleOpenEdit(a), 0)}
                        className="rounded-none mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-emerald-100 dark:emerald-900/40 text-emerald-600 rounded-none group-hover/item:scale-110 transition-transform">
                            <LayoutGrid size={14} />
                          </div>
                          <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                            Edit Record
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownDivider className="my-1" />
                      <DropdownItem
                        onClick={() => setTimeout(() => handleDelete(a.id), 0)}
                        className="rounded-none hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                      >
                        <div className="flex items-center gap-3 py-1">
                          <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-none group-hover/item:scale-110 transition-transform">
                            <Trash2 size={14} />
                          </div>
                          <span className="font-bold text-xs text-rose-650">
                            Purge Node
                          </span>
                        </div>
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </div>

                {/* Details Area - Bottom Half */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-base font-black dark:text-white uppercase mb-1.5 line-clamp-1">
                    {a.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[8px] font-black text-gray-500 uppercase px-1.5 py-0.5 shadow-sm">
                      {a.assetType || "Other"}
                    </span>
                    <span className="text-[8px] font-black text-gray-500 uppercase px-1.5 py-0.5 shadow-sm">
                      {a.serialNumber}
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-2 leading-relaxed">
                    {a.employee
                      ? `Currently deployed to ${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}.`
                      : "Located in main stock node. Ready for deployment."}
                  </p>

                  {/* Footer (Custodian & Button) */}
                  <div className="flex flex-wrap items-end justify-between pt-3 mt-auto gap-y-2 gap-x-2 border-t">
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">
                        Custodian
                      </p>
                      <p className="text-xs sm:text-sm font-black dark:text-white mt-0.5 truncate">
                        {a.employee ? a.employee.firstNameEnglish : "Stock"}
                      </p>
                    </div>
                    {/* Primary Action Button */}
                    <button
                      onClick={() =>
                        a.status === "Assigned"
                          ? handleProcessReturn(a)
                          : handleOpenAssign(a)
                      }
                      className="bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-gray-900 dark:hover:bg-white rounded-none shadow-sm shrink-0 w-full xl:w-auto text-center"
                    >
                      {a.status === "Assigned" ? "Return" : "Assign"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-visible bg-white/50 backdrop-blur-xl">
          <div className="p-8 border-b bg-gray-50/50 dark:bg-gray-700/20">
            <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
              Enterprise Asset Ledger
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Centralized hardware auditing & compliance
            </p>
          </div>

          <div className="w-full overflow-visible">
            <Table
              hoverable
              className="border-none w-full min-w-[800px] relative"
            >
              <TableHead className="bg-gray-50/90 dark:bg-gray-800/90 text-[10px] font-black uppercase tracking-widest text-gray-400 sticky top-0 z-[1] backdrop-blur-md border-b shadow-sm">
                <TableHeadCell className="px-8 py-6">
                  Asset Specification
                </TableHeadCell>
                <TableHeadCell className="px-8 py-6">
                  Serial Number
                </TableHeadCell>
                <TableHeadCell className="px-8 py-6">Status</TableHeadCell>
                <TableHeadCell className="px-8 py-6">
                  Current Custodian
                </TableHeadCell>
                <TableHeadCell className="px-8 py-6">
                  Deployment Date
                </TableHeadCell>
                <TableHeadCell className="px-8 py-6 text-right">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Spinner size="xl" />
                        <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                          Syncing Hardware Ledger...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Monitor size={64} className="mx-auto text-gray-200 mb-6" />
                        <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">
                          No Assets Detected
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                          Adjust your search or register new hardware
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((a) => (
                    <TableRow
                      key={a.id}
                      className="relative bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30 hover:z-[2] focus-within:z-[2]"
                    >
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden shrink-0">
                            {a.imageUrl ? (
                              <img
                                src={a.imageUrl}
                                alt={a.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="p-2.5 text-blue-600">
                                {getAssetIcon(a.assetType)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black dark:text-white uppercase tracking-tight">
                              {a.name}
                            </p>
                            <p className="text-[8px] font-black text-gray-400 uppercase">
                              {a.assetType || "Equipment"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 font-mono text-[10px] font-black text-gray-500">
                        {a.serialNumber}
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <Badge
                          color={a.status === "Assigned" ? "blue" : "success"}
                          className="rounded-md px-4 py-1 text-[9px] font-black uppercase tracking-widest"
                        >
                          {a.status || "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        {a.employee ? (
                          <div className="flex items-center gap-3">
                            <Avatar img={a.employee.photo} rounded size="xs" />
                            <span className="font-black text-sm dark:text-white">
                              {a.employee.firstNameEnglish}{" "}
                              {a.employee.lastNameEnglish}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:bg-gray-600 text-xs italic font-bold uppercase tracking-widest">
                            Ready for Deployment
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-8 py-6 font-bold text-xs text-gray-400">
{a.assignedDate
                          ? format(new Date(a.assignedDate), "MMM dd, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <div className="flex justify-end">
                          <Dropdown
                            placement="bottom-end"
                            label={
                              <div className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-blue-600 cursor-pointer shadow-sm rounded-none border-transparent">
                                <MoreVertical size={14} />
                              </div>
                            }
                            arrowIcon={false}
                            inline
                            theme={{
                              floating: {
                                base: "z-50 w-fit focus:outline-none shadow-2xl",
                                style: {
                                  auto: "border-none !rounded-none bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white"
                                }
                              }
                            }}
                          >
                            <DropdownHeader className="border-none">
                              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1">
                                Asset Operations
                              </span>
                            </DropdownHeader>
                            {a.status === "Assigned" ? (
                              <DropdownItem
                                onClick={() =>
                                  setTimeout(() => handleProcessReturn(a), 0)
                                }
                                className="rounded-md mb-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <RotateCcw size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                                    Return to Stock
                                  </span>
                                </div>
                              </DropdownItem>
                            ) : (
                              <DropdownItem
                                onClick={() =>
                                  setTimeout(() => handleOpenAssign(a), 0)
                                }
                                className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                                    <UserPlus size={14} />
                                  </div>
                                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                                    Assign to Staff
                                  </span>
                                </div>
                              </DropdownItem>
                            )}
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => generateAssetLabel(a), 0)
                              }
                              className="rounded-md mb-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-gray-100 dark:bg-gray-700/40 text-gray-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Printer size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                                  Print Tag
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => handleOpenDetails(a), 0)
                              }
                              className="rounded-md mb-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Zap size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                                  View Details
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => handleOpenEdit(a), 0)
                              }
                              className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <LayoutGrid size={14} />
                                </div>
                                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                                  Edit Record
                                </span>
                              </div>
                            </DropdownItem>
                            <DropdownDivider className="my-1" />
                            <DropdownItem
                              onClick={() =>
                                setTimeout(() => handleDelete(a.id), 0)
                              }
                              className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                                  <Trash2 size={14} />
                                </div>
                                <span className="font-bold text-xs text-rose-650">
                                  Purge Node
                                </span>
                              </div>
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalFiltered}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Register Asset Modal */}
      <Modal
        show={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        size="xl"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Update Hardware Node" : "Register New Equipment"}
          </h3>
          <button
            type="button"
            onClick={() => setIsRegModalOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <ModalBody className="p-0">
          {/* Stepper UI */}
          <div className="flex items-center justify-between px-8 py-4 bg-gray-50 dark:bg-gray-800/80 rounded-full mx-6 mt-6 mb-2">
            {[
              { step: 1, title: "Identity & Visuals", icon: HardDrive },
              { step: 2, title: "Financials", icon: RotateCcw },
              { step: 3, title: "Compliance", icon: Upload },
            ].map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center gap-1 relative z-10 flex-1"
              >
                <div
                  className={`w-8 h-8 min-w-[32px] min-h-[32px] shrink-0 text-sm rounded-full flex items-center justify-center font-black transition-colors ${currentStep >= s.step ?"bg-blue-600 text-white shadow-md shadow-blue-500/20":"bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
                >
                  {s.step}
                </div>
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.step ?"text-blue-600 dark:text-blue-400":"text-gray-400"}`}
                >
                  {s.title}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-8 p-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="assetName"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block"
                  >
                    Asset Name
                  </Label>
                  <TextInput
                    id="assetName"
                    placeholder="e.g. MacBook Pro 14 M3"
                    {...register("name")}
                    icon={HardDrive}
                    className="shadow-sm"
                  />
                  {errors.name && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="serial"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block"
                  >
                    Serial Number
                  </Label>
                  <TextInput
                    id="serial"
                    placeholder="e.g. SN-9908821"
                    {...register("serialNumber")}
                    icon={RotateCcw}
                    className="shadow-sm"
                  />
                  {errors.serialNumber && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.serialNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Asset Category
                  </Label>
                  <div className="relative">
                    <select
                      className={`w-full bg-gray-50 dark:bg-gray-700  rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all ${errors.assetType ?"ring-2 ring-red-500 border-transparent":""}`}
                      {...register("assetType")}
                    >
                      {assetTypes
                        .filter((t) => t !== "ALL")
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.assetType && (
                    <p className="text-red-500 text-[10px] mt-1 font-bold">
                      {errors.assetType.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 mt-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Visual Reference
                  </Label>
                  <div className="flex items-center gap-5 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 rounded-xl shadow-inner group">
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Box
                          className="text-gray-300 dark:text-gray-600"
                          size={28}
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Upload a high-quality photo of the asset for visual
                        identification.
                      </p>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="asset-image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="asset-image-upload"
                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                        >
                          <Upload size={14} className="mr-2" /> Upload Image
                        </label>
                        {imageUrl && (
                          <button
                            type="button"
                            onClick={() => setValue("imageUrl", "")}
                            className="inline-flex items-center px-4 py-2 text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest"
                          >
                            <X size={14} className="mr-2" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Vendor / Supplier
                  </Label>
                  <TextInput
                    placeholder="Vendor Name"
                    {...register("vendor")}
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Asset Tag / Barcode
                  </Label>
                  <TextInput
                    placeholder="Scan Barcode"
                    {...register("barcode")}
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Purchase Cost (USD)
                  </Label>
                  <TextInput
                    type="number"
                    placeholder="0.00"
                    {...register("purchaseCost", { valueAsNumber: true })}
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Equipment Condition
                  </Label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all"
                    {...register("assetCondition")}
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Purchase Date
                  </Label>
                  <DatePicker
                    value={purchaseDate ? new Date(purchaseDate) : null}
                    onChange={(date) =>
                      setValue("purchaseDate", format(date, "yyyy-MM-dd"))
                    }
                    placeholder="Select purchase date..."
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Warranty Expiry
                  </Label>
                  <DatePicker
                    value={
                      warrantyExpiryDate ? new Date(warrantyExpiryDate) : null
                    }
                    onChange={(date) =>
                      setValue("warrantyExpiryDate", format(date, "yyyy-MM-dd"))
                    }
                    placeholder="Select expiry date..."
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Cost Center / Department
                  </Label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all"
                    {...register("costCenter")}
                  >
                    <option value="">Select Department...</option>
                    {Array.from(
                      new Set([
                        "IT Dept",
                        "HR Dept",
                        "Finance",
                        "Operations",
                        "Sales",
                        "Marketing",
                        "Executive",
                        "Engineering",
                        ...safeEmployees
                          .map((e) => e.department?.name)
                          .filter(Boolean),
                      ]),
                    )
                      .sort()
                      .map((dept) => (
                        <option key={String(dept)} value={String(dept)}>
                          {String(dept)}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Acquisition Source
                  </Label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all"
                    {...register("acquisitionType")}
                  >
                    <option value="Purchased">Purchased</option>
                    <option value="Donated">Donated</option>
                    <option value="Leased">Leased</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Funding Source / Sponsor
                  </Label>
                  <TextInput
                    placeholder="Who paid for this? (e.g. John Doe, Grants Dept)"
                    {...register("donorOrPartnerName")}
                    className="shadow-sm"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Product Family
                  </Label>
                  <TextInput
                    placeholder="e.g. End-User Computing"
                    {...register("productFamily")}
                    className="shadow-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                    Brand & Model
                  </Label>
                  <div className="flex gap-2">
                    <TextInput
                      placeholder="Brand"
                      {...register("brand")}
                      className="shadow-sm flex-1"
                    />
                    <TextInput
                      placeholder="Model Number"
                      {...register("modelNumber")}
                      className="shadow-sm flex-1"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 block">
                    Asset Flags
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isReturnable")}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Requires Return (Offboarding)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isIntangible")}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Intangible (Software/License)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isKit")}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Kit / Bundle (e.g. Onboarding Kit)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isActive")}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Active Status
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-800/80 p-5 rounded-b-md">
          <Button
            outline
            size="sm"
            color="light"
            onClick={() => setIsRegModalOpen(false)}
            className="font-black uppercase text-[10px] tracking-widest shadow-sm"
          >
            Discard
          </Button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                outline
                size="sm"
                color="light"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="font-black uppercase text-[10px] tracking-widest shadow-sm"
              >
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                outline
                size="sm"
                color="blue"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="font-black uppercase text-[10px] tracking-widest shadow-md"
              >
                Next
              </Button>
            ) : (
              <Button
                outline
                size="sm"
                color="blue"
                onClick={hookSubmit(onFormSubmit as any)}
                disabled={isProcessing}
                className="font-black uppercase text-[10px] tracking-widest shadow-md"
              >
                {isProcessing ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Save size={14} className="mr-2" />
                )}
                {isEditMode ? "Update Node" : "Commit Node"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </Modal>

      {/* Assign Asset Modal */}
      <Modal
        show={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Hardware Deployment
          </h3>
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(false)}
            className="text-red-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 p-1.5 rounded-md shadow-sm border-red-500"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="overflow-visible">
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-md text-white">
                <Monitor size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Asset Target
                </p>
                <h4 className="text-sm font-black dark:text-white uppercase">
                  {selectedAsset?.name} ({selectedAsset?.serialNumber})
                </h4>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Select Staff Member
              </Label>
              <div className="relative">
                <div className="relative">
                  <SearchInput
                                    placeholder="Search staff..."
                                    value={assignSearch}
                                    onChange={setAssignSearch}
                                    containerClassName="rounded-md text-xs [&_input]:border-transparent [&_input]:shadow-sm focus:[&_input]:ring-0 focus:[&_input]:border-transparent"
                                  />
                </div>

                {assignSearch.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredEmployeesForAssign.length > 0 ? (
                      filteredEmployeesForAssign.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => handleConfirmAssign(e.id)}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border-b last:border-b-0 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <Avatar img={e.photo} rounded size="sm" />
                            <div>
                              <p className="text-xs font-black dark:text-white uppercase">
                                {e.firstNameEnglish} {e.lastNameEnglish}
                              </p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                {e.department?.name || "General"}
                              </p>
                            </div>
                          </div>
                          <Plus size={14} className="text-blue-500" />
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                        No matching staff found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsAssignModalOpen(false)}
            className="font-black uppercase text-[10px] tracking-widest px-4 w-full"
          >
            Cancel Deployment
          </Button>
        </ModalFooter>
      </Modal>

      {/* Asset Details Modal */}
      <Modal
        show={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        size="lg"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Asset Specifications
          </h3>
          <button
            type="button"
            onClick={() => setIsDetailsModalOpen(false)}
            className="text-red-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 p-1.5 rounded-md shadow-sm border-red-500"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody>
          {viewingAsset && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                <div className="w-20 h-20 rounded-md bg-white dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-md overflow-hidden shrink-0">
                  {viewingAsset.imageUrl ? (
                    <img
                      src={viewingAsset.imageUrl}
                      alt={viewingAsset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-6 bg-blue-600 w-full h-full flex items-center justify-center text-white">
                      {getAssetIcon(viewingAsset.assetType)}
                    </div>
                  )}
                </div>
                <div>
                  <Badge
                    color={
                      viewingAsset.status === "Assigned" ? "blue" : "success"
                    }
                    className="mb-2 px-4"
                  >
                    {viewingAsset.status || "Available"}
                  </Badge>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight leading-none">
                    {viewingAsset.name}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                    Node-ID: {viewingAsset.serialNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                    Equipment Category
                  </p>
                  <p className="font-black text-sm dark:text-white uppercase">
                    {viewingAsset.assetType || "Standard"}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                    Audit Status
                  </p>
                  <p className="font-black text-sm text-emerald-500 uppercase">
                    Verified
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-md">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <Database size={12} className="text-emerald-500" />{" "}
                  Acquisition & Tracking
                </h5>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Vendor Supply
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.vendor || "Unknown Vendor"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Asset Tag (Barcode)
                    </p>
                    <p className="font-mono font-black text-sm dark:text-gray-300">
                      {viewingAsset.barcode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Purchase Info
                    </p>
                    <p className="font-black text-sm dark:text-white">
                      {viewingAsset.purchaseDate
                        ? format(
                          new Date(viewingAsset.purchaseDate),
                          "MMM dd, yyyy",
                        )
                        : "N/A"}{" "}
                      — ${viewingAsset.purchaseCost || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Warranty Expiry
                    </p>
                    <p className="font-black text-sm dark:text-white">
                      {viewingAsset.warrantyExpiryDate
                        ? format(
                          new Date(viewingAsset.warrantyExpiryDate),
                          "MMM dd, yyyy",
                        )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Equipment Condition
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.assetCondition || "Good"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Physical Location
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.location || "Headquarters"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-md">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <LayoutGrid size={12} className="text-purple-500" /> HR &
                  Internal Controls
                </h5>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Product Family
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.productFamily || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Brand & Model
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.brand || "Unknown"}{" "}
                      {viewingAsset.modelNumber || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Acquisition Source
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="font-black text-sm dark:text-white uppercase">
                        {viewingAsset.acquisitionType || "Purchased"}
                      </p>
                      {viewingAsset.acquisitionType !== "Purchased" &&
                        viewingAsset.donorOrPartnerName && (
                          <p className="text-[10px] font-bold text-gray-500 uppercase">
                            From: {viewingAsset.donorOrPartnerName}
                          </p>
                        )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Cost Center
                    </p>
                    <p className="font-black text-sm dark:text-white uppercase">
                      {viewingAsset.costCenter || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {viewingAsset.isReturnable && (
                    <Badge color="indigo">Requires Return</Badge>
                  )}
                  {!viewingAsset.isReturnable && (
                    <Badge color="gray">No Return Required</Badge>
                  )}
                  {viewingAsset.isKit && (
                    <Badge color="warning">Onboarding Kit</Badge>
                  )}
                  {viewingAsset.isIntangible && (
                    <Badge color="purple">Intangible / Digital</Badge>
                  )}
                  {viewingAsset.isActive ? (
                    <Badge color="success">Active in Catalog</Badge>
                  ) : (
                    <Badge color="failure">Archived</Badge>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-md">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <UserPlus size={12} className="text-blue-500" /> Deployment
                  Context
                </h5>

                {viewingAsset.employee ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar
                        img={viewingAsset.employee.photo}
                        rounded
                        size="lg"
                      />
                      <div>
                        <p className="font-black text-lg dark:text-white uppercase">
                          {viewingAsset.employee.firstNameEnglish}{" "}
                          {viewingAsset.employee.lastNameEnglish}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          {viewingAsset.employee.department?.name ||
                            "General Operations"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                        Assigned Since
                      </p>
                      <p className="font-black text-sm dark:text-white">
                        {viewingAsset.assignedDate
                          ? format(
                            new Date(viewingAsset.assignedDate),
                            "MMM dd, yyyy",
                          )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-md">
                    <Box size={32} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-xs font-black text-gray-400 uppercase italic">
                      Unassigned Asset Hub
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            size="sm"
            color="blue"
            onClick={() => setIsDetailsModalOpen(false)}
            className="w-full font-black uppercase text-[10px] tracking-widest"
          >
            Close Inspector
          </Button>
        </ModalFooter>
      </Modal>

      {/* Category Management Modal */}
      <Modal
        show={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Manage Asset Categories
          </h3>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <ModalBody>
          <div className="space-y-6">
            {/* Add Category Section */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Add New Category
              </Label>
              <div className="flex gap-2">
                <TextInput
                  placeholder="e.g. Tablet, Camera..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 rounded-md text-xs h-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory();
                  }}
                />
                <Button
                  color="blue"
                  onClick={handleAddCategory}
                  className="rounded-md px-4 h-12 shadow-lg shadow-blue-500/20 font-black uppercase text-[10px] tracking-widest border-none"
                >
                  <Plus size={16} /> Add
                </Button>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Active Categories
              </Label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {assetCategories.map((cat, idx) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all"
                  >
                    <div className="flex-1 pr-3">
                      {editingCatIndex === idx ? (
                        <TextInput
                          value={editingCatValue}
                          onChange={(e) => setEditingCatValue(e.target.value)}
                          className="rounded-md text-xs h-10 w-full"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditCategory(idx);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="text-xs font-black dark:text-white uppercase tracking-tight">
                          {cat}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {editingCatIndex === idx ? (
                        <>
                          <Button
                            color="success"
                            size="xs"
                            onClick={() => handleEditCategory(idx)}
                            className="rounded-md font-black uppercase text-[8px]"
                          >
                            Save
                          </Button>
                          <Button
                            color="gray"
                            size="xs"
                            onClick={() => setEditingCatIndex(idx)}
                            className="rounded-md font-black uppercase text-[8px]"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          {cat !== "Other" && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCatIndex(idx);
                                  setEditingCatValue(cat);
                                }}
                                className="p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                                title="Rename Category"
                              >
                                <SlidersHorizontal size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="blue"
            onClick={() => setIsCategoryModalOpen(false)}
            className="w-full font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-blue-500/20 border-none"
          >
            Save and Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AssetsModule;
