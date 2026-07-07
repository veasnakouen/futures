"use client";

import React from "react";
import DepartmentManagement from "@/features/school/components/DepartmentManagement";
import Layout from "@/components/common/Layout";
import { useTheme } from "@/contexts/ThemeContext";

export default function DepartmentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Departments">
      <div className="p-6">
        <DepartmentManagement />
      </div>
    </Layout>
  );
}
