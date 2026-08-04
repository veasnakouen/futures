import React, { Suspense } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import InventorySummary from "@/features/inventory/components/InventorySummary";
import { useInventoryPageState } from "@/features/inventory/hooks/useInventoryPageState";

import InventoryHeaderBar from "@/features/inventory/components/page/InventoryHeaderBar";
import InventoryToolbar from "@/features/inventory/components/page/InventoryToolbar";
import InventoryTable from "@/features/inventory/components/page/InventoryTable";

// Direct Sub-Modules for Instant 0ms Tab Switching
import LocationsModule from "@/features/inventory/components/LocationsModule";
import AssetCategorySettings from "@/features/inventory/components/AssetCategorySettings";
import AssetsModule from "@/features/hr/components/AssetsModule";

// Lazy Modals
const InventoryItemModal = React.lazy(() => import("@/features/inventory/components/InventoryItemModal"));
const TransferStockModal = React.lazy(() => import("@/features/inventory/components/TransferStockModal"));

interface InventoryPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const InventoryPage: React.FC<InventoryPageProps> = () => {
  const state = useInventoryPageState();
  const {
    t,
    activeModule,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    isViewMode,
    editingId,
    formMethods,
    hookSubmit,
    onFormSubmit,
    categories,
    locations,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
    isTransferModalOpen,
    setIsTransferModalOpen,
    transferDefaultSource,
    transferDefaultItem,
    globalAssets,
    globalEmployees,
    registerAsset,
    assignAsset,
    returnAsset,
    updateAsset,
    deleteAsset,
    refetchAssets,
    stats,
  } = state;

  return (
    <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
      {/* Header Bar & Sub Navigation */}
      <InventoryHeaderBar state={state} />

      {/* Tab 1: Inventory Ledger */}
      <div className={activeModule === "inventory" ? "block animate-fade-in space-y-6" : "hidden"}>
        <InventorySummary stats={stats} state={state} />
        <InventoryToolbar state={state} />
        <InventoryTable state={state} />
      </div>

      {/* Tab 2: Locations Management */}
      <div className={activeModule === "locations" ? "block animate-fade-in" : "hidden"}>
        <LocationsModule
          onOpenTransferModal={(sourceLoc, itemId) => {
            if (state.setTransferDefaultSource) state.setTransferDefaultSource(sourceLoc || null);
            if (state.setTransferDefaultItem) state.setTransferDefaultItem(itemId || null);
            if (state.setIsTransferModalOpen) state.setIsTransferModalOpen(true);
          }}
        />
      </div>

      {/* Tab 3: Company Assets */}
      <div className={activeModule === "assets" ? "block animate-fade-in" : "hidden"}>
        <AssetsModule
          globalAssets={globalAssets}
          employees={globalEmployees}
          onAssign={async (assetId, employeeId) => {
            await assignAsset({ id: assetId, employeeId });
          }}
          onReturn={async (assetId) => {
            await returnAsset(assetId);
          }}
          onRegister={async (assetData) => {
            await registerAsset(assetData);
          }}
          onUpdate={async (assetId, assetData) => {
            await updateAsset({ id: assetId, data: assetData });
          }}
          onDelete={async (assetId) => {
            await deleteAsset(assetId);
          }}
          onRefresh={refetchAssets}
        />
      </div>

      {/* Tab 4: Categories */}
      <div className={activeModule === "categories" ? "block animate-fade-in" : "hidden"}>
        <AssetCategorySettings />
      </div>

      {/* Item Modal (Create/Edit/View) */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <InventoryItemModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
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

        {/* Transfer Stock Modal */}
        {isTransferModalOpen && (
          <TransferStockModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            defaultSourceLocationId={transferDefaultSource}
            defaultItemId={transferDefaultItem}
          />
        )}
      </Suspense>

      {/* Confirm Delete Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t("confirmDeleteTitle") || "Delete Inventory Item"}
        message={t("confirmDeleteMessage") || "Are you sure you want to remove this item from inventory?"}
        confirmText={t("delete") || "Delete"}
        cancelText={t("cancel") || "Cancel"}
      />
    </div>
  );
};
export default InventoryPage;
