import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import ClientTable from "@/features/clients/components/ClientTable";
import ClientRegistrationModal from "@/features/clients/components/ClientRegistrationModal";
import { useClientsPageState } from "@/features/clients/hooks/useClientsPageState";

import ClientsHeaderBar from "@/features/clients/components/directory/ClientsHeaderBar";
import ClientsGridList from "@/features/clients/components/directory/ClientsGridList";

interface ClientsPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
  hideLayout?: boolean;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ hideLayout = false }) => {
  const state = useClientsPageState();
  const {
    t,
    viewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    isModalOpen,
    setIsModalOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
    isEditMode,
    editingId,
    formData,
    setFormData,
    handleSubmit,
    handlePhotoChange,
    handleEdit,
    handleDelete,
    clients,
    visibleColumns,
    connections,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header, Search Filters, & View Mode Toolbar */}
      <ClientsHeaderBar state={state} hideLayout={hideLayout} />

      {/* Grid or Table Directory Display */}
      {viewMode === "grid" ? (
        <ClientsGridList state={state} />
      ) : (
        <ClientTable
          clients={clients}
          visibleColumns={visibleColumns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          connections={connections}
          toggleConnection={() => {}}
          handleMessage={() => {}}
        />
      )}

      {/* Modern Pagination Controls */}
      {(totalElements > (pageSize || 10) || totalPages > 1) && (
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Beneficiary Registration Wizard Modal */}
      <ClientRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handlePhotoChange={handlePhotoChange}
        clientId={editingId || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t("confirmDeleteTitle") || "Remove Client Record"}
        message={t("confirmDeleteMessage") || "Are you sure you want to delete this client record?"}
        confirmText={t("delete") || "Delete"}
        cancelText={t("cancel") || "Cancel"}
      />
    </div>
  );
};

export default ClientsPage;
