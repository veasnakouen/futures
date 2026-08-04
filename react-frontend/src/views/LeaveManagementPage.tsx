import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { UserX } from "lucide-react";
import { useLeaveManagementPageState } from "@/features/hr/hooks/useLeaveManagementPageState";

import AnnualLeavePlannerTab from "@/features/hr/components/AnnualLeavePlannerTab";
import StaffScannerTab from "@/features/hr/components/StaffScannerTab";
import TimeOffOverview from "@/features/hr/components/TimeOffOverview";

import LeaveManagementHeaderBar from "@/features/hr/components/leave-management/LeaveManagementHeaderBar";
import MyLeavesTab from "@/features/hr/components/leave-management/MyLeavesTab";
import ManagerApprovalsTab from "@/features/hr/components/leave-management/ManagerApprovalsTab";
import ChairmanApprovalsTab from "@/features/hr/components/leave-management/ChairmanApprovalsTab";
import LeaveRequestModal from "@/features/hr/components/leave-management/LeaveRequestModal";

interface LeaveManagementPageProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

const LeaveManagementPage: React.FC<LeaveManagementPageProps> = () => {
  const state = useLeaveManagementPageState();
  const {
    activeTab,
    resolutionError,
    employeeId,
    employeeIdNo,
  } = state;

  if (resolutionError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center animate-fade-in flex flex-col items-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
            <UserX className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Unlinked Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {resolutionError}
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full h-12 font-bold rounded-xl"
            color="gray"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in pb-24">
      {/* Header Bar & Modern Navigation Tabs */}
      <LeaveManagementHeaderBar state={state} />

      {/* Tab Panels */}
      {activeTab === "my_leaves" && <MyLeavesTab state={state} />}

      {activeTab === "al_planner" && (
        <AnnualLeavePlannerTab employeeId={employeeId} employeeIdNo={employeeIdNo} />
      )}

      {activeTab === "qr_scanner" && <StaffScannerTab />}

      {activeTab === "manager_approvals" && <ManagerApprovalsTab state={state} />}

      {activeTab === "chairman_approvals" && <ChairmanApprovalsTab state={state} />}

      {activeTab === "hr_control" && <TimeOffOverview />}

      {/* Request Leave Modal */}
      <LeaveRequestModal state={state} />
    </div>
  );
};

export default LeaveManagementPage;
