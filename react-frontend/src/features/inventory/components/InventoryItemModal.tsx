import React, { useState } from "react";
import { Modal, ModalBody } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import PillTabs from "@/components/common/PillTabs";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { type UseFormRegister, type FieldErrors, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import { type InventoryFormData } from '@/schemas/inventorySchema';

import InventoryItemFormFields from "./item-modal/InventoryItemFormFields";
import InventoryItemStockDistribution from "./item-modal/InventoryItemStockDistribution";
import InventoryItemStockHistory from "./item-modal/InventoryItemStockHistory";

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
  categories: any[];
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
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  const handleGenerateSku = async () => {
    try {
      setIsGeneratingSku(true);
      const catId = watch("category")?.id;
      const res = await api.get(`/stock/inventory/generate-sku${catId ? `?categoryId=${catId}` : ""}`);
      if (res.data?.sku) {
        setValue("sku", res.data.sku, { shouldValidate: true });
        toast.success("SKU Auto-Generated!");
      }
    } catch {
      toast.error("Failed to generate SKU");
    } finally {
      setIsGeneratingSku(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue("imageUrl", reader.result as string);
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

  const { data: stockHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["item-stock-history", itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const res = await api.get(`/stock/inventory/transactions/item/${itemId}`);
      return res.data || [];
    },
    enabled: !!itemId && isViewMode && activeTab === "history",
  });

  const supplierOptions = ["Pharma Global Co.", "MedTech Supplies", "Office Pro LLC", "General Logistics", "BioHealth Ltd"];

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl" dismissible={false}>
      <CustomModalHeader
        title={isViewMode ? "Item Details" : isEditMode ? "Modify Inventory Record" : "Initialize Stock Item"}
        subtitle="System Node: Inventory_Control_Alpha"
        onClose={onClose}
      />
      <ModalBody className="bg-white dark:bg-gray-800 p-0 overflow-visible">
        {isViewMode && (
          <PillTabs
            className="mx-8 mt-4"
            activeTab={activeTab}
            onTabChange={setActiveTab as any}
            tabs={[{ id: "overview", label: "Overview" }, { id: "history", label: "Stock History" }]}
          />
        )}
        <div className="p-8">
          {activeTab === "overview" && (
            <form id="inventory-form" onSubmit={handleSubmit} className="space-y-6">
              <InventoryItemFormFields
                isViewMode={isViewMode}
                isGeneratingSku={isGeneratingSku}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                categories={categories}
                locations={locations}
                supplierOptions={supplierOptions}
                onGenerateSku={handleGenerateSku}
                onImageChange={handleImageChange}
              />
              {isViewMode && itemId && (
                <InventoryItemStockDistribution distLoading={distLoading} stockDistribution={stockDistribution} />
              )}
            </form>
          )}

          {isViewMode && activeTab === "history" && (
            <InventoryItemStockHistory historyLoading={historyLoading} stockHistory={stockHistory} />
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
