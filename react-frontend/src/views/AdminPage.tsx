import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import UserManagement from "@/features/admin/components/UserManagement";
import RoleManagement from "@/features/admin/components/RoleManagement";
import UserLogRecorder from "@/features/admin/components/UserLogRecorder";
import SwitchDatabase from "@/features/admin/components/SwitchDatabase";
import ModernTabs from "@/components/common/ModernTabs";
import { ShieldCheck, Logs, ShieldUser, DatabaseBackup } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";

interface AdminPageProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

const TABS = [
  { id: "USERS", label: "User Access Control", icon: <ShieldUser size={18} /> },
  { id: "ROLES", label: "Role Permissions", icon: <ShieldCheck size={18} /> },
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
    if (tab.id === "LOGS" || tab.id === "DB") {
      return !!hasSystemConfig;
    }
    return true;
  }).map(tab => {
    let label = tab.label;
    if (tab.id === "USERS") label = t("userAccessControl");
    if (tab.id === "ROLES") label = t("rolePermissions");
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
