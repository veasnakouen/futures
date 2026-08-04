import React from "react";
import { Modal, ModalBody, TextInput, Label } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Key, Eye, EyeOff } from "lucide-react";

interface Props {
  state: any;
}

export default function UserResetPasswordModal({ state }: Props) {
  const {
    t,
    showResetModal,
    setShowResetModal,
    selectedUser,
    resetPassword,
    setResetPassword,
    showPassword,
    setShowPassword,
    handleResetPassword,
  } = state;

  if (!showResetModal || !selectedUser) return null;

  return (
    <Modal show={showResetModal} onClose={() => setShowResetModal(false)} size="md">
      <CustomModalHeader
        title={`${t("resetPasswordFor")} ${selectedUser.userName}`}
        subtitle="Set a new security password for this user."
        icon={<Key className="w-5 h-5" />}
        onClose={() => setShowResetModal(false)}
      />
      <ModalBody className="p-6 space-y-4">
        <div>
          <Label value="New Security Password" className="text-xs font-bold uppercase tracking-wider mb-1" />
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
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
          <p className="text-[10px] text-gray-400 font-bold mt-1">Must be at least 6 characters long.</p>
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={() => setShowResetModal(false)}
        onSubmit={handleResetPassword}
        submitText="Reset Password"
      />
    </Modal>
  );
}
