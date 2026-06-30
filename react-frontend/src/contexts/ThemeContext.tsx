import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark" | "antigravity";
export type SidebarPosition = "left" | "right";
export type UITheme = "default" | "dark" | "brand";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;

  sidebarPosition: SidebarPosition;
  setSidebarPosition: (pos: SidebarPosition) => void;

  sidebarTheme: UITheme;
  setSidebarTheme: (theme: UITheme) => void;

  topbarTheme: UITheme;
  setTopbarTheme: (theme: UITheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (window.localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(() => {
    if (typeof window !== "undefined") {
      return (window.localStorage.getItem("sidebarPosition") as SidebarPosition) || "left";
    }
    return "left";
  });

  const [sidebarTheme, setSidebarTheme] = useState<UITheme>(() => {
    if (typeof window !== "undefined") {
      return (window.localStorage.getItem("sidebarTheme") as UITheme) || "default";
    }
    return "default";
  });

  const [topbarTheme, setTopbarTheme] = useState<UITheme>(() => {
    if (typeof window !== "undefined") {
      return (window.localStorage.getItem("topbarTheme") as UITheme) || "default";
    }
    return "default";
  });

  const isDark = theme !== "light";

  useEffect(() => {
    const root = document.documentElement;

    // Handle Tailwind dark mode class
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Handle Antigravity specific theme variables
    if (theme === "antigravity") {
      root.setAttribute("data-theme", "antigravity");
    } else {
      root.removeAttribute("data-theme");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
      window.localStorage.setItem("sidebarPosition", sidebarPosition);
      window.localStorage.setItem("sidebarTheme", sidebarTheme);
      window.localStorage.setItem("topbarTheme", topbarTheme);
    }
  }, [theme, isDark, sidebarPosition, sidebarTheme, topbarTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        sidebarPosition,
        setSidebarPosition,
        sidebarTheme,
        setSidebarTheme,
        topbarTheme,
        setTopbarTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
