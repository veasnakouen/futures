import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import EmployeeRegistrationModal from "@/features/hr/components/EmployeeRegistrationModal";
import EmployeeDetailModal from "@/features/hr/components/EmployeeDetailModal";
import AnalyticsModal from "@/features/hr/components/AnalyticsModal";
import ManualAttendanceModal from "@/features/hr/components/ManualAttendanceModal";
import BiometricDeviceModal from "@/features/hr/components/BiometricDeviceModal";
import { useEmployeesPageState } from "@/features/hr/hooks/useEmployeesPageState";

import EmployeesPageHeader from "@/features/hr/components/page/EmployeesPageHeader";
import EmployeeImportModal from "@/features/hr/components/page/EmployeeImportModal";
import EmployeesModuleRenderer from "@/features/hr/components/page/EmployeesModuleRenderer";

interface EmployeesPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const EmployeesPage: React.FC<EmployeesPageProps> = () => {
  const state = useEmployeesPageState();
  const {
    t,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    regTab,
    setRegTab,
    formMethods,
    onFormSubmit,
    hookSubmit,
    selectedEmployee,
    isDetailModalOpen,
    setIsDetailModalOpen,
    portalTab,
    setPortalTab,
    isAnalyticsModalOpen,
    setIsAnalyticsModalOpen,
    isManualAttendanceOpen,
    setIsManualAttendanceOpen,
    isDeviceModalOpen,
    setIsDeviceModalOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    handleConfirmDelete,
  } = state;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header & Sub-module Navigation */}
      <EmployeesPageHeader state={state} />

      {/* Module View Renderer */}
      <EmployeesModuleRenderer state={state} />

      {/* Onboarding & Edit Registration Modal */}
      {isModalOpen && (
        <EmployeeRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEditMode={isEditMode}
          regTab={regTab}
          setRegTab={setRegTab}
          formMethods={formMethods}
          onSubmit={onFormSubmit}
        />
      )}

      {/* Employee Details & Portfolio Modal */}
      {isDetailModalOpen && selectedEmployee && (
        <EmployeeDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          employee={selectedEmployee}
          activeTab={portalTab}
          setActiveTab={setPortalTab}
        />
      )}

      {/* Intelligence & Analytics Drawer */}
      {isAnalyticsModalOpen && (
        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />
      )}

      {/* Manual Log Attendance Modal */}
      {isManualAttendanceOpen && (
        <ManualAttendanceModal
          isOpen={isManualAttendanceOpen}
          onClose={() => setIsManualAttendanceOpen(false)}
          employees={state.employees}
          handleSubmit={() => {}}
        />
      )}

      {/* Biometric Device Terminal Sync Modal */}
      {isDeviceModalOpen && (
        <BiometricDeviceModal
          isOpen={isDeviceModalOpen}
          onClose={() => setIsDeviceModalOpen(false)}
        />
      )}

      {/* Candidate User Import Dialog */}
      <EmployeeImportModal state={state} />

      {/* Decommission Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("confirmDecommission")}
        message={t("decommissionWarning")}
        confirmText={t("decommission")}
        cancelText={t("cancel")}
      />
    </div>
  );
};

export default EmployeesPage;
