import React from "react";
import ModernPagination from "@/components/common/ModernPagination";
import { useWorkforceDirectoryState } from "@/features/hr/hooks/useWorkforceDirectoryState";

import WorkforceGrid from "./workforce/WorkforceGrid";
import EmployeeDetailModal from "./EmployeeDetailModal";

import WorkforceMetricsHeader from "./workforce/WorkforceMetricsHeader";
import WorkforceFilterControls from "./workforce/WorkforceFilterControls";
import WorkforceTableView from "./workforce/WorkforceTableView";

interface WorkforceDirectoryProps {
  employees?: any[];
  filteredEmployees?: any[];
  search?: string;
  setSearch?: (val: any) => void;
  viewMode?: string;
  setViewMode?: (val: any) => void;
  positions?: any[];
  onRefresh?: () => Promise<void>;
  onImportFromUsers?: () => void;
  onAddEmployee?: () => void;
  onEditEmployee?: (emp: any) => void;
  handleEdit?: (emp: any) => void;
  onDeleteEmployee?: (id: number) => void;
  handleDelete?: (id: number) => void;
  [key: string]: any;
}

const WorkforceDirectory: React.FC<WorkforceDirectoryProps> = (props) => {
  const state = useWorkforceDirectoryState(props);
  const {
    layoutMode,
    paginatedEmployees,
    selectedEmployee,
    setSelectedEmployee,
    actualOnEdit,
    actualOnDelete,
    safeCurrentPage,
    setCurrentPage,
    totalElements,
    pageSize,
    setPageSize,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* KPI Overview Banner */}
      <WorkforceMetricsHeader state={state} />

      {/* Advanced Filter Toolbar */}
      <WorkforceFilterControls state={state} />

      {/* Directory Content (Grid vs. Table) */}
      {layoutMode === "grid" ? (
        <WorkforceGrid
          employees={paginatedEmployees}
          searchQuery=""
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onEditEmployee={actualOnEdit}
          onDeleteEmployee={actualOnDelete}
        />
      ) : (
        <WorkforceTableView state={state} />
      )}

      {/* Modern Pagination Controls */}
      <div className="flex justify-end pt-2">
        <ModernPagination
          currentPage={safeCurrentPage}
          totalPages={state.totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Detailed Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen={Boolean(selectedEmployee)}
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default WorkforceDirectory;
