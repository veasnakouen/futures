"use client";
import React from "react";
import Layout from "./Layout";
import { useTheme } from "../../contexts/ThemeContext";

export default function PageLayoutWrapper({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={title}>
      {children}
    </Layout>
  );
}
