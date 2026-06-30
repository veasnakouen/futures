import React from "react";
import {
  Modal,
  ModalBody,
  Label,
  TextInput,
  Select,
  Button,
  FileInput,
} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import CreatableSelect from "@/components/common/CreatableSelect";
import { Image as ImageIcon, X, Search } from "lucide-react";
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
  register: UseFormRegister<InventoryFormData>;
  errors: FieldErrors<InventoryFormData>;
  setValue: UseFormSetValue<InventoryFormData>;
  watch: UseFormWatch<InventoryFormData>;
  handleSubmit: (e: React.FormEvent) => void;
  categories: string[];
  locations: string[];
  units: string[];
}

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  isViewMode,
  register,
  errors,
  setValue,
  watch,
  handleSubmit,
  categories,
  locations,
  units,
}) => {
  const imageUrl = watch("imageUrl");

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

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
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

      <ModalBody className="bg-white dark:bg-gray-800 p-8">
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
              <TextInput
                disabled={isViewMode}
                {...register("sku")}
                className="rounded-md"
              />
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
              <CreatableSelect
                options={categories}
                value={watch("category")}
                onChange={(val) => setValue("category", val, { shouldValidate: true })}
                placeholder="Select or type category..."
                disabled={isViewMode}
              />
              {errors.category && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Storage Location
              </Label>
              <CreatableSelect
                options={locations}
                value={watch("location")}
                onChange={(val) => setValue("location", val, { shouldValidate: true })}
                placeholder="Select or type location..."
                disabled={isViewMode}
              />
              {errors.location && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Current Qty
              </Label>
              <TextInput
                disabled={isViewMode}
                type="number"
                {...register("quantity")}
                className="rounded-md"
              />
              {errors.quantity && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Safety Threshold
              </Label>
              <TextInput
                disabled={isViewMode}
                type="number"
                {...register("minQuantity")}
                className="rounded-md"
              />
              {errors.minQuantity && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.minQuantity.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Measurement Unit
              </Label>
              <CreatableSelect
                options={units}
                value={watch("unit")}
                onChange={(val) => setValue("unit", val, { shouldValidate: true })}
                placeholder="Select or type unit (e.g. pcs, boxes)"
                disabled={isViewMode}
              />
              {errors.unit && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                Unit Valuation (USD)
              </Label>
              <TextInput
                disabled={isViewMode}
                type="number"
                step="0.01"
                {...register("unitPrice")}
                className="rounded-md"
              />
              {errors.unitPrice && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                Asset Visual Reference
              </Label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
                <div className="w-16 h-16 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border dark:border-gray-700 shadow-inner shrink-0">
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
                        className="inline-block px-3 py-1.5 bg-white dark:bg-gray-700 border dark:border-gray-700 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
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
      </ModalBody>
      <div className="p-4 bg-white dark:bg-gray-800">
        <CustomModalFooter
          onClose={onClose}
          isEditMode={isEditMode}
          submitText={isEditMode ? "Update Database" : "Initialize Node"}
          cancelText={isViewMode ? "Close" : "Discard"}
          formId="inventory-form"
          hideSubmit={isViewMode}
        />
      </div>
    </Modal>
  );
};

export default InventoryItemModal;
