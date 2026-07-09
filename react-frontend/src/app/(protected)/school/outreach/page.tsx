"use client";

import React from "react";
import OutreachDashboard from "@/features/school/components/OutreachDashboard";
import Layout from "@/components/common/Layout";
import { useTheme } from "@/contexts/ThemeContext";

export default function OutreachPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <>
      <div className="p-6">
        <OutreachDashboard />
      </div>
    </>
  );
}
