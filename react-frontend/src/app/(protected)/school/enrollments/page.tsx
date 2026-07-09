"use client";
import React from "react";
import EnrollmentList from "../../../../features/school/components/EnrollmentList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function EnrollmentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <>
      <EnrollmentList />
    </>
  );
}
