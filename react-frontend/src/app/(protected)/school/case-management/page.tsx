"use client";

import React from "react";
import CaseManagementDashboard from "@/features/school/components/CaseManagementDashboard";
import Layout from "@/components/common/Layout";
import { useTheme } from "@/contexts/ThemeContext";

export default function CaseManagementPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Case Management">
      <div className="p-6">
        <CaseManagementDashboard />
      </div>
    </Layout>
  );
}
