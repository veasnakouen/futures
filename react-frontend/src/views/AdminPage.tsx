import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import ModernTabs from "@/components/common/ModernTabs";
import { ShieldCheck, Logs, ShieldUser, DatabaseBackup, Activity, Languages, Sparkles, Boxes } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";

const UserManagement = dynamic(() => import("@/features/admin/components/UserManagement"), { ssr: false });
const RoleManagement = dynamic(() => import("@/features/admin/components/RoleManagement"), { ssr: false });
const CustomFieldBuilder = dynamic(() => import("@/features/admin/components/CustomFieldBuilder"), { ssr: false });
const DynamicEntityBuilder = dynamic(() => import("@/features/admin/components/DynamicEntityBuilder"), { ssr: false });
const UserLogRecorder = dynamic(() => import("@/features/admin/components/UserLogRecorder"), { ssr: false });
const SwitchDatabase = dynamic(() => import("@/features/admin/components/SwitchDatabase"), { ssr: false });
const TelemetryAndDataCleanTab = dynamic(() => import("@/features/admin/components/TelemetryAndDataCleanTab"), { ssr: false });
const TranslationManagementTab = dynamic(() => import("@/features/admin/components/TranslationManagementTab"), { ssr: false });

interface AdminPageProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

const TABS = [
  { id: "USERS", label: "User Access Control", icon: <ShieldUser size={18} /> },
  { id: "ROLES", label: "Role Permissions", icon: <ShieldCheck size={18} /> },
  { id: "CUSTOM_FIELDS", label: "No-Code Field Builder", icon: <Sparkles size={18} /> },
  { id: "DYNAMIC_ENTITIES", label: "Dynamic Entity & Relationship Builder", icon: <Boxes size={18} /> },
  { id: "TRANSLATIONS", label: "i18n Database Translations", icon: <Languages size={18} /> },
  { id: "DATA_TELEMETRY", label: "Telemetry & Data Clean", icon: <Activity size={18} /> },
  { id: "LOGS", label: "User Log Recorder", icon: <Logs size={18} /> },
  { id: "DB", label: "Switch Database", icon: <DatabaseBackup size={18} /> },
];

const AdminPage = ({ isDark, setIsDark }: AdminPageProps) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const hasSystemConfig =
    user?.roles?.includes("SYSTEM_CONFIG") ||
    user?.roles?.includes("ROLE_SUPERADMIN");

  const filteredTabs = TABS.filter((tab) => {
    if (tab.id === "LOGS" || tab.id === "DB" || tab.id === "DATA_TELEMETRY") {
      return !!hasSystemConfig;
    }
    return true;
  }).map(tab => {
    let label = tab.label;
    if (tab.id === "USERS") label = t("userAccessControl");
    if (tab.id === "ROLES") label = t("rolePermissions");
    if (tab.id === "CUSTOM_FIELDS") label = t("customFieldBuilder", { defaultValue: "No-Code Field Builder" });
    if (tab.id === "DYNAMIC_ENTITIES") label = t("dynamicEntityBuilder", { defaultValue: "Dynamic Entity Builder" });
    if (tab.id === "TRANSLATIONS") label = t("i18nTranslations", { defaultValue: "i18n Database Translations" });
    if (tab.id === "DATA_TELEMETRY") label = t("telemetryDataClean", { defaultValue: "Telemetry & Data Clean" });
    if (tab.id === "LOGS") label = t("userLogRecorder");
    if (tab.id === "DB") label = t("switchDatabase");
    return { ...tab, label };
  });

  const [activeTab, setActiveTab] = useState(filteredTabs[0]?.id || "USERS");

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Animated Custom Tabs Navigation */}
        <div>
          <ModernTabs
            tabs={filteredTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Tab Content with Framer Motion Animation */}
        <div className="mt-8 w-full relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === "USERS" && <UserManagement />}
              {activeTab === "ROLES" && <RoleManagement />}
              {activeTab === "CUSTOM_FIELDS" && <CustomFieldBuilder />}
              {activeTab === "DYNAMIC_ENTITIES" && <DynamicEntityBuilder />}
              {activeTab === "TRANSLATIONS" && <TranslationManagementTab />}
              {activeTab === "DATA_TELEMETRY" && <TelemetryAndDataCleanTab />}
              {activeTab === "LOGS" && <UserLogRecorder />}
              {activeTab === "DB" && <SwitchDatabase />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
