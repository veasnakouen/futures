"use client";
import LeaveManagementPage from "@/views/LeaveManagementPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <LeaveManagementPage isDark={isDark} setIsDark={setIsDark} />;
}
