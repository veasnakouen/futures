"use client";

import CVPage from "@/views/CVPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <CVPage isDark={isDark} setIsDark={setIsDark} />;
}
