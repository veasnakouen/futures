"use client";
import SettingsPage from "@/views/SettingsPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <SettingsPage isDark={isDark} setIsDark={setIsDark} />;
}
