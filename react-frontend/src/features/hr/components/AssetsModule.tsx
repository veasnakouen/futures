import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import useAssetsModule from "./assets/useAssetsModule";
import AssetsMetricsBanner from "./assets/AssetsMetricsBanner";
import AssetsToolbar from "./assets/AssetsToolbar";
import AssetGridCard from "./assets/AssetGridCard";
import AssetTableView from "./assets/AssetTableView";
import AssetRegistrationModal from "./assets/AssetRegistrationModal";
import AssetDetailsModal from "./assets/AssetDetailsModal";
import AssetAssignModal from "./assets/AssetAssignModal";
import AssetCategoryModal from "./assets/AssetCategoryModal";

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

const AssetsModule: React.FC<AssetsModuleProps> = (props) => {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    itemsPerRow,
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
    // Modals state
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
  } = useAssetsModule(props);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Metrics Banner */}
      <AssetsMetricsBanner
        totalAssets={totalAssets}
        assignedCount={assignedCount}
        availableCount={availableCount}
      />

      {/* 2. Toolbar & View Controls */}
      <AssetsToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        assetTypes={assetTypes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExport={exportInventoryReport}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        onOpenRegister={handleOpenRegister}
      />

      {/* 3. Main Data View (GRID vs TABLE) */}
      {viewMode === "GRID" ? (
        <div className={`grid gap-6 ${itemsPerRow === "3" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {paginatedAssets.map((asset) => (
            <AssetGridCard
              key={asset.id}
              asset={asset}
              onProcessReturn={handleProcessReturn}
              onOpenAssign={handleOpenAssign}
              onGenerateLabel={generateAssetLabel}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <AssetTableView
          assets={paginatedAssets}
          isLoading={props.isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalFiltered={totalFiltered}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onProcessReturn={handleProcessReturn}
          onOpenAssign={handleOpenAssign}
          onGenerateLabel={generateAssetLabel}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* 4. Subcomponent Modals */}
      <AssetRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        isEditMode={isEditMode}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        form={form}
        assetCategories={assetCategories}
        onSubmit={onFormSubmit}
        isProcessing={isProcessing}
        handleImageChange={handleImageChange}
      />

      <AssetDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        asset={viewingAsset}
        onGenerateLabel={generateAssetLabel}
        onOpenAssign={handleOpenAssign}
        onProcessReturn={handleProcessReturn}
      />

      <AssetAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedAsset={selectedAsset}
        assignSearch={assignSearch}
        setAssignSearch={setAssignSearch}
        filteredEmployees={filteredEmployeesForAssign}
        onConfirmAssign={handleConfirmAssign}
        isProcessing={isProcessing}
      />

      <AssetCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        assetCategories={assetCategories}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddCategory={handleAddCategory}
        editingCatIndex={editingCatIndex}
        setEditingCatIndex={setEditingCatIndex}
        editingCatValue={editingCatValue}
        setEditingCatValue={setEditingCatValue}
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
      />

      <ConfirmModal
        show={confirmModal.show}
        onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default AssetsModule;
