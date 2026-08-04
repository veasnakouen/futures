import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import VacancyFormModal from "@/features/vacancies/components/VacancyFormModal";
import ApplyClientModal from "@/features/vacancies/components/ApplyClientModal";
import QuickEmployerModal from "@/features/vacancies/components/QuickEmployerModal";
import QuickJobPositionModal from "@/features/vacancies/components/QuickJobPositionModal";
import { useVacanciesPageState } from "@/features/vacancies/hooks/useVacanciesPageState";

import VacanciesHeaderBar from "@/features/vacancies/components/directory/VacanciesHeaderBar";
import VacanciesGridList from "@/features/vacancies/components/directory/VacanciesGridList";
import VacanciesTableView from "@/features/vacancies/components/directory/VacanciesTableView";

interface VacanciesPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const VacanciesPage: React.FC<VacanciesPageProps> = () => {
  const state = useVacanciesPageState();
  const {
    viewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    isViewMode,
    formData,
    setFormData,
    handleSubmit,
    employers,
    jobPositions,
    setIsEmployerModalOpen,
    setIsJobPositionModalOpen,
    isApplyModalOpen,
    setIsApplyModalOpen,
    selectedVacancy,
    applyForm,
    setApplyForm,
    handleApplySubmit,
    clients,
    isEmployerModalOpen,
    quickEmployerData,
    setQuickEmployerData,
    handleQuickEmployerSubmit,
    isJobPositionModalOpen,
    quickJobPositionData,
    setQuickJobPositionData,
    handleQuickJobPositionSubmit,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  } = state;

  return (
    <div className="space-y-4 animate-fade-in max-w-[1600px] mx-auto pb-6">
      {/* Header Bar & Search Filters */}
      <VacanciesHeaderBar state={state} />

      {/* Grid or Table Directory Display */}
      {viewMode === "grid" ? (
        <VacanciesGridList state={state} />
      ) : (
        <VacanciesTableView state={state} />
      )}

      {/* Modern Pagination Controls */}
      <ModernPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalElements}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      {/* Modals & Dialogs */}
      <VacancyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        employers={employers}
        jobPositions={jobPositions}
        onAddEmployerClick={() => setIsEmployerModalOpen(true)}
        onAddJobPositionClick={() => setIsJobPositionModalOpen(true)}
      />

      <ApplyClientModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        vacancy={selectedVacancy}
        clients={clients}
        selectedClientId={applyForm.clientId}
        setSelectedClientId={(id) => setApplyForm((prev) => ({ ...prev, clientId: id }))}
        placementDate={applyForm.placementDate}
        setPlacementDate={(date) => setApplyForm((prev) => ({ ...prev, placementDate: date }))}
        handleSubmit={handleApplySubmit}
      />

      <QuickEmployerModal
        isOpen={isEmployerModalOpen}
        onClose={() => setIsEmployerModalOpen(false)}
        quickEmployerData={quickEmployerData}
        setQuickEmployerData={setQuickEmployerData}
        handleSubmit={handleQuickEmployerSubmit}
      />

      <QuickJobPositionModal
        isOpen={isJobPositionModalOpen}
        onClose={() => setIsJobPositionModalOpen(false)}
        quickJobPositionData={quickJobPositionData}
        setQuickJobPositionData={setQuickJobPositionData}
        handleSubmit={handleQuickJobPositionSubmit}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Vacancy"
        message="Are you sure you want to delete this job vacancy?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default VacanciesPage;
