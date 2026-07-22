import React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export const UserProfileLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "km", label: "KM" },
  ];

  return (
    <div className="pt-2">
      <p className="px-3.5 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
        <Languages size={12} /> Language / ភាសា
      </p>
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl">
        {languages.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`py-1.5 rounded-xl text-[10px] font-black transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserProfileLanguageSwitcher;
