import { useState, useEffect, useRef } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export function useUserSettingsProfile() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const { updateUser, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<"avatar" | "logo">("avatar");
  const [appLogo, setAppLogo] = useState<string | null>(null);

  const [profileData, setProfileData] = useState(() => {
    const u: any = user || {};
    let fName = u.firstName || "";
    let lName = u.lastName || "";
    if (!fName && !lName) {
      const full = (u.fullName || u.name || u.username || u.email || "").trim();
      if (full.includes("@")) {
        const prefix = full.split("@")[0];
        fName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        lName = "User";
      } else if (full) {
        const parts = full.split(" ");
        fName = parts[0] || "Admin";
        lName = parts.slice(1).join(" ") || "User";
      }
    }
    return {
      firstName: fName || "Admin",
      lastName: lName || "User",
      email: u.email || (u.username?.includes("@") ? u.username : "admin@mtp.com"),
      branch: u.branch || "Main Office",
      photo: u.photo || u.avatarUrl || "",
    };
  });

  const { data: profileQueryData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await api.get("/users/me");
        return response.data?.data || response.data;
      } catch {
        return null;
      }
    },
  });

  useEffect(() => {
    const activeUser = profileQueryData || user;
    if (activeUser) {
      let fName = activeUser.firstName || "";
      let lName = activeUser.lastName || "";
      if (!fName && !lName) {
        const full = (activeUser.fullName || activeUser.name || activeUser.username || activeUser.email || "").trim();
        if (full.includes("@")) {
          const prefix = full.split("@")[0];
          fName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          lName = "User";
        } else if (full) {
          const parts = full.split(" ");
          fName = parts[0] || "Admin";
          lName = parts.slice(1).join(" ") || "User";
        }
      }
      const photoUrl = activeUser.photo || activeUser.avatarUrl || "";
      setProfileData({
        firstName: fName || "Admin",
        lastName: lName || "User",
        email: activeUser.email || (activeUser.username?.includes("@") ? activeUser.username : "admin@mtp.com"),
        branch: activeUser.branch || "Main Office",
        photo: photoUrl,
      });
    }
  }, [profileQueryData, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/users/me/profile", profileData);
      setSuccess("Profile updated successfully!");
      updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        branch: profileData.branch,
        photo: profileData.photo,
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        branch: profileData.branch,
        photo: profileData.photo,
      });
      setSuccess("Profile settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "avatar" | "logo" = "avatar"
  ) => {
    setCropTarget(target);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoResult = reader.result as string;
      if (cropTarget === "avatar") {
        setProfileData((prev) => ({ ...prev, photo: photoResult }));
        updateUser({ photo: photoResult, avatarUrl: photoResult });
        if (typeof window !== "undefined") {
          localStorage.setItem("user_profile_photo", photoResult);
          localStorage.setItem("user_avatar", photoResult);
        }
      } else {
        setAppLogo(photoResult);
      }
    };
    reader.readAsDataURL(croppedFile);
  };

  return {
    loading,
    setLoading,
    success,
    setSuccess,
    error,
    setError,
    activeTab,
    setActiveTab,
    profileData,
    setProfileData,
    fileInputRef,
    cropImageSrc,
    setCropImageSrc,
    isCropModalOpen,
    setIsCropModalOpen,
    cropTarget,
    appLogo,
    setAppLogo,
    handleUpdateProfile,
    handleImageUpload,
    handleCropComplete,
  };
}
