"use client";
import LogbookPage from "@/views/LogbookPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <LogbookPage isDark={isDark} setIsDark={setIsDark} />;
}
