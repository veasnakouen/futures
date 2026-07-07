"use client";
import ClientsPage from "@/views/ClientsPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");
  
  return <ClientsPage isDark={isDark} setIsDark={setIsDark} />;
}
