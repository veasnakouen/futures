import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "@/lib/react-router-compat";
import { getFaceFocusedUrl } from "@/utils/cloudinary";

import UserProfileHeaderCard from "./user-dropdown/UserProfileHeaderCard";
import UserProfileThemeSwitcher from "./user-dropdown/UserProfileThemeSwitcher";
import UserProfileLanguageSwitcher from "./user-dropdown/UserProfileLanguageSwitcher";

interface UserProfileDropdownProps {
  user: any;
  theme: string;
  setTheme: (theme: string) => void;
  handleLogout: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  theme,
  setTheme,
  handleLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userRole = Array.isArray(user?.roles) && user.roles.some((r: any) =>
    (typeof r === "string" ? r : r?.name || "").toUpperCase().includes("SUPERADMIN")
  )
    ? "Super Admin"
    : Array.isArray(user?.roles) && user.roles.some((r: any) =>
        (typeof r === "string" ? r : r?.name || "").toUpperCase().includes("ADMIN")
      )
    ? "Administrator"
    : "Standard User";

  const photoUrl = user?.photo
    ? getFaceFocusedUrl(user.photo, 120)
    : user?.avatarUrl || user?.picture || null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group focus:outline-none cursor-pointer"
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={user?.username || "Avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-black text-xs bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase">
                  {(user?.username || user?.email || "AD").slice(0, 2)}
                </span>
              )}
            </div>
          </div>
          {/* Active Status Pulse Dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          </span>
        </div>

        <div className="text-left hidden md:block">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-tight">
            {userRole}
          </p>
          <p className="text-xs font-black dark:text-white text-gray-900 leading-tight truncate max-w-[130px]">
            {user?.username || user?.email || "Admin User"}
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-300 ml-0.5 ${
            isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="absolute right-0 mt-3 w-80 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-slate-900/15 z-[100] ring-1 ring-black/5 dark:ring-white/10"
          >
            {/* Top Pointer Triangle Notch */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-blue-50/80 dark:bg-slate-900/90 rotate-45 border-t border-l border-gray-200 dark:border-gray-700 z-20" />

            {/* Main Inner Wrapper */}
            <div className="overflow-hidden rounded-3xl relative z-10 bg-white dark:bg-gray-900">
              {/* Header User Card */}
              <UserProfileHeaderCard
                user={user}
                userRole={userRole}
                photoUrl={photoUrl}
              />

              {/* Menu Items */}
              <div className="p-3 space-y-1">
                {/* Profile Settings */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <User size={16} />
                  </div>
                  <span>Profile Settings & Security</span>
                </button>

                {/* Theme Selector */}
                <UserProfileThemeSwitcher theme={theme} setTheme={setTheme} />

                {/* Language Switcher */}
                <UserProfileLanguageSwitcher />

                {/* Divider */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 my-1" />

                {/* Logout Session */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-200">
                    <LogOut size={16} />
                  </div>
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
