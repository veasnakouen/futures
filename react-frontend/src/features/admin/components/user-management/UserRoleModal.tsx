import React from "react";
import { Modal, ModalBody, Checkbox } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Shield } from "lucide-react";

interface Props {
  state: any;
}

export default function UserRoleModal({ state }: Props) {
  const {
    t,
    showRoleModal,
    setShowRoleModal,
    selectedUser,
    roles,
    selectedRoles,
    setSelectedRoles,
    saveRoles,
  } = state;

  if (!showRoleModal || !selectedUser) return null;

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev: string[]) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  };

  return (
    <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} size="md">
      <CustomModalHeader
        title={`${t("assignRolesTo")} ${selectedUser.userName}`}
        subtitle="Configure system security roles and access permissions."
        icon={<Shield className="w-5 h-5" />}
        onClose={() => setShowRoleModal(false)}
      />
      <ModalBody className="p-6 space-y-4">
        <div className="space-y-2">
          {roles.length === 0 ? (
            <div className="space-y-2">
              {["SUPERADMIN", "ADMIN", "CLINIC_ADMIN", "HOTEL_ADMIN", "POS_ADMIN", "USER"].map((roleName) => {
                const isChecked = selectedRoles.includes(roleName);
                return (
                  <label
                    key={roleName}
                    onClick={() => toggleRole(roleName)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm"
                        : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={() => {}} />
                      <span className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                        {roleName}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            roles.map((r: any) => {
              const roleName = typeof r === "string" ? r : r.name;
              const isChecked = selectedRoles.includes(roleName);
              return (
                <label
                  key={roleName}
                  onClick={() => toggleRole(roleName)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm"
                      : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={() => {}} />
                    <span className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                      {roleName}
                    </span>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={() => setShowRoleModal(false)}
        onSubmit={saveRoles}
        submitText={t("saveRoles")}
      />
    </Modal>
  );
}
