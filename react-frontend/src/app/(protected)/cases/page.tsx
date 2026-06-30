"use client";
import CasesPage from "@/views/CasesPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <CasesPage isDark={isDark} setIsDark={setIsDark} />;
}
