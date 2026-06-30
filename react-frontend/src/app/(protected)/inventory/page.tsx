"use client";
import InventoryPage from "@/views/InventoryPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <InventoryPage isDark={isDark} setIsDark={setIsDark} />;
}
