import { useState } from "react";
import api from "@/services/api";

export function useUserSettingsSecurity(
  setLoading: (loading: boolean) => void,
  setSuccess: (msg: string | null) => void,
  setError: (msg: string | null) => void
) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setLoading(true);
    try {
      await api.put("/users/me/password", {
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update password. Ensure your session is valid.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return {
    passwordData,
    setPasswordData,
    handleUpdatePassword,
  };
}
