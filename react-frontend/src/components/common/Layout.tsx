"use client";
import React from "react";
import { useLocation, useNavigate } from "@/lib/react-router-compat";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import authService from "../../services/authService";
import Chat from "../../features/chat/components/Chat";
import NetworkDrawer from "./NetworkDrawer";
import UserProfileDropdown from "./UserProfileDropdown";
import { useTheme } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAuthStore } from "../../store/authStore";
import api from "../../services/api";
import { getNavSections } from "./layout/navConfig";
import SidebarBrandHeader from "./layout/SidebarBrandHeader";
import SidebarNav from "./layout/SidebarNav";
import NotificationDropdownMenu from "./layout/NotificationDropdownMenu";

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, sidebarPosition, sidebarTheme, topbarTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    return (
      (typeof window !== "undefined"
        ? window.localStorage
        : { getItem: () => null, setItem: () => { }, removeItem: () => { } }
      ).getItem("isSidebarCollapsed") === "true"
    );
  });
  const { user, updateUser } = useAuthStore();
  const sidebarRef = React.useRef<HTMLElement>(null);
  const [appLogo, setAppLogo] = React.useState<string | null>(null);

  const [expandedSections, setExpandedSections] = React.useState<
    Record<string, boolean>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("expandedSections");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse expandedSections from localStorage", e);
      }
    }
    return {};
  });

  const isAdmin =
    Array.isArray(user?.roles) &&
    user.roles.some((role: any) => {
      const roleName = (
        typeof role === "string" ? role : role?.name || ""
      ).toUpperCase();
      return roleName.includes("ADMIN");
    });

  const navSections = React.useMemo(() => getNavSections(t, isAdmin), [t, isAdmin]);

  // Auto-expand sidebar section matching active route on page load & navigation
  React.useEffect(() => {
    if (!location?.pathname) return;
    const currentPath = location.pathname;
    const activeSection = navSections.find((section) =>
      section.links.some((link) => currentPath.startsWith(link.to))
    );
    if (activeSection) {
      setExpandedSections((prev) => {
        if (prev[activeSection.title] === false || prev[activeSection.title] === undefined) {
          const next = { ...prev, [activeSection.title]: true };
          if (typeof window !== "undefined") {
            window.localStorage.setItem("expandedSections", JSON.stringify(next));
          }
          return next;
        }
        return prev;
      });
    }
  }, [location?.pathname, navSections]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[title] !== false;
      const next = {
        ...prev,
        [title]: !isCurrentlyExpanded,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("expandedSections", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      (
        typeof window !== "undefined"
          ? window.localStorage
          : { getItem: () => null, setItem: () => { }, removeItem: () => { } }
      ).setItem("isSidebarCollapsed", String(next));
      return next;
    });
  };

  const loadAppLogo = () => {
    api
      .get("/settings/APP_LOGO")
      .then((res) => {
        setAppLogo(res.data.value);
      })
      .catch(() => setAppLogo(null));
  };

  React.useEffect(() => {
    loadAppLogo();
    window.addEventListener("appLogoChanged", loadAppLogo);
    return () => window.removeEventListener("appLogoChanged", loadAppLogo);
  }, []);

  React.useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebarScrollPos");
    if (sidebarRef.current && savedScroll) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }

    const handleScroll = () => {
      if (sidebarRef.current) {
        sessionStorage.setItem(
          "sidebarScrollPos",
          sidebarRef.current.scrollTop.toString()
        );
      }
    };

    const el = sidebarRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      api
        .get("/users/me")
        .then((res) => {
          const profile = res.data?.data || res.data;
          if (profile) {
            const photo = profile.photo || profile.avatarUrl || profile.picture;
            updateUser({
              photo: photo || user.photo,
              avatarUrl: photo || user.avatarUrl,
              firstName: profile.firstName || user.firstName,
              lastName: profile.lastName || user.lastName,
              fullName: profile.fullName || user.fullName,
              email: profile.email || user.email,
            });
          }
        })
        .catch((err) => {
          if (err?.response?.status !== 503) {
            console.warn("Failed to fetch user profile:", err.message);
          }
        });
    }
  }, []);

  const isActive = (path: string) => {
    if (path.includes("?")) {
      const [pathname, search] = path.split("?");
      return (
        location.pathname.startsWith(pathname) &&
        location.search.includes(search)
      );
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getSidebarBgClass = () => {
    if (sidebarTheme === "dark")
      return "bg-gray-950 border-gray-800/60 text-gray-300";
    if (sidebarTheme === "brand")
      return "bg-gradient-to-b from-indigo-950 to-violet-950 border-indigo-800/50 text-indigo-100";
    return "bg-white/95 dark:bg-[#0d1117] border-gray-200/80 dark:border-white/[0.04]";
  };

  const getTopbarBgClass = () => {
    if (topbarTheme === "dark")
      return "bg-gray-950/95 border-gray-800/60 text-white shadow-lg shadow-black/10";
    if (topbarTheme === "brand")
      return "bg-gradient-to-r from-indigo-950/95 to-violet-950/95 border-indigo-800/50 text-white shadow-lg";
    return "bg-white/85 dark:bg-[#0d1117]/90 border-gray-200/80 dark:border-white/[0.04] shadow-sm dark:shadow-black/20";
  };

  return (
    <div
      className={`flex h-screen bg-[#f4f5f9] dark:bg-[#080c14] transition-colors overflow-hidden ${sidebarPosition === "right" ? "flex-row-reverse" : ""
        }`}
    >
      {/* Mobile Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 ${sidebarPosition === "right" ? "right-0 border-l" : "left-0 border-r"
          } z-40 ${getSidebarBgClass()} transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMenuOpen
            ? "translate-x-0"
            : sidebarPosition === "right"
              ? "translate-x-full"
              : "-translate-x-full"
          } ${isSidebarCollapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        <SidebarBrandHeader
          isSidebarCollapsed={isSidebarCollapsed}
          sidebarTheme={sidebarTheme}
          sidebarPosition={sidebarPosition}
          appLogo={appLogo}
          setIsMenuOpen={setIsMenuOpen}
        />

        <SidebarNav
          navSections={navSections}
          isSidebarCollapsed={isSidebarCollapsed}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          isActive={isActive}
          setIsMenuOpen={setIsMenuOpen}
          sidebarRef={sidebarRef}
        />

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-gray-100 dark:border-white/[0.04] flex flex-col gap-2 shrink-0">
          <button
            onClick={toggleSidebar}
            className={`flex items-center hover:bg-indigo-50 dark:hover:bg-white/[0.04] rounded-xl transition-all text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 ${isSidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
              }`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="text-[11px] font-semibold">Collapse</span>
              </>
            )}
          </button>
          <div
            className={`flex items-center ${isSidebarCollapsed ? "justify-center p-2" : "gap-2.5 px-3 py-2"
              } bg-emerald-50/60 dark:bg-emerald-500/[0.06] rounded-xl border border-emerald-200/60 dark:border-emerald-500/10`}
            title={isSidebarCollapsed ? "System Operational" : undefined}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate">
                All Systems Go
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header
          className={`h-14 backdrop-blur-xl border-b flex items-center justify-between px-4 lg:px-6 z-20 transition-all ${getTopbarBgClass()}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              <LayoutDashboard size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/[0.05] rounded-xl transition-all relative"
              title="My Network"
            >
              <Users size={18} />
            </button>

            <NotificationDropdownMenu
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
            />

            <UserProfileDropdown
              user={user}
              theme={isDark ? "dark" : "light"}
              setTheme={() => { }}
              handleLogout={handleLogout}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f4f5f9] dark:bg-[#080c14] p-4 lg:p-6">
          {children}
        </div>

        <Chat />
        <NetworkDrawer
          isOpen={isNetworkOpen}
          onClose={() => setIsNetworkOpen(false)}
        />
      </main>
    </div>
  );
};

export default Layout;
