"use client";
import React from "react";
import ExtracurricularList from "../../../../features/school/components/ExtracurricularList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function ExtracurricularsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Extracurricular Activities">
      <ExtracurricularList />
    </Layout>
  );
}
