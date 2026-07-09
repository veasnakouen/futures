"use client";

import React from "react";
import DepartmentManagement from "@/features/school/components/DepartmentManagement";
import { useTheme } from "@/contexts/ThemeContext";

export default function DepartmentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <>
      <div className="p-6">
        <DepartmentManagement />
      </div>
    </>
  );
}
