"use client";

import LocationManagement from "@/features/admin/components/LocationManagement";
import Layout from "@/components/common/Layout";
import { useTheme } from "@/contexts/ThemeContext";

export default function LocationSettingsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Location Management">
      <LocationManagement />
    </Layout>
  );
}
