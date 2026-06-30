"use client";
import ReportsPage from "@/views/ReportsPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <ReportsPage isDark={isDark} setIsDark={setIsDark} />;
}
