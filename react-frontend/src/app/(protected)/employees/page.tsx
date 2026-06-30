"use client";
import EmployeesPage from "@/views/EmployeesPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <EmployeesPage isDark={isDark} setIsDark={setIsDark} />;
}
