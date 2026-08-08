import React from "react";
import { Label, TextInput, FileInput, ToggleSwitch, Button } from '@/lib/flowbite-compat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreatableSelect from "@/components/common/CreatableSelect";
import { Image as ImageIcon, X, Search, Wand2, Package, DollarSign, Settings } from "lucide-react";
import { type UseFormRegister, type FieldErrors, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import { type InventoryFormData } from '@/schemas/inventorySchema';
import type { MasterDataType } from "@/features/inventory/components/MasterDataManageModal";
import { useAuthStore } from "@/store/authStore";

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
  uomOptions: string[];
  brandOptions: string[];
  binOptions: string[];
  donorOptions: string[];
  grantCodeOptions: string[];
  onGenerateSku: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRenameOption?: (field: MasterDataType, oldValue: string, newValue: string) => Promise<void> | void;
  onDeleteOption?: (field: MasterDataType, value: string) => Promise<void> | void;
  onOpenManageModal?: (type: MasterDataType) => void;
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
  uomOptions,
  brandOptions,
  binOptions,
  donorOptions,
  grantCodeOptions,
  onGenerateSku,
  onImageChange,
  onRenameOption,
  onDeleteOption,
  onOpenManageModal,
}) => {
  const imageUrl = watch("imageUrl");
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles?.some(
    (r) =>
      typeof r === "string" &&
      (r.toUpperCase().includes("SUPER_ADMIN") || r.toUpperCase().includes("SUPERADMIN"))
  ) ?? false;

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
              <Button type="button" size="xs" color="light" onClick={onGenerateSku} disabled={isGeneratingSku}>
                <Wand2 size={12} className="mr-1" /> Auto
              </Button>
            )}
          </div>
          {errors.sku && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Category</Label>
          <Select
            disabled={isViewMode}
            value={watch("category.id") ? String(watch("category.id")) : "unassigned"}
            onValueChange={(val) => setValue("category.id", val === "unassigned" ? undefined : Number(val))}
          >
            <SelectTrigger className="w-full text-xs h-8">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned" className="text-xs">Unassigned</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Primary Storage Node</Label>
          <Select
            disabled={isViewMode}
            value={watch("departmentId") ? String(watch("departmentId")) : "unassigned"}
            onValueChange={(val) => setValue("departmentId", val === "unassigned" ? undefined : Number(val))}
          >
            <SelectTrigger className="w-full text-xs h-8">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned" className="text-xs">Unassigned</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l.id} value={String(l.id)} className="text-xs">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-800/40 space-y-4">
        <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase flex items-center gap-1">
          <DollarSign size={14} className="text-emerald-600" /> Valuation & Stock Ledger Defaults
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Purchase Cost ($)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-400">$</span>
              <TextInput disabled={isViewMode} type="number" step="0.01" {...register("costPrice")} sizing="sm" style={{ paddingLeft: '1.75rem' }} className="font-mono" />
            </div>
          </div>
          <div>
            <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Retail / Billing Price ($)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-400">$</span>
              <TextInput disabled={isViewMode} type="number" step="0.01" {...register("price")} sizing="sm" style={{ paddingLeft: '1.75rem' }} className="font-mono font-bold text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-100 dark:border-emerald-800/50">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px] font-black text-gray-400 uppercase block">UOM (Unit of Measure)</Label>
              {isSuperAdmin && onOpenManageModal && (
                <button
                  type="button"
                  onClick={() => onOpenManageModal("unitOfMeasure")}
                  title="Manage all UOM values (Superadmin)"
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
                >
                  <Settings size={12} />
                </button>
              )}
            </div>
            <CreatableSelect
              options={uomOptions}
              value={watch("unitOfMeasure") || ""}
              onChange={(v) => setValue("unitOfMeasure", v)}
              disabled={isViewMode}
              placeholder="e.g. Kg, Box..."
              onRenameOption={(oldV, newV) => onRenameOption?.("unitOfMeasure", oldV, newV)}
              onDeleteOption={(v) => onDeleteOption?.("unitOfMeasure", v)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px] font-black text-gray-400 uppercase block">Brand</Label>
              {isSuperAdmin && onOpenManageModal && (
                <button
                  type="button"
                  onClick={() => onOpenManageModal("brand")}
                  title="Manage all Brand values (Superadmin)"
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
                >
                  <Settings size={12} />
                </button>
              )}
            </div>
            <CreatableSelect
              options={brandOptions}
              value={watch("brand") || ""}
              onChange={(v) => setValue("brand", v)}
              disabled={isViewMode}
              placeholder="e.g. Sony, Apple..."
              onRenameOption={(oldV, newV) => onRenameOption?.("brand", oldV, newV)}
              onDeleteOption={(v) => onDeleteOption?.("brand", v)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] font-black text-gray-400 uppercase block">Vendor / Supplier</Label>
            {isSuperAdmin && onOpenManageModal && (
              <button
                type="button"
                onClick={() => onOpenManageModal("supplierName")}
                title="Manage all Vendor values (Superadmin)"
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
              >
                <Settings size={12} />
              </button>
            )}
          </div>
          <CreatableSelect
            options={supplierOptions}
            value={watch("supplierName") || ""}
            onChange={(v) => setValue("supplierName", v)}
            disabled={isViewMode}
            placeholder="Select vendor..."
            menuPlacement="top"
            onRenameOption={(oldV, newV) => onRenameOption?.("supplierName", oldV, newV)}
            onDeleteOption={(v) => onDeleteOption?.("supplierName", v)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] font-black text-gray-400 uppercase block">Storage Bin</Label>
            {isSuperAdmin && onOpenManageModal && (
              <button
                type="button"
                onClick={() => onOpenManageModal("locationBin")}
                title="Manage all Bin values (Superadmin)"
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
              >
                <Settings size={12} />
              </button>
            )}
          </div>
          <CreatableSelect
            options={binOptions}
            value={watch("locationBin") || ""}
            onChange={(v) => setValue("locationBin", v)}
            disabled={isViewMode}
            placeholder="e.g. Rack-A1..."
            menuPlacement="top"
            onRenameOption={(oldV, newV) => onRenameOption?.("locationBin", oldV, newV)}
            onDeleteOption={(v) => onDeleteOption?.("locationBin", v)}
          />
        </div>
      </div>

      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-3">
        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Search size={14} className="text-indigo-600 dark:text-indigo-400" /> Donor Grant Allocation
          </span>
          {isSuperAdmin && onOpenManageModal && (
            <button
              type="button"
              onClick={() => onOpenManageModal("donorName")}
              title="Manage all Donors & Grant Codes (Superadmin)"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
            >
              <Settings size={12} /> Manage All
            </button>
          )}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Donor</Label>
            <CreatableSelect
              options={donorOptions}
              value={watch("donorName") || ""}
              onChange={(v) => setValue("donorName", v)}
              disabled={isViewMode}
              placeholder="e.g. USAID, UNICEF..."
              menuPlacement="top"
              onRenameOption={(oldV, newV) => onRenameOption?.("donorName", oldV, newV)}
              onDeleteOption={(v) => onDeleteOption?.("donorName", v)}
            />
          </div>
          <div>
            <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Grant Code</Label>
            <CreatableSelect
              options={grantCodeOptions}
              value={watch("grantCode") || ""}
              onChange={(v) => setValue("grantCode", v)}
              disabled={isViewMode}
              placeholder="e.g. G-12345..."
              menuPlacement="top"
              onRenameOption={(oldV, newV) => onRenameOption?.("grantCode", oldV, newV)}
              onDeleteOption={(v) => onDeleteOption?.("grantCode", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemFormFields;
