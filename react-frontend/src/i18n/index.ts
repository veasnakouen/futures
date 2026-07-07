"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import kmTranslation from "./locales/km.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: { escapeValue: false },
    parseMissingKeyHandler: (key) => {
      if (!key) return "";
      // Convert camelCase, snake_case, or dot.notation to normal readable words
      const readable = key
        .replace(/([A-Z])/g, " $1") // Add space before uppercase (camelCase)
        .replace(/[_\.-]/g, " ") // Replace separators with space
        .trim();
      
      // Capitalize first letter of each word
      return readable
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      km: {
        translation: kmTranslation,
      },
    },
  });

export default i18n;
