"use client";
import PayrollPage from "@/views/PayrollPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  return <PayrollPage isDark={isDark} setIsDark={setIsDark} />;
}
