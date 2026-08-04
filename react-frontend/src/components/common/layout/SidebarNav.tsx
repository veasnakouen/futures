import React from "react";
import { Link } from "@/lib/react-router-compat";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { NavSection } from "./navConfig";

interface SidebarNavProps {
  navSections: NavSection[];
  isSidebarCollapsed: boolean;
  expandedSections: Record<string, boolean>;
  toggleSection: (title: string) => void;
  isActive: (path: string) => boolean;
  setIsMenuOpen: (open: boolean) => void;
  sidebarRef: React.RefObject<HTMLElement | null>;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  navSections,
  isSidebarCollapsed,
  expandedSections,
  toggleSection,
  isActive,
  setIsMenuOpen,
  sidebarRef,
}) => {
  return (
    <nav
      ref={sidebarRef as any}
      className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar"
    >
      {navSections.map((section) => {
        const isExpanded = expandedSections[section.title] !== false; // Default to expanded
        return (
          <div key={section.title} className="space-y-1 mb-2">
            {!isSidebarCollapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 mb-1 mt-5 group outline-none cursor-pointer"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400/70 dark:text-white/25 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {section.title}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-gray-400/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-transform duration-300 ${
                    !isExpanded ? "-rotate-90" : ""
                  }`}
                />
              </button>
            )}
            {isSidebarCollapsed && <div className="h-4"></div>}

            <div
              className={`space-y-1 overflow-hidden transition-all duration-300 ${
                !isExpanded && !isSidebarCollapsed
                  ? "max-h-0 opacity-0"
                  : "max-h-[1000px] opacity-100"
              }`}
            >
              {section.links.map((link) => {
                const active = isActive(link.to);
                return (
                  <div key={link.to} className="flex flex-col">
                    <Link
                      to={link.to}
                      title={isSidebarCollapsed ? link.label : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`relative flex items-center ${
                        isSidebarCollapsed ? "justify-center p-3" : "px-3 py-2"
                      } rounded-xl transition-all duration-200 group ${
                        active
                          ? "font-bold shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-sidebar-item"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/30 dark:to-violet-500/30 shadow-inner"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 35,
                          }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-3">
                        <link.icon
                          size={isSidebarCollapsed ? 20 : 16}
                          className={
                            active
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"
                          }
                        />
                        {!isSidebarCollapsed && (
                          <span
                            className={`text-[11.5px] font-semibold tracking-tight ${
                              active
                                ? "text-indigo-700 dark:text-indigo-300 font-extrabold"
                                : "transition-colors"
                            }`}
                          >
                            {link.label}
                          </span>
                        )}
                      </div>
                    </Link>
                    {link.subLinks && !isSidebarCollapsed && (
                      <div className="ml-10 mt-1 flex flex-col space-y-1">
                        {link.subLinks.map((subLink: any) => (
                          <Link
                            key={subLink.to}
                            to={subLink.to}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 py-1"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
