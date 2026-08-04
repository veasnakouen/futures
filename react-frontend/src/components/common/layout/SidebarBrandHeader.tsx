import React from "react";
import { Shield, LogOut } from "lucide-react";

interface SidebarBrandHeaderProps {
  isSidebarCollapsed: boolean;
  sidebarTheme: string;
  sidebarPosition: string;
  appLogo: string | null;
  setIsMenuOpen: (open: boolean) => void;
}

export const SidebarBrandHeader: React.FC<SidebarBrandHeaderProps> = ({
  isSidebarCollapsed,
  sidebarTheme,
  sidebarPosition,
  appLogo,
  setIsMenuOpen,
}) => {
  return (
    <div
      className={`px-5 py-4 flex items-center ${
        isSidebarCollapsed ? "justify-center" : "justify-between"
      } border-b border-gray-100 dark:border-gray-800/60 mb-2`}
    >
      {!isSidebarCollapsed && (
        <div className="flex items-center gap-3.5 group cursor-pointer select-none">
          {/* Premium Glassmorphic Squircle App Icon Container */}
          <div className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.35)] group-hover:shadow-[0_6px_25px_-2px_rgba(99,102,241,0.55)] transition-all duration-300 transform group-hover:scale-105">
            <div className="w-11 h-11 rounded-[14px] bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden p-0.5 relative group/img">
              {appLogo ? (
                <img
                  src={appLogo}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-[12px] transition-transform duration-500 group-hover/img:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-[12px] flex items-center justify-center text-white">
                  <Shield size={22} className="drop-shadow-md" />
                </div>
              )}
              {/* Subtle Light Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[14px]" />
            </div>
            {/* Live Online Status Dot with Ambient Pulse */}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950 shadow-sm" />
            </div>
          </div>

          {/* Brand Typography & Badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-xl tracking-tight leading-none ${
                  sidebarTheme === "brand"
                    ? "text-white drop-shadow-sm"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300"
                }`}
              >
                MTP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
                PRO
              </span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400 leading-none mt-1 flex items-center gap-1.5">
              PLATFORM{" "}
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />{" "}
              ECOSYSTEM
            </span>
          </div>
        </div>
      )}

      {isSidebarCollapsed && (
        <div
          className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_25px_-2px_rgba(99,102,241,0.55)] hover:scale-110 transition-all duration-300 cursor-pointer"
          title="MTP System"
        >
          <div className="w-11 h-11 rounded-[14px] bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden p-0.5">
            {appLogo ? (
              <img
                src={appLogo}
                alt="Logo"
                className="w-full h-full object-cover rounded-[12px]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-[12px] flex items-center justify-center text-white">
                <Shield size={22} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950 shadow-sm" />
          </div>
        </div>
      )}

      <button
        className={`lg:hidden ${
          sidebarTheme === "brand" ? "text-white" : "dark:text-white"
        } ${isSidebarCollapsed ? "hidden" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <LogOut
          size={20}
          className={sidebarPosition === "right" ? "" : "rotate-180"}
        />
      </button>
    </div>
  );
};

export default SidebarBrandHeader;
