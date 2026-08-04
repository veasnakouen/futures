import React from "react";
import { Alert, Spinner } from "@/lib/flowbite-compat";
import {
  User,
  Lock,
  Palette,
  Shield,
  Camera,
  Building2,
  ShieldAlert,
  Globe,
  Server,
  Briefcase,
  MessageSquare,
  CreditCard,
} from "lucide-react";

import ChatbotSettingsTab from "@/features/admin/components/ChatbotSettingsTab";
import TenantsTab from "@/features/admin/components/TenantsTab";
import ImageCropperModal from "@/components/common/ImageCropperModal";
import { getFaceFocusedUrl } from "@/utils/cloudinary";
import { useAuthStore } from "@/store/authStore";
import { useSettingsState } from "@/features/admin/hooks/useSettingsState";

import SettingsProfileTab from "@/features/admin/components/settings/SettingsProfileTab";
import SettingsSecurityTab from "@/features/admin/components/settings/SettingsSecurityTab";
import SettingsAppearanceTab from "@/features/admin/components/settings/SettingsAppearanceTab";
import SettingsSystemTab from "@/features/admin/components/settings/SettingsSystemTab";
import SettingsSecurityLogsTab from "@/features/admin/components/settings/SettingsSecurityLogsTab";

interface SettingsPageProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isDark, setIsDark }) => {
  const state = useSettingsState();
  const { user } = useAuthStore();
  const {
    t,
    success,
    error,
    activeTab,
    setActiveTab,
    fileInputRef,
    handleImageUpload,
    profileData,
    cropImageSrc,
    isCropModalOpen,
    setIsCropModalOpen,
    setCropImageSrc,
    handleCropComplete,
  } = state;

  return (
    <>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        {success && (
          <Alert
            color="success"
            icon={Shield}
            className="rounded-md border-none shadow-lg shadow-green-500/10"
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            color="failure"
            icon={ShieldAlert}
            className="rounded-md border-none shadow-lg shadow-red-500/10"
          >
            {error}
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation (Tabs) */}
          <div className="w-full md:w-72 space-y-2 shrink-0">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-4">
              <div className="p-4 flex flex-col items-center text-center gap-4">
                <div
                  className="relative group cursor-pointer rounded-full overflow-hidden transition-all duration-300 hover:scale-105 border-4 shadow-sm w-24 h-24 flex items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    accept="image/*"
                    className="hidden"
                  />
                  <img
                    alt="Profile"
                    src={
                      profileData.photo
                        ? getFaceFocusedUrl(profileData.photo, 200)
                        : user?.photo || user?.avatarUrl
                        ? getFaceFocusedUrl(user.photo || user.avatarUrl, 200)
                        : typeof window !== "undefined" && localStorage.getItem("user_profile_photo")
                        ? getFaceFocusedUrl(localStorage.getItem("user_profile_photo")!, 200)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent((profileData.firstName || "Superadmin") + " " + (profileData.lastName || "User"))}&background=4f46e5&color=ffffff&bold=true&size=256`
                    }
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{profileData.email}</p>
                </div>
              </div>
              <hr className="my-4 border-slate-200/50 dark:border-slate-700/50" />
              <div className="space-y-1.5 px-2">
                {[
                  {
                    id: "profile",
                    icon: <User size={18} />,
                    label: t("profileInfo"),
                  },
                  {
                    id: "security",
                    icon: <Lock size={18} />,
                    label: t("security"),
                  },
                  {
                    id: "appearance",
                    icon: <Palette size={18} />,
                    label: t("interface"),
                  },
                  {
                    id: "system",
                    icon: <Server size={18} />,
                    label: t("systemConfig"),
                  },
                  {
                    id: "security_logs",
                    icon: <ShieldAlert size={18} />,
                    label: t("securityLogs"),
                  },
                  {
                    id: "chatbot",
                    icon: <MessageSquare size={18} />,
                    label: t("chatbotDocuments"),
                  },
                  ...(Array.isArray(user?.roles) &&
                  user.roles.some((r: any) => {
                    const roleName = (typeof r === "string" ? r : r?.name || "").toUpperCase();
                    return roleName.includes("ADMIN");
                  })
                    ? [
                        {
                          id: "organizations",
                          icon: <Globe size={18} />,
                          label: t("organizations"),
                        },
                      ]
                    : []),
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-bold translate-x-1"
                        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:translate-x-1 font-medium"
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6 min-w-0">
            {activeTab === "organizations" && <TenantsTab />}
            {activeTab === "chatbot" && <ChatbotSettingsTab />}
            {activeTab === "profile" && <SettingsProfileTab state={state} />}
            {activeTab === "security" && <SettingsSecurityTab state={state} />}
            {activeTab === "appearance" && (
              <SettingsAppearanceTab state={state} isDark={isDark} setIsDark={setIsDark} />
            )}
            {activeTab === "system" && <SettingsSystemTab state={state} />}
            {activeTab === "security_logs" && <SettingsSecurityLogsTab state={state} />}
          </div>
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropImageSrc(null);
          }}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </>
  );
};

export default SettingsPage;
