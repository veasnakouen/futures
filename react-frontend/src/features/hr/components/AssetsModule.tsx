import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import ModernPagination from "@/components/common/ModernPagination";
import useAssetsModule from "./assets/useAssetsModule";
import AssetsMetricsBanner from "./assets/AssetsMetricsBanner";
import AssetsToolbar from "./assets/AssetsToolbar";
import AssetGridCard from "./assets/AssetGridCard";
import AssetTableView from "./assets/AssetTableView";
import AssetRegistrationModal from "./assets/AssetRegistrationModal";
import AssetDetailsModal from "./assets/AssetDetailsModal";
import AssetAssignModal from "./assets/AssetAssignModal";
import AssetCategoryModal from "./assets/AssetCategoryModal";
import AssetPrintLabelModal from "./assets/AssetPrintLabelModal";

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
    isPrintLabelModalOpen,
    setIsPrintLabelModalOpen,
    labelAsset,
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
    <div className="space-y-4 animate-fade-in pb-4">
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

      {/* 3. Main Data View (ACCORDION vs GRID vs TABLE) */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up rounded-2xl flex flex-col overflow-hidden h-[calc(100vh-210px)] min-h-[500px]">
        {paginatedAssets.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <span className="text-2xl font-black">📦</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Company Assets Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
              No equipment or assets match your current filter. Register your first hardware or asset to start tracking inventory assignments.
            </p>
            <button
              onClick={handleOpenRegister}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              + Register New Asset
            </button>
          </div>
        ) : viewMode === "GRID" ? (
          <div className={`grid gap-6 p-6 ${itemsPerRow === "3" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
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
          <div className="flex-1 overflow-auto w-full relative">
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
        </div>
        )}

        {/* Unified Pagination Footer */}
        {!props.isLoading && (
          <div className="p-4 bg-gray-50/50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700">
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
              totalItems={totalFiltered}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

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

      <AssetPrintLabelModal
        isOpen={isPrintLabelModalOpen}
        onClose={() => setIsPrintLabelModalOpen(false)}
        asset={labelAsset}
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
