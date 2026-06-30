"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import HousekeepingTaskList from "../../../../features/hotel/components/HousekeepingTaskList";

export default function HousekeepingTasksPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Housekeeping">
      <HousekeepingTaskList />
    </Layout>
  );
}
