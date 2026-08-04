import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useEmployersPageState } from "@/features/hr/hooks/useEmployersPageState";

import EmployersHeaderBar from "@/features/hr/components/employers/EmployersHeaderBar";
import EmployersGridList from "@/features/hr/components/employers/EmployersGridList";
import EmployersTableView from "@/features/hr/components/employers/EmployersTableView";
import EmployerModal from "@/features/hr/components/employers/EmployerModal";

interface EmployersPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const EmployersPage: React.FC<EmployersPageProps> = () => {
  const state = useEmployersPageState();
  const {
    t,
    viewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header, Search, & Grid/List View Toolbar */}
      <EmployersHeaderBar state={state} />

      {/* Grid or Table Directory Display */}
      {viewMode === "grid" ? (
        <EmployersGridList state={state} />
      ) : (
        <EmployersTableView state={state} />
      )}

      {/* Modern Pagination Controls */}
      {totalPages > 1 && (
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Register / Edit / View Employer Dialog Modal */}
      <EmployerModal state={state} />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Partner Employer"
        message="Are you sure you want to delete this employer record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EmployersPage;
