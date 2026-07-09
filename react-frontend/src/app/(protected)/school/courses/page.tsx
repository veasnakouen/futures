"use client";
import React from "react";
import CourseList from "../../../../features/school/components/CourseList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function CoursesPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return (
    <>
      <CourseList />
    </>
  );
}
