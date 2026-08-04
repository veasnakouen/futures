import React from "react";
import { Label, TextInput, FileInput, ToggleSwitch, Button } from '@/lib/flowbite-compat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreatableSelect from "@/components/common/CreatableSelect";
import { Image as ImageIcon, X, Search, Wand2 } from "lucide-react";
import { type UseFormRegister, type FieldErrors, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import { type InventoryFormData } from '@/schemas/inventorySchema';

interface InventoryItemFormFieldsProps {
  isViewMode?: boolean;
  isGeneratingSku: boolean;
  register: UseFormRegister<InventoryFormData>;
  errors: FieldErrors<InventoryFormData>;
  setValue: UseFormSetValue<InventoryFormData>;
  watch: UseFormWatch<InventoryFormData>;
  categories: any[];
  locations: any[];
  supplierOptions: string[];
  onGenerateSku: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InventoryItemFormFields: React.FC<InventoryItemFormFieldsProps> = ({
  isViewMode,
  isGeneratingSku,
  register,
  errors,
  setValue,
  watch,
  categories,
  locations,
  supplierOptions,
  onGenerateSku,
  onImageChange,
}) => {
  const imageUrl = watch("imageUrl");

  return (
    <div className="space-y-6 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Item Nomenclature</Label>
          <TextInput disabled={isViewMode} {...register("name")} sizing="sm" />
          {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">SKU Code</Label>
          <div className="flex gap-2">
            <TextInput disabled={isViewMode || isGeneratingSku} {...register("sku")} sizing="sm" placeholder="e.g. ELEC-00001" className="flex-1" />
            {!isViewMode && (
              <Button type="button" color="light" size="xs" onClick={onGenerateSku} disabled={isGeneratingSku}>
                <Wand2 size={14} className={isGeneratingSku ? "animate-pulse text-indigo-500" : "text-indigo-600"} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Asset Category</Label>
          <Select
            value={typeof watch("category") === "object" ? watch("category")?.id?.toString() || "" : watch("category")?.toString() || ""}
            onValueChange={(val) => setValue("category", { id: parseInt(val), name: val }, { shouldValidate: true })}
            disabled={isViewMode}
          >
            <SelectTrigger className="w-full h-9 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-md text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select Category..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border shadow-2xl">
              {categories.map((cat: any, idx: number) => (
                <SelectItem key={idx} value={typeof cat === 'object' ? (cat.id?.toString() || idx.toString()) : cat.toString()}>
                  {typeof cat === 'object' ? (cat.name || cat.title) : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Department</Label>
          <Select
            value={watch("departmentId")?.toString() || ""}
            onValueChange={(val) => setValue("departmentId", parseInt(val), { shouldValidate: true })}
            disabled={isViewMode}
          >
            <SelectTrigger className="w-full h-9 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-md text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select Department..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border shadow-2xl">
              {locations.map((loc: any, idx: number) => (
                <SelectItem key={idx} value={typeof loc === 'object' ? (loc.id?.toString() || idx.toString()) : loc.toString()}>
                  {typeof loc === 'object' ? (loc.name || loc.title) : loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
        <div className="flex-1">
          <h4 className="text-xs font-bold dark:text-white">Track Inventory Stock</h4>
          <p className="text-[10px] text-gray-400">Enable monitoring for physical stock quantities.</p>
        </div>
        <ToggleSwitch checked={watch("trackStock")} onChange={(c) => setValue("trackStock", c)} disabled={isViewMode} />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Current Qty</Label>
          <TextInput disabled={isViewMode} type="number" {...register("stockQuantity")} sizing="sm" />
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Reorder Level</Label>
          <TextInput disabled={isViewMode} type="number" {...register("reorderLevel")} sizing="sm" />
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">UOM</Label>
          <TextInput disabled={isViewMode} {...register("unitOfMeasure")} placeholder="Pcs/Box" sizing="sm" />
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Brand</Label>
          <TextInput disabled={isViewMode} {...register("brand")} sizing="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Cost Price ($)</Label>
          <TextInput disabled={isViewMode} type="number" step="0.01" {...register("costPrice")} sizing="sm" />
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Selling Price ($)</Label>
          <TextInput disabled={isViewMode} type="number" step="0.01" {...register("price")} sizing="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Vendor / Supplier</Label>
          <CreatableSelect options={supplierOptions} value={watch("supplierName") || ""} onChange={(v) => setValue("supplierName", v)} disabled={isViewMode} />
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Storage Bin</Label>
          <TextInput disabled={isViewMode} {...register("locationBin")} sizing="sm" />
        </div>
      </div>

      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 space-y-3">
        <h4 className="text-xs font-black text-indigo-900 uppercase flex items-center gap-1">
          <Search size={14} className="text-indigo-600" /> Donor Grant Allocation
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <TextInput disabled={isViewMode} {...register("donorName")} placeholder="Donor / USAID" sizing="sm" />
          <TextInput disabled={isViewMode} {...register("grantCode")} placeholder="Grant Code" sizing="sm" />
        </div>
      </div>
    </div>
  );
};

export default InventoryItemFormFields;
