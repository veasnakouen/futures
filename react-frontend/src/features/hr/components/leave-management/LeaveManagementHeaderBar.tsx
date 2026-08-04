import React from "react";
import { Button } from "@/lib/flowbite-compat";
import ModernTabs from "@/components/common/ModernTabs";
import { Calendar, Shield, Clock } from "lucide-react";

interface Props {
  state: any;
}

export default function LeaveManagementHeaderBar({ state }: Props) {
  const {
    activeTab,
    setActiveTab,
    isManager,
    isSuperAdmin,
    isChairman,
    pendingManager,
    pendingChairman,
    setShowRequestModal,
  } = state;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} /> Employee Leave & Absence Workspace
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Submit leave requests, check annual balances, and authorize staff time-off
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            color="blue"
            onClick={() => setShowRequestModal(true)}
            className="rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20 px-4"
          >
            Request Time Off
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <ModernTabs
        tabs={[
          { id: "my_leaves", label: "My Leaves" },
          { id: "al_planner", label: "AL Planner" },
          { id: "qr_scanner", label: "QR Check-In / Scanner" },
          ...(isManager || isSuperAdmin
            ? [
                {
                  id: "manager_approvals",
                  label: `Manager Approvals ${pendingManager.length > 0 ? `(${pendingManager.length})` : ""}`,
                },
                { id: "hr_control", label: "HR Control & Reports" },
              ]
            : []),
          ...(isChairman
            ? [
                {
                  id: "chairman_approvals",
                  label: `Chairman Approvals ${pendingChairman.length > 0 ? `(${pendingChairman.length})` : ""}`,
                },
              ]
            : []),
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
      />
    </div>
  );
}
