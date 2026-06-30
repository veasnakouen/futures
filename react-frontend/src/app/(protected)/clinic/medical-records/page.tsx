"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import MedicalRecordList from "../../../../features/clinic/components/MedicalRecordList";

export default function MedicalRecordsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Medical Records">
      <MedicalRecordList />
    </Layout>
  );
}
