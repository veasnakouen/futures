"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import kmTranslation from "./locales/km.json";
import api from "@/services/api";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: { escapeValue: false },
    parseMissingKeyHandler: (key) => {
      if (!key) return "";
      // Convert camelCase, snake_case, dot.notation, or slash/hyphen notation to readable words
      const readable = key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_\.-]/g, " ")
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

// Dynamic Database Sync: Fetch remote translations from database API and merge live
export const syncDatabaseTranslations = async () => {
  try {
    const res = await api.get("/translations");
    if (res.data && typeof res.data === "object") {
      Object.keys(res.data).forEach((lang) => {
        const remoteBundle = res.data[lang];
        if (remoteBundle && Object.keys(remoteBundle).length > 0) {
          i18n.addResourceBundle(lang, "translation", remoteBundle, true, true);
        }
      });
      console.log("[i18n] Synchronized dynamic translations from database");
    }
  } catch (err) {
    console.warn("[i18n] Operating in local bundle mode (database translation service initializing or offline)");
  }
};

// Trigger background database translation sync on client side initialization
if (typeof window !== "undefined") {
  setTimeout(() => {
    syncDatabaseTranslations();
  }, 1000);
}

export default i18n;
