"use client";
import React from "react";
import StudentList from "../../../../features/school/components/StudentList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function StudentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Students">
      <StudentList />
    </Layout>
  );
}
