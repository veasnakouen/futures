"use client";

import ClientProfilePage from "@/views/ClientProfilePage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <ClientProfilePage isDark={isDark} setIsDark={setIsDark} />;
}
