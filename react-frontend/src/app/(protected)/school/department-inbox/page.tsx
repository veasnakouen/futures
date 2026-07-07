"use client";

import React from "react";
import DepartmentInbox from "@/features/school/components/DepartmentInbox";
import Layout from "@/components/common/Layout";
import { useTheme } from "@/contexts/ThemeContext";

export default function DepartmentInboxPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Department Inbox">
      <div className="p-6">
        <DepartmentInbox />
      </div>
    </Layout>
  );
}
