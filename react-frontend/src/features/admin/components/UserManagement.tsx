import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useUserManagementState } from "@/features/admin/hooks/useUserManagementState";

import UserMetricsBanner from "./user-management/UserMetricsBanner";
import UserToolbar from "./user-management/UserToolbar";
import UserTable from "./user-management/UserTable";
import UserRoleModal from "./user-management/UserRoleModal";
import UserCreateEditModal from "./user-management/UserCreateEditModal";
import UserResetPasswordModal from "./user-management/UserResetPasswordModal";

const UserManagement: React.FC = () => {
  const state = useUserManagementState();
  const {
    t,
    userToToggle,
    setUserToToggle,
    handleConfirmToggleUserStatus,
  } = state;

  return (
    <div className="space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-black/40 p-6 border border-white/20 dark:border-gray-700/50 animate-fade-in pb-12">
      {/* Executive Security KPI Metrics */}
      <UserMetricsBanner state={state} />

      {/* Search, Columns, & Action Toolbar */}
      <UserToolbar state={state} />

      {/* User Directory Data Table */}
      <UserTable state={state} />

      {/* Assign Roles Modal Dialog */}
      <UserRoleModal state={state} />

      {/* Create / Edit User Profile Modal Dialog */}
      <UserCreateEditModal state={state} />

      {/* Reset Security Password Modal Dialog */}
      <UserResetPasswordModal state={state} />

      {/* Toggle Account Status Confirm Dialog */}
      <ConfirmModal
        isOpen={!!userToToggle}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleConfirmToggleUserStatus}
        title={t("toggleUserStatus")}
        message={
          userToToggle
            ? `${t("confirmToggleStatus")} @${userToToggle.userName}?`
            : ""
        }
        confirmText={t("confirm")}
        cancelText={t("cancel")}
      />
    </div>
  );
};

export default UserManagement;
