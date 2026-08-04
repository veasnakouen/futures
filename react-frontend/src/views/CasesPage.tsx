import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import CaseMetricsHeader from "@/features/cases/components/CaseMetricsHeader";
import CaseListSidebar from "@/features/cases/components/CaseListSidebar";
import CaseDetailPane from "@/features/cases/components/CaseDetailPane";
import CaseFormModal from "@/features/cases/components/CaseFormModal";
import { useCasesState } from "@/features/cases/hooks/useCasesState";

interface CasesPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const CasesPage: React.FC<CasesPageProps> = () => {
  const state = useCasesState();

  return (
    <div className="animate-fade-in pb-10 space-y-6">
      {/* 1. Analytics Header */}
      <CaseMetricsHeader metrics={state.metrics} />

      {/* 2. Master-Detail Split Pane */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        <CaseListSidebar
          cases={state.cases}
          selectedCase={state.selectedCase}
          onSelectCase={state.setSelectedCase}
          onNewCase={state.openNewCaseModal}
          loading={state.loading}
          statusFilter={state.statusFilter}
          onStatusFilterChange={(filter) => {
            state.setStatusFilter(filter);
            state.setPage(0);
          }}
          page={state.page}
          totalPages={state.totalPages}
          onPageChange={state.setPage}
        />

        <CaseDetailPane
          selectedCase={state.selectedCase}
          onResolve={state.handleCloseTrigger}
          onEdit={state.handleEdit}
          onDelete={state.handleDeleteTrigger}
        />
      </div>

      {/* 3. Create / Edit Case Modal */}
      <CaseFormModal
        isOpen={state.isModalOpen}
        onClose={() => state.setIsModalOpen(false)}
        isEditMode={state.isEditMode}
        formData={state.formData}
        setFormData={state.setFormData}
        clients={state.clients}
        onSubmit={state.handleSubmit}
      />

      {/* 4. Confirmation Dialog Modal */}
      <ConfirmModal
        show={state.isConfirmOpen}
        onClose={() => state.setIsConfirmOpen(false)}
        onConfirm={state.handleConfirmAction}
        title={state.confirmAction?.type === "delete" ? "Delete Case?" : "Close Case?"}
        type={state.confirmAction?.type === "delete" ? "danger" : "info"}
        message={
          state.confirmAction?.type === "delete"
            ? "Are you sure you want to delete this case? All history will be lost."
            : "Marking this case as closed indicates that the intervention is complete."
        }
      />
    </div>
  );
};

export default CasesPage;
