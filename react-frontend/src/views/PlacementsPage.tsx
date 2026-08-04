import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { usePlacementsPageState } from "@/features/hr/hooks/usePlacementsPageState";

import PlacementsHeaderBar from "@/features/hr/components/placements/PlacementsHeaderBar";
import PlacementsGridList from "@/features/hr/components/placements/PlacementsGridList";
import PlacementsTableView from "@/features/hr/components/placements/PlacementsTableView";
import PlacementModal from "@/features/hr/components/placements/PlacementModal";

interface PlacementsPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const PlacementsPage: React.FC<PlacementsPageProps> = () => {
  const state = usePlacementsPageState();
  const {
    viewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-12">
      {/* Header Bar, Search, & Grid/List View Controls */}
      <PlacementsHeaderBar state={state} />

      {/* Grid or Table Directory Display */}
      {viewMode === "grid" ? (
        <PlacementsGridList state={state} />
      ) : (
        <PlacementsTableView state={state} />
      )}

      {/* Modern Pagination Bar */}
      {totalPages > 1 && (
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Record / Edit Placement Modal */}
      <PlacementModal state={state} />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Placement Record"
        message="Are you sure you want to delete this placement record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PlacementsPage;
