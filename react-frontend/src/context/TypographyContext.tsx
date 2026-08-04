import React, { createContext, useContext, useState, useEffect } from "react";

export type FontOption = "Inter" | "Outfit" | "Plus Jakarta Sans" | "Roboto" | "Poppins" | "Space Grotesk" | "Playfair Display" | "System";
export type FontSizeScale = "compact" | "standard" | "comfortable" | "large";
export type LetterSpacingOption = "tight" | "normal" | "wide";

export interface TypographyConfig {
  bodyFont: FontOption;
  headingFont: FontOption;
  fontSizeScale: FontSizeScale;
  letterSpacing: LetterSpacingOption;
}

const DEFAULT_CONFIG: TypographyConfig = {
  bodyFont: "Inter",
  headingFont: "Inter",
  fontSizeScale: "standard",
  letterSpacing: "normal",
};

interface TypographyContextType {
  config: TypographyConfig;
  updateConfig: (newConfig: Partial<TypographyConfig>) => void;
  resetConfig: () => void;
  fontOptions: FontOption[];
  headingFontOptions: FontOption[];
}

const TypographyContext = createContext<TypographyContextType | undefined>(undefined);

const FONT_MAP: Record<FontOption, string> = {
  Inter: "'Inter', sans-serif",
  Outfit: "'Outfit', sans-serif",
  "Plus Jakarta Sans": "'Plus Jakarta Sans', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Poppins: "'Poppins', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  System: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const GOOGLE_FONT_URLS: Record<string, string> = {
  Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  Outfit: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap",
  "Plus Jakarta Sans": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
  Roboto: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap",
  Poppins: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap",
  "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap",
};

const SIZE_SCALE_MAP: Record<FontSizeScale, string> = {
  compact: "14px",
  standard: "16px",
  comfortable: "18px",
  large: "20px",
};

const SPACING_MAP: Record<LetterSpacingOption, string> = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
};

const STORAGE_KEY = "mtp_typography_config";

export const TypographyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TypographyConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch {
          // ignore error
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    // Inject Google Font stylesheets into head dynamically
    const fontsToLoad = new Set<string>();
    if (GOOGLE_FONT_URLS[config.bodyFont]) fontsToLoad.add(config.bodyFont);
    if (GOOGLE_FONT_URLS[config.headingFont]) fontsToLoad.add(config.headingFont);

    fontsToLoad.forEach((fontName) => {
      const id = `google-font-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = GOOGLE_FONT_URLS[fontName];
        document.head.appendChild(link);
      }
    });

    // Inject Root CSS variables
    const root = document.documentElement;
    root.style.setProperty("--font-body-family", FONT_MAP[config.bodyFont] || FONT_MAP.Inter);
    root.style.setProperty("--font-heading-family", FONT_MAP[config.headingFont] || FONT_MAP.Inter);
    root.style.setProperty("--font-base-size", SIZE_SCALE_MAP[config.fontSizeScale] || "16px");
    root.style.setProperty("--font-letter-spacing", SPACING_MAP[config.letterSpacing] || "0em");

    // Apply font family class directly to body
    document.body.style.fontFamily = FONT_MAP[config.bodyFont] || FONT_MAP.Inter;

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<TypographyConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const fontOptions: FontOption[] = ["Inter", "Outfit", "Plus Jakarta Sans", "Roboto", "Poppins", "System"];
  const headingFontOptions: FontOption[] = ["Inter", "Outfit", "Plus Jakarta Sans", "Space Grotesk", "Playfair Display", "Poppins"];

  return (
    <TypographyContext.Provider value={{ config, updateConfig, resetConfig, fontOptions, headingFontOptions }}>
      {children}
    </TypographyContext.Provider>
  );
};

export const useTypography = () => {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error("useTypography must be used within a TypographyProvider");
  }
  return context;
};
