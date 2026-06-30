"use client";
import RecruitmentPage from "@/views/RecruitmentPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <RecruitmentPage isDark={isDark} setIsDark={setIsDark} />;
}
