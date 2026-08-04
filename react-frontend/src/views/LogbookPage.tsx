import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useLogbookPageState } from "@/features/logbook/hooks/useLogbookPageState";

import LogbookHeaderBar from "@/features/logbook/components/directory/LogbookHeaderBar";
import LogbookMetricsGrid from "@/features/logbook/components/directory/LogbookMetricsGrid";
import LogbookTableView from "@/features/logbook/components/directory/LogbookTableView";
import LogbookEntryModal from "@/features/logbook/components/directory/LogbookEntryModal";

interface LogbookPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const LogbookPage: React.FC<LogbookPageProps> = () => {
  const state = useLogbookPageState();
  const {
    page,
    setPage,
    totalPages,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDelete,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar & Quick Entry Trigger */}
      <LogbookHeaderBar state={state} />

      {/* 4-Card Facility Usage Metrics Grid */}
      <LogbookMetricsGrid state={state} />

      {/* Search Bar & Activity Logs DataTable */}
      <LogbookTableView state={state} />

      {/* Modern Pagination Controls */}
      {totalPages > 0 && (
        <div className="mt-8">
          <ModernPagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
            showInfo={false}
          />
        </div>
      )}

      {/* Quick Entry / Edit / View Modal */}
      <LogbookEntryModal state={state} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this log entry? This record is used for reporting statistics."
      />
    </div>
  );
};

export default LogbookPage;
