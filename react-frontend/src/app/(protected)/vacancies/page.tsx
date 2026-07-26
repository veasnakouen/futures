"use client";
import VacanciesPage from "@/views/VacanciesPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  return <VacanciesPage isDark={isDark} setIsDark={setIsDark} />;
}
