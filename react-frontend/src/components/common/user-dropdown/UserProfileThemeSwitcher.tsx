import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

interface UserProfileThemeSwitcherProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export const UserProfileThemeSwitcher: React.FC<UserProfileThemeSwitcherProps> = ({
  theme,
  setTheme,
}) => {
  return (
    <div className="pt-2">
      <p className="px-3.5 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
        Theme Workspace
      </p>
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl">
        <button
          onClick={() => setTheme("light")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${theme === "light"
            ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
          <Sun size={14} className="mb-1" />
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${theme === "dark"
            ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
          <Moon size={14} className="mb-1" />
          Dark
        </button>
        <button
          onClick={() => setTheme("antigravity")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${theme === "antigravity"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
          <Sparkles size={14} className="mb-1" />
          Cyber
        </button>
      </div>
    </div>
  );
};

export default UserProfileThemeSwitcher;
