"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import PrescriptionList from "../../../../features/clinic/components/PrescriptionList";

export default function PrescriptionsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Prescriptions">
      <PrescriptionList />
    </Layout>
  );
}
