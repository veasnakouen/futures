import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Tag,
  Building2,
  Box,
  HeartHandshake,
  FileCode2,
  Loader2,
  Copy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Database,
  Info
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export type MasterDataType = "unitOfMeasure" | "brand" | "supplierName" | "locationBin" | "donorName" | "grantCode";

interface CategoryMeta {
  id: MasterDataType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: {
    bg: string;
    text: string;
    border: string;
    accent: string;
    activeBg: string;
    darkBg: string;
  };
  placeholder: string;
  suggestions: string[];
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "unitOfMeasure",
    label: "Units of Measure (UOM)",
    shortLabel: "UOM",
    description: "Standard measurement units used in packaging, counts, and transfers.",
    icon: Layers,
    color: {
      bg: "bg-indigo-50",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
      accent: "from-indigo-500 to-indigo-600",
      activeBg: "bg-indigo-50/80 dark:bg-indigo-950/40",
      darkBg: "dark:bg-indigo-950/30",
    },
    placeholder: "e.g. pcs, box, kg, pack, bottle...",
    suggestions: ["pcs", "box", "kg", "pack", "bottle", "set", "carton", "roll", "liter", "pair"],
  },
  {
    id: "brand",
    label: "Equipment & Product Brands",
    shortLabel: "Brands",
    description: "Manufacturers, OEM vendors, and product brands registered in stock.",
    icon: Tag,
    color: {
      bg: "bg-purple-50",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      accent: "from-purple-500 to-purple-600",
      activeBg: "bg-purple-50/80 dark:bg-purple-950/40",
      darkBg: "dark:bg-purple-950/30",
    },
    placeholder: "e.g. Sony, Apple, Samsung, Philips...",
    suggestions: ["Philips", "GE Healthcare", "Siemens", "Medtronic", "Apple", "Dell", "HP", "Sony"],
  },
  {
    id: "supplierName",
    label: "Vendors & Suppliers",
    shortLabel: "Suppliers",
    description: "External supply partners, wholesale distributors, and commercial vendors.",
    icon: Building2,
    color: {
      bg: "bg-emerald-50",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      accent: "from-emerald-500 to-emerald-600",
      activeBg: "bg-emerald-50/80 dark:bg-emerald-950/40",
      darkBg: "dark:bg-emerald-950/30",
    },
    placeholder: "e.g. PharmaCorp, Global Logistics Ltd...",
    suggestions: ["Global Health Logistics", "PharmaCare Inc.", "Apex Medical Supplies", "Pacific Diagnostics"],
  },
  {
    id: "locationBin",
    label: "Storage Bins & Racks",
    shortLabel: "Storage Bins",
    description: "Warehouse sub-locations, aisle identifiers, shelving bins, and cold storage units.",
    icon: Box,
    color: {
      bg: "bg-amber-50",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      accent: "from-amber-500 to-amber-600",
      activeBg: "bg-amber-50/80 dark:bg-amber-950/40",
      darkBg: "dark:bg-amber-950/30",
    },
    placeholder: "e.g. Rack-A1, Shelf-02, Cold-Unit-1...",
    suggestions: ["Rack-A1", "Rack-A2", "Shelf-01", "Shelf-02", "Bin-101", "Bin-102", "Cold-Storage-1", "Zone-B"],
  },
  {
    id: "donorName",
    label: "Donors & Funding Agencies",
    shortLabel: "Donors",
    description: "Non-profit organizations, international development partners, and donors.",
    icon: HeartHandshake,
    color: {
      bg: "bg-rose-50",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      accent: "from-rose-500 to-rose-600",
      activeBg: "bg-rose-50/80 dark:bg-rose-950/40",
      darkBg: "dark:bg-rose-950/30",
    },
    placeholder: "e.g. USAID, UNICEF, WHO, Global Fund...",
    suggestions: ["USAID", "UNICEF", "WHO", "Global Fund", "World Bank", "Red Cross"],
  },
  {
    id: "grantCode",
    label: "Grant & Project Codes",
    shortLabel: "Grant Codes",
    description: "Financial allocation codes and project funding identifiers.",
    icon: FileCode2,
    color: {
      bg: "bg-cyan-50",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-800",
      accent: "from-cyan-500 to-cyan-600",
      activeBg: "bg-cyan-50/80 dark:bg-cyan-950/40",
      darkBg: "dark:bg-cyan-950/30",
    },
    placeholder: "e.g. G-2026-001, PRJ-HEALTH-99...",
    suggestions: ["G-2026-001", "USAID-HLTH-01", "GLOBAL-FUND-9", "PRJ-MED-2026", "EQUIP-GRANT-X"],
  },
];

interface MasterDataManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: MasterDataType;
  uomOptions: string[];
  brandOptions: string[];
  supplierOptions: string[];
  binOptions: string[];
  donorOptions: string[];
  grantCodeOptions: string[];
  onRenameOption: (field: MasterDataType, oldValue: string, newValue: string) => Promise<void>;
  onDeleteOption: (field: MasterDataType, value: string) => Promise<void>;
  onAddOption?: (field: MasterDataType, value: string) => Promise<void> | void;
}

export const MasterDataManageModal: React.FC<MasterDataManageModalProps> = ({
  isOpen,
  onClose,
  initialType = "unitOfMeasure",
  uomOptions,
  brandOptions,
  supplierOptions,
  binOptions,
  donorOptions,
  grantCodeOptions,
  onRenameOption,
  onDeleteOption,
  onAddOption,
}) => {
  const { user } = useAuthStore();
  const isSuperAdmin =
    user?.roles?.some(
      (r) =>
        typeof r === "string" &&
        (r.toUpperCase().includes("SUPER_ADMIN") || r.toUpperCase().includes("SUPERADMIN"))
    ) ?? false;

  const [activeTab, setActiveTab] = useState<MasterDataType>(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVal, setNewVal] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<string | null>(null);
  const [busyItem, setBusyItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialType) {
      setActiveTab(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (editingItem && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingItem]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  const getOptionsForTab = (tab: MasterDataType): string[] => {
    switch (tab) {
      case "unitOfMeasure":
        return uomOptions || [];
      case "brand":
        return brandOptions || [];
      case "supplierName":
        return supplierOptions || [];
      case "locationBin":
        return binOptions || [];
      case "donorName":
        return donorOptions || [];
      case "grantCode":
        return grantCodeOptions || [];
      default:
        return [];
    }
  };

  const currentOptions = getOptionsForTab(activeTab);
  const totalCategoryCount = CATEGORIES.reduce((acc, cat) => acc + getOptionsForTab(cat.id).length, 0);

  const filteredOptions = currentOptions.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const unusedSuggestions = activeCategory.suggestions.filter(
    (sug) => !currentOptions.some((opt) => opt.toLowerCase() === sug.toLowerCase())
  );

  const handleStartEdit = (item: string) => {
    setDeleteConfirmItem(null);
    setEditingItem(item);
    setEditedName(item);
  };

  const handleSaveEdit = async (oldItem: string) => {
    const trimmed = editedName.trim();
    if (!trimmed || trimmed === oldItem) {
      setEditingItem(null);
      return;
    }
    try {
      setBusyItem(oldItem);
      await onRenameOption(activeTab, oldItem, trimmed);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setBusyItem(null);
    }
  };

  const handleDelete = async (item: string) => {
    try {
      setBusyItem(item);
      await onDeleteOption(activeTab, item);
      setDeleteConfirmItem(null);
    } catch (e) {
      console.error(e);
    } finally {
      setBusyItem(null);
    }
  };

  const handleAdd = async (valueToAdd?: string) => {
    const targetVal = (valueToAdd !== undefined ? valueToAdd : newVal).trim();
    if (!targetVal) return;

    if (currentOptions.some((opt) => opt.toLowerCase() === targetVal.toLowerCase())) {
      toast.error(`"${targetVal}" already exists in ${activeCategory.shortLabel}`);
      return;
    }

    try {
      if (onAddOption) {
        await onAddOption(activeTab, targetVal);
      } else {
        // Fallback optimistic rename trigger if direct add handler isn't passed
        await onRenameOption(activeTab, targetVal, targetVal);
      }
      setNewVal("");
      if (addInputRef.current) {
        addInputRef.current.focus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    toast.success(`Copied "${text}" to clipboard`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl" className="backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                  Master Lookup Management
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  <ShieldCheck size={12} className="text-purple-600 dark:text-purple-400" />
                  Superadmin Only
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage global reference definitions across all stock modules. Changes apply in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            title="Close modal (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Split-View Navigation Layout */}
        <ModalBody className="p-0 flex flex-1 overflow-hidden">
          {!isSuperAdmin ? (
            <div className="p-12 w-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner">
                <ShieldAlert size={36} />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-white">Superadmin Access Required</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You are currently logged in as a standard user. Master reference values affect all active inventory and valuation records globally and require Superadmin authorization.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all"
              >
                Return to Ledger
              </button>
            </div>
          ) : (
            <div className="flex w-full h-full min-h-[480px]">
              {/* Left Sidebar Navigation */}
              <div className="w-72 bg-gray-50/60 dark:bg-gray-900/60 border-r border-gray-100 dark:border-gray-800 p-3 flex flex-col justify-between shrink-0">
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center justify-between">
                    <span>Reference Domains</span>
                    <span className="bg-gray-200/80 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-600 dark:text-gray-400">
                      {CATEGORIES.length}
                    </span>
                  </div>

                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    const count = getOptionsForTab(cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(cat.id);
                          setEditingItem(null);
                          setDeleteConfirmItem(null);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                          isActive
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                            : "text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-2 rounded-lg transition-colors shrink-0 ${
                              isActive
                                ? `${cat.color.bg} ${cat.color.text} dark:bg-gray-700`
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold truncate">{cat.shortLabel}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-normal">
                              {count} {count === 1 ? "value" : "values"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                              : "bg-gray-200/60 dark:bg-gray-800 text-gray-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Bottom Metadata */}
                <div className="p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                    <Database size={13} className="text-indigo-500" />
                    <span>Global Database</span>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                    {totalCategoryCount} total distinct records across all master tables.
                  </p>
                </div>
              </div>

              {/* Right Content Workspace */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                {/* Active Category Header Bar */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${activeCategory.color.bg} ${activeCategory.color.text} ${activeCategory.color.darkBg}`}>
                        <activeCategory.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">
                          {activeCategory.label}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activeCategory.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                        {currentOptions.length} Active {currentOptions.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter and Quick Add Controls */}
                <div className="p-6 pb-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Search / Filter Input */}
                    <div className="md:col-span-5 relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Search size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder={`Filter ${activeCategory.shortLabel.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Add New Value Input Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                      }}
                      className="md:col-span-7 flex gap-2"
                    >
                      <input
                        ref={addInputRef}
                        type="text"
                        placeholder={activeCategory.placeholder}
                        value={newVal}
                        onChange={(e) => setNewVal(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newVal.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Plus size={14} /> Add Value
                      </button>
                    </form>
                  </div>

                  {/* Smart Suggested Presets (One-click Add Chips) */}
                  {unusedSuggestions.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1 mr-1">
                        <Sparkles size={12} className="text-amber-500" /> Suggestions:
                      </span>
                      {unusedSuggestions.slice(0, 6).map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAdd(sug)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-gray-200/60 dark:border-gray-700/60 transition-all cursor-pointer"
                        >
                          <Plus size={10} className="text-gray-400" />
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Items List Container */}
                <div className="flex-1 px-6 pb-6 overflow-y-auto">
                  <div className="border border-gray-200/80 dark:border-gray-700/80 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-xs divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredOptions.length === 0 ? (
                      <div className="py-14 px-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto text-gray-400 dark:text-gray-500">
                          <activeCategory.icon size={22} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {searchQuery
                              ? `No ${activeCategory.shortLabel.toLowerCase()} matching "${searchQuery}"`
                              : `No ${activeCategory.shortLabel} registered yet`}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                            {searchQuery
                              ? "Try adjusting your search keyword or add this term as a new reference value."
                              : `Use the input above or click a suggestion to register your first ${activeCategory.shortLabel.toLowerCase()} value.`}
                          </p>
                        </div>
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => handleAdd(searchQuery)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer"
                          >
                            <Plus size={13} /> Add "{searchQuery}"
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredOptions.map((item, idx) => {
                        const isEditing = editingItem === item;
                        const isDeleting = deleteConfirmItem === item;
                        const isBusy = busyItem === item;
                        const isCopied = copiedItem === item;

                        if (isEditing) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-indigo-500 animate-fade-in"
                            >
                              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </div>
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(item);
                                  if (e.key === "Escape") setEditingItem(null);
                                }}
                                disabled={isBusy}
                                className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(item)}
                                  disabled={isBusy}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                >
                                  {isBusy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingItem(null)}
                                  disabled={isBusy}
                                  className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        if (isDeleting) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-4 py-3 bg-rose-50/90 dark:bg-rose-950/40 border-l-4 border-rose-500 animate-fade-in"
                            >
                              <div className="flex items-center gap-2.5">
                                <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
                                <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                                  Delete "{item}" across all inventory records?
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  disabled={isBusy}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                >
                                  {isBusy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                  <span>Confirm Delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmItem(null)}
                                  disabled={isBusy}
                                  className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-850/60 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-[10px] font-mono text-gray-400 dark:text-gray-500 text-right">
                                {idx + 1}
                              </span>
                              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black text-xs flex items-center justify-center border border-gray-200/60 dark:border-gray-700/60 uppercase">
                                {item.charAt(0)}
                              </div>
                              <div>
                                <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight">
                                  {item}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleCopy(item)}
                                title="Copy to clipboard"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                              >
                                {isCopied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(item)}
                                disabled={isBusy}
                                title="Rename across all records"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all cursor-pointer"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmItem(item)}
                                disabled={isBusy}
                                title="Delete value"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50/80 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Info size={14} className="text-indigo-500" />
            <span>Editing or deleting immediately updates all corresponding item records.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MasterDataManageModal;
