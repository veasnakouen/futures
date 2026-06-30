"use client";
import ChatPage from "@/views/ChatPage";
import { useTheme } from "@/contexts/ThemeContext";
export default function Page() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark) => setTheme(dark ? "dark" : "light");
  return <ChatPage isDark={isDark} setIsDark={setIsDark} />;
}
