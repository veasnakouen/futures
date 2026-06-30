"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import LabOrderList from "../../../../features/clinic/components/LabOrderList";

export default function LabOrdersPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Lab Orders">
      <LabOrderList />
    </Layout>
  );
}
