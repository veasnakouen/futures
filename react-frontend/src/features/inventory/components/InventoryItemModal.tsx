import React, { useState } from "react";
import { Modal, ModalBody, Label, TextInput, Button, FileInput, ToggleSwitch } from '@/lib/flowbite-compat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import CreatableSelect from "@/components/common/CreatableSelect";
import PillTabs from "@/components/common/PillTabs";
import { Image as ImageIcon, X, Search, MapPin, History, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { type InventoryFormData } from '@/schemas/inventorySchema';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  isViewMode?: boolean;
  itemId?: number | null;
  register: UseFormRegister<InventoryFormData>;
  errors: FieldErrors<InventoryFormData>;
  setValue: UseFormSetValue<InventoryFormData>;
  watch: UseFormWatch<InventoryFormData>;
  handleSubmit: (e: React.FormEvent) => void;
  categories: string[];
  locations: any[];
}

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  isViewMode,
  itemId,
  register,
  errors,
  setValue,
  watch,
  handleSubmit,
  categories,
  locations,
}) => {
  const imageUrl = watch("imageUrl");
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);

  const handleGenerateSku = async () => {
    try {
      setIsGeneratingSku(true);
      const catId = watch("category")?.id;
      const res = await api.get(`/stock/inventory/generate-sku${catId ? `?categoryId=${catId}` : ""}`);
      if (res.data && res.data.sku) {
        setValue("sku", res.data.sku, { shouldValidate: true });
        toast.success("SKU Auto-Generated!");
      }
    } catch (err) {
      toast.error("Failed to generate SKU");
    } finally {
      setIsGeneratingSku(false);
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

  const { data: stockDistribution = [], isLoading: distLoading } = useQuery({
    queryKey: ["item-stock-distribution", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const res = await api.get(`/stock/locations/items/${itemId}`);
      return res.data || [];
    },
    enabled: !!itemId && isViewMode,
  });

  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  const { data: stockHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["item-stock-history", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const res = await api.get(`/stock/inventory/transactions/item/${itemId}`);
      return res.data || [];
    },
    enabled: !!itemId && isViewMode && activeTab === "history",
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl" dismissible={false}>
      <CustomModalHeader
        title={
          isViewMode
            ? "Item Details"
            : isEditMode
              ? "Modify Inventory Record"
              : "Initialize Stock Item"
        }
        subtitle="System Node: Inventory_Control_Alpha"
        onClose={onClose}
      />

      <ModalBody className="bg-white dark:bg-gray-800 p-0 overflow-visible">
        {isViewMode && (
          <PillTabs
            className="mx-8 mt-4"
            activeTab={activeTab}
            onTabChange={setActiveTab as any}
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "history", label: "Stock History" }
            ]}
          />
        )}
        <div className="p-8">
          <div className={!isViewMode || activeTab === "overview" ? "block" : "hidden"}>
            <form id="inventory-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Item Nomenclature
                  </Label>
                  <TextInput
                    disabled={isViewMode}
                    {...register("name")}
                    className="rounded-md"
                  />
                  {errors.name && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    SKU / Identity Code
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TextInput
                        disabled={isViewMode || isGeneratingSku}
                        {...register("sku")}
                        className="rounded-md w-full"
                        placeholder="e.g. ELEC-00001"
                      />
                    </div>
                    {!isViewMode && (
                      <Button
                        type="button"
                        color="light"
                        className="px-3"
                        onClick={handleGenerateSku}
                        disabled={isGeneratingSku}
                        title="Auto-generate Smart SKU"
                      >
                        <Wand2 size={16} className={isGeneratingSku ? "animate-pulse text-indigo-500" : "text-indigo-600 dark:text-indigo-400"} />
                      </Button>
                    )}
                  </div>
                  {errors.sku && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.sku.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Asset Category
                  </Label>
                  <Select
                    value={watch("category")?.id?.toString() || ""}
                    onValueChange={(val) => setValue("category", { id: parseInt(val) }, { shouldValidate: true })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-md">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (errors.category as any).message && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {(errors.category as any).message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Department
                  </Label>
                  <Select
                    value={watch("departmentId")?.toString() || ""}
                    onValueChange={(val) => setValue("departmentId", parseInt(val), { shouldValidate: true })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-md">
                      <SelectValue placeholder="Select a department..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc: any) => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.departmentId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <div className="flex-1">
                  <h4 className="text-sm font-bold dark:text-white">Track Inventory Stock</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable this if the item is a physical product that requires stock monitoring.</p>
                </div>
                <ToggleSwitch
                  checked={watch("trackStock")}
                  onChange={(checked: boolean) => setValue("trackStock", checked, { shouldValidate: true })}
                  disabled={isViewMode}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Current Qty
                  </Label>
                  <TextInput
                    disabled={isViewMode}
                    type="number"
                    {...register("stockQuantity")}
                    className="rounded-md"
                  />
                  {errors.stockQuantity && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.stockQuantity.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Reorder Level
                  </Label>
                  <TextInput
                    disabled={isViewMode}
                    type="number"
                    {...register("reorderLevel")}
                    className="rounded-md"
                  />
                  {errors.reorderLevel && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.reorderLevel.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Brand
                  </Label>
                  <TextInput
                    disabled={isViewMode}
                    {...register("brand")}
                    placeholder="Brand name"
                    className="rounded-md"
                  />
                  {errors.brand && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.brand.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Price (USD)
                  </Label>
                  <TextInput
                    disabled={isViewMode}
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="rounded-md"
                  />
                  {errors.price && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Asset Visual Reference
                  </Label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <div className="w-16 h-16 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gray-300" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      {!isViewMode && (
                        <>
                          <FileInput
                            id="item-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Label
                            htmlFor="item-image"
                            className="inline-block px-3 py-1.5 bg-white dark:bg-gray-700 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            Upload
                          </Label>
                        </>
                      )}
                    </div>
                    {imageUrl && !isViewMode && (
                      <button
                        type="button"
                        onClick={() => setValue("imageUrl", "")}
                        className="p-1.5 text-red-500"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {isViewMode && itemId && (
              <div className="mt-8 pt-8 border-t">
                <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-blue-500" /> Stock Distribution
                </h4>

                {distLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ) : stockDistribution.length === 0 ? (
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No stock found in any location.</p>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-hidden">
                    <table className="w-full text-left text-[11px] text-gray-500 dark:text-gray-400">
                      <thead className="bg-white dark:bg-gray-800 text-[9px] uppercase tracking-widest text-gray-400 font-black">
                        <tr>
                          <th className="px-4 py-2 border-b">Location</th>
                          <th className="px-4 py-2 border-b">Type</th>
                          <th className="px-4 py-2 border-b text-right">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockDistribution.map((dist: any) => (
                          <tr key={dist.id} className="border-b last:border-0 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            <td className="px-4 py-2 font-black dark:text-gray-300">{dist.location?.name}</td>
                            <td className="px-4 py-2 uppercase text-[9px]">{dist.location?.type}</td>
                            <td className="px-4 py-2 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                              {dist.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {isViewMode && activeTab === "history" && (
            <div className="space-y-6">
              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <History size={16} className="text-blue-500" /> Stock Movement Ledger
              </h4>

              {historyLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ) : stockHistory.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No stock history available.</p>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-hidden">
                  <table className="w-full text-left text-[11px] text-gray-500 dark:text-gray-400">
                    <thead className="bg-white dark:bg-gray-800 text-[9px] uppercase tracking-widest text-gray-400 font-black">
                      <tr>
                        <th className="px-4 py-3 border-b">Date</th>
                        <th className="px-4 py-3 border-b">Type</th>
                        <th className="px-4 py-3 border-b">Shift</th>
                        <th className="px-4 py-3 border-b">User</th>
                        <th className="px-4 py-3 border-b">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockHistory.map((tx: any) => (
                        <tr key={tx.id} className="border-b last:border-0 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                          <td className="px-4 py-3 font-mono">{new Date(tx.transactionDate).toLocaleString()}</td>
                          <td className="px-4 py-3 font-black text-gray-900 dark:text-gray-100">{tx.type}</td>
                          <td className={`px-4 py-3 font-mono font-bold ${tx.quantity > 0 ? "text-emerald-500" : tx.quantity < 0 ? "text-rose-500" : "text-gray-500"}`}>
                            {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                          </td>
                          <td className="px-4 py-3 font-black">{tx.createdBy || "System"}</td>
                          <td className="px-4 py-3">{tx.remarks || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEditMode}
        submitText={isEditMode ? "Update Database" : "Initialize Node"}
        cancelText={isViewMode ? "Close" : "Discard"}
        formId="inventory-form"
        hideSubmit={isViewMode}
      />
    </Modal>
  );
};

export default InventoryItemModal;
