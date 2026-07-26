"use client";
import PlacementsPage from "@/views/PlacementsPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  return <PlacementsPage isDark={isDark} setIsDark={setIsDark} />;
}
