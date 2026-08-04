import React from "react";
import { Modal, ModalBody, TextInput, Label, Checkbox } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface Props {
  state: any;
}

export default function UserCreateEditModal({ state }: Props) {
  const {
    t,
    showCreateModal,
    setShowCreateModal,
    isEditMode,
    selectedUser,
    setSelectedUser,
    newUser,
    setNewUser,
    selectedNewUserRoles,
    setSelectedNewUserRoles,
    showPassword,
    setShowPassword,
    handleCreateUser,
  } = state;

  if (!showCreateModal) return null;

  const toggleNewUserRole = (roleName: string) => {
    setSelectedNewUserRoles((prev: string[]) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  };

  return (
    <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
      <CustomModalHeader
        title={isEditMode ? t("editUser") : t("createNewUser")}
        subtitle={isEditMode ? "Update user profile details and information." : "Create a brand new system user account."}
        icon={<UserPlus className="w-5 h-5" />}
        onClose={() => setShowCreateModal(false)}
      />
      <ModalBody className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label value={t("userName")} className="text-xs font-bold uppercase tracking-wider mb-1" />
            <TextInput
              value={isEditMode ? selectedUser?.userName || "" : newUser.userName}
              onChange={(e) =>
                isEditMode
                  ? setSelectedUser(selectedUser ? { ...selectedUser, userName: e.target.value } : null)
                  : setNewUser({ ...newUser, userName: e.target.value })
              }
              placeholder="e.g. jdoe"
              required
            />
          </div>

          <div>
            <Label value={t("email")} className="text-xs font-bold uppercase tracking-wider mb-1" />
            <TextInput
              type="email"
              value={isEditMode ? selectedUser?.email || "" : newUser.email}
              onChange={(e) =>
                isEditMode
                  ? setSelectedUser(selectedUser ? { ...selectedUser, email: e.target.value } : null)
                  : setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="jdoe@example.com"
              required
            />
          </div>

          <div>
            <Label value={t("firstName")} className="text-xs font-bold uppercase tracking-wider mb-1" />
            <TextInput
              value={isEditMode ? selectedUser?.firstName || "" : newUser.firstName}
              onChange={(e) =>
                isEditMode
                  ? setSelectedUser(selectedUser ? { ...selectedUser, firstName: e.target.value } : null)
                  : setNewUser({ ...newUser, firstName: e.target.value })
              }
              placeholder="John"
            />
          </div>

          <div>
            <Label value={t("lastName")} className="text-xs font-bold uppercase tracking-wider mb-1" />
            <TextInput
              value={isEditMode ? selectedUser?.lastName || "" : newUser.lastName}
              onChange={(e) =>
                isEditMode
                  ? setSelectedUser(selectedUser ? { ...selectedUser, lastName: e.target.value } : null)
                  : setNewUser({ ...newUser, lastName: e.target.value })
              }
              placeholder="Doe"
            />
          </div>
        </div>

        {!isEditMode && (
          <div className="relative">
            <Label value={t("password")} className="text-xs font-bold uppercase tracking-wider mb-1" />
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                value={newUser.passwordHash}
                onChange={(e) => setNewUser({ ...newUser, passwordHash: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {!isEditMode && (
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Label value="Initial Roles Selection" className="text-xs font-bold uppercase tracking-wider mb-1" />
            <div className="grid grid-cols-2 gap-2">
              {["SUPERADMIN", "ADMIN", "CLINIC_ADMIN", "USER"].map((roleName) => (
                <label
                  key={roleName}
                  onClick={() => toggleNewUserRole(roleName)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    selectedNewUserRoles.includes(roleName)
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-gray-50 border-gray-100 text-gray-600"
                  }`}
                >
                  <Checkbox checked={selectedNewUserRoles.includes(roleName)} onChange={() => {}} />
                  {roleName}
                </label>
              ))}
            </div>
          </div>
        )}
      </ModalBody>
      <CustomModalFooter
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        submitText={isEditMode ? t("save") : t("create")}
      />
    </Modal>
  );
}
