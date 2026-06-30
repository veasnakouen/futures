"use client";
import SupportPage from "@/views/SupportPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <SupportPage isDark={isDark} setIsDark={setIsDark} />;
}
