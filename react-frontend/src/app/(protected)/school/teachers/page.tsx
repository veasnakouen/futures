"use client";
import React from "react";
import TeacherList from "../../../../features/school/components/TeacherList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function TeachersPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Teachers">
      <TeacherList />
    </Layout>
  );
}
