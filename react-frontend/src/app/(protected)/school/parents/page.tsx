"use client";
import React from "react";
import ParentList from "../../../../features/school/components/ParentList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function ParentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Parents">
      <ParentList />
    </Layout>
  );
}
