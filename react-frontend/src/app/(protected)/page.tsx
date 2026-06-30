"use client";
import DashboardPage from "@/views/DashboardPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <DashboardPage isDark={isDark} setIsDark={setIsDark} />;
}
