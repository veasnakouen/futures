"use client";
import React from "react";
import { Link, useLocation, useNavigate } from '@/lib/react-router-compat';
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  Sun,
  Moon,
  LogOut,
  Shield,
  UserCircle,
  Bell,
  History,
  Briefcase,
  FolderKanban,
  Package,
  LifeBuoy,
  Building2,
  Languages,
  User,
  ChevronDown,
  DollarSign,
  MessageCircle,
  Inbox,
  Monitor,
  Menu,
  ChevronLeft,
  ChevronRight,
  Handshake,
  GraduationCap,
  BookOpen,
  Activity,
  Stethoscope,
  CreditCard,
  Receipt,
  Bed,
  MapPin,
} from "lucide-react";
import { Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from '@/lib/flowbite-compat';
import { useTranslation } from "react-i18next";
import authService from '../../services/authService';
import Chat from "../../features/chat/components/Chat";
import NetworkDrawer from "./NetworkDrawer";
import { motion } from "framer-motion";
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { getFaceFocusedUrl } from '../../utils/cloudinary';

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const {
    theme,
    setTheme,
    isDark,
    sidebarPosition,
    sidebarTheme,
    topbarTheme,
  } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    return (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("isSidebarCollapsed") === "true";
  });
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: prev[title] === false ? true : false }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("isSidebarCollapsed", String(next));
      return next;
    });
  };
  const { user, updateUser } = useAuthStore();
  const sidebarRef = React.useRef<HTMLElement>(null);
  const [appLogo, setAppLogo] = React.useState<string | null>(null);

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
          sidebarRef.current.scrollTop.toString(),
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
    if (user && !user.photo) {
      api
        .get("/users/me")
        .then((res) => {
          const photo = res.data.photo || res.data.avatarUrl;
          if (photo) {
            updateUser({ photo });
          }
        })
        .catch((err) => console.error("Failed to fetch user profile", err));
    }
  }, [user, updateUser]);

  const isActive = (path: string) => {
    if (path.includes("?")) {
      const [pathname, search] = path.split("?");
      return location.pathname.startsWith(pathname) && location.search.includes(search);
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
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

  const getSidebarLinkClass = (active: boolean) => {
    if (active) {
      if (sidebarTheme === "brand") return "bg-white/20 text-white font-bold shadow-sm rounded-md";
      if (sidebarTheme === "dark") return "bg-white/10 text-white font-bold shadow-sm rounded-md";
      return "bg-indigo-100/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm rounded-md";
    }
    if (sidebarTheme === "brand")
      return "text-indigo-200/80 hover:bg-white/10 hover:text-white rounded-md";
    if (sidebarTheme === "dark")
      return "text-gray-400 hover:bg-white/5 hover:text-white rounded-md";
    return "text-gray-500 dark:text-gray-400 hover:bg-indigo-50/80 dark:hover:bg-white/[0.04] hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md";
  };

  const navSections: {
    title: string;
    links: {
      to: string;
      icon: React.ElementType;
      label: string;
      subLinks?: { to: string; label: string }[];
    }[];
  }[] = [
      {
        title: t("operations"),
        links: [
          { to: "/", icon: LayoutDashboard, label: t("dashboard") },
          { to: "/cases", icon: FolderKanban, label: t("cases") },
          { to: "/logbook", icon: History, label: t("logbook") },
          { to: "/inventory", icon: Package, label: t("inventory") },
        ],
      },
      {
        title: t("recruitment"),
        links: [{ to: "/recruitment", icon: Handshake, label: t("recruitment") }],
      },
      {
        title: t("humanResources"),
        links: [
          { to: "/employees", icon: Users, label: t("Hr") },
          { to: "/leaves", icon: Briefcase, label: t("leaveManagement") },
        ],
      },
      {
        title: t("schoolManagement"),
        links: [
          { to: "/school/branches", icon: MapPin, label: t("branches") },
          { to: "/school/students", icon: Users, label: t("students") },
          { to: "/school/outreach", icon: MapPin, label: t("outreach") },
          { to: "/school/case-management", icon: Briefcase, label: t("caseManagement") },
          { to: "/school/departments", icon: Building2, label: t("departments") },
          { to: "/school/department-inbox", icon: Inbox, label: t("departmentInbox") },
          { to: "/school/teachers", icon: Briefcase, label: t("teachers") },
          { to: "/school/courses", icon: BookOpen, label: t("courses") },
          { to: "/school/enrollments", icon: GraduationCap, label: t("enrollments") },
          { to: "/school/parents", icon: Users, label: t("parents") },
          { to: "/school/extracurriculars", icon: Activity, label: t("activities") },
        ],
      },
      {
        title: t("clinicManagement"),
        links: [
          { to: "/clinic", icon: LayoutDashboard, label: t("dashboard") },
          { to: "/clinic/ipd", icon: Bed, label: "IPD Wards" },
          { to: "/clinic/patients", icon: Users, label: t("patients") },
          { to: "/clinic/appointments", icon: History, label: t("appointments") },
          { to: "/clinic/doctors", icon: Briefcase, label: t("doctors") },
          { to: "/clinic/prescriptions", icon: Stethoscope, label: t("prescriptions") },
          { to: "/clinic/lab-orders", icon: Activity, label: t("labOrders") },
          { to: "/clinic/medical-records", icon: BookOpen, label: t("medicalRecords") },
        ],
      },
      {
        title: t("billingAndFinance"),
        links: [
          { to: "/billing/invoices", icon: Receipt, label: t("invoices") },
          { to: "/billing/payments", icon: CreditCard, label: t("payments") },
        ],
      },
      {
        title: t("hospitalityAndHotel"),
        links: [
          { to: "/hotel/bookings", icon: History, label: t("bookings") },
          { to: "/hotel/guests", icon: Users, label: t("guests") },
          { to: "/hotel/rooms", icon: Bed, label: t("rooms") },
          { to: "/hotel/housekeeping", icon: Package, label: t("housekeeping") },
        ],
      },
      {
        title: t("retailAndPos"),
        links: [
          { to: "/pos", icon: Monitor, label: t("posTerminal") },
          { to: "/pos/products", icon: Package, label: t("products") },
          { to: "/pos/sales", icon: Receipt, label: t("salesHistory") },
        ],
      },
      {
        title: t("systemAndCore"),
        links: [
          { to: "/support", icon: LifeBuoy, label: t("supportPortal") },
          { to: "/reports", icon: FileBarChart, label: t("reports") },
          { to: "/chat", icon: MessageCircle, label: t("liveTeamChat") },
          { to: "/settings", icon: Settings, label: t("settings") },
          { to: "/settings/locations", icon: Building2, label: t("locationManagement") },
        ],
      },
    ];

  // Debugging user roles
  React.useEffect(() => {
    if (user) {
      console.log("Current User Roles:", user.roles);
    }
  }, [user]);

  const isAdmin =
    Array.isArray(user?.roles) &&
    user.roles.some((role: any) => {
      const roleName = (
        typeof role === "string" ? role : role?.name || ""
      ).toUpperCase();
      return roleName.includes("ADMIN");
    });

  if (isAdmin) {
    navSections[2].links.push({
      to: "/admin",
      icon: Shield,
      label: t("administration"),
    });
  }

  return (
    <div
      className={`flex h-screen bg-[#f4f5f9] dark:bg-[#080c14] transition-colors overflow-hidden ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}
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
        className={`fixed inset-y-0 ${sidebarPosition === "right" ? "right-0 border-l" : "left-0 border-r"} z-40 ${getSidebarBgClass()} transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMenuOpen ? "translate-x-0" : sidebarPosition === "right" ? "translate-x-full" : "-translate-x-full"} ${isSidebarCollapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        <div
          className={`p-6 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              {appLogo ? (
                <img
                  src={appLogo}
                  alt="Logo"
                  className="max-w-[36px] max-h-[36px] object-contain rounded-xl shadow-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              ) : (
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Shield size={18} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
              )}
              <div className="flex flex-col">
                <span
                  className={`font-extrabold text-base tracking-tight leading-none ${sidebarTheme === "brand" ? "text-white" : "dark:text-white text-gray-900"}`}
                >
                  MTP
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-400 leading-none mt-0.5">Platform</span>
              </div>
            </div>
          )}
          {isSidebarCollapsed &&
            (appLogo ? (
              <img
                src={appLogo}
                alt="Logo"
                className="max-w-[36px] max-h-[36px] object-contain rounded-lg shadow-sm"
                title="MTP System"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
                title="MTP System"
              >
                <Shield size={18} />
              </div>
            ))}
          <button
            className={`lg:hidden ${sidebarTheme === "brand" ? "text-white" : "dark:text-white"} ${isSidebarCollapsed ? "hidden" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <LogOut
              size={20}
              className={sidebarPosition === "right" ? "" : "rotate-180"}
            />
          </button>
        </div>

        <nav
          ref={sidebarRef}
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
                      className={`text-gray-400/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-transform duration-300 ${!isExpanded ? "-rotate-90" : ""
                        }`}
                    />
                  </button>
                )}
                {isSidebarCollapsed && <div className="h-4"></div>}

                <div className={`space-y-1 overflow-hidden transition-all duration-300 ${!isExpanded && !isSidebarCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}>
                  {section.links.map((link) => {
                    const active = isActive(link.to);
                    return (
                      <div key={link.to} className="flex flex-col">
                        <Link
                          to={link.to}
                          title={isSidebarCollapsed ? link.label : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          className={`relative flex items-center ${isSidebarCollapsed ? "justify-center p-3" : "px-3 py-2"} rounded-xl transition-all duration-200 group ${active ? "font-bold shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-white/[0.02]"}`}
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
                          <div className={`relative z-10 flex items-center gap-3`}>
                            <link.icon size={isSidebarCollapsed ? 20 : 16} className={active ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"} />
                            {!isSidebarCollapsed && (
                              <span className={`text-[11.5px] font-semibold tracking-tight ${active ? "text-indigo-700 dark:text-indigo-300 font-extrabold" : "transition-colors"}`}>
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

        <div className="p-4 border-t border-gray-100 dark:border-white/[0.04] flex flex-col gap-2 shrink-0">
          <button
            onClick={toggleSidebar}
            className={`flex items-center hover:bg-indigo-50 dark:hover:bg-white/[0.04] rounded-xl transition-all text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 ${isSidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"}`}
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
            className={`flex items-center ${isSidebarCollapsed ? "justify-center p-2" : "gap-2.5 px-3 py-2"} bg-emerald-50/60 dark:bg-emerald-500/[0.06] rounded-xl border border-emerald-200/60 dark:border-emerald-500/10`}
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
            {/* Title removed per user request */}
          </div>

          <div className="flex items-center gap-4">
            {/* Tenant switcher dropdown removed per user request */}
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/[0.05] rounded-xl transition-all relative"
              title="My Network"
            >
              <Users size={18} />
            </button>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div
                  className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/[0.05] rounded-xl transition-all relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 ? (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md ring-2 ring-white dark:ring-[#0d1117]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-white/[0.1] text-gray-500 dark:text-gray-400 text-[9px] font-bold shadow-md ring-2 ring-white dark:ring-[#0d1117]">
                      0
                    </span>
                  )}
                </div>
              }
            >
              <DropdownHeader className="px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Bell size={14} className="text-indigo-500" />
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {unreadCount} New
                    </span>
                  )}
                </div>
              </DropdownHeader>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar w-80">
                {notifications.length === 0 ? (
                  <div className="px-6 py-10 flex flex-col items-center justify-center text-center gap-4 bg-white dark:bg-[#0d1117] animate-fade-in-up">
                    <div className="relative group cursor-default">
                      <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full animate-ping [animation-duration:3s]" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center shadow-inner shadow-indigo-100 dark:shadow-indigo-900/20 transform transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500">
                        <Inbox size={26} strokeWidth={1.5} className="text-indigo-500 dark:text-indigo-400" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse [animation-delay:500ms] shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent uppercase tracking-[0.2em] mt-2">
                        All caught up!
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium px-4 leading-relaxed">
                        Your inbox is clear. New alerts will magically appear here when they arrive.
                      </p>
                    </div>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownItem
                      key={n.id}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                      className={`px-4 py-3 border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-indigo-50/50 dark:hover:bg-white/[0.04] transition-colors ${!n.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
                    >
                      <div className="flex gap-3 w-full">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-transparent"}`} />
                        <div className={`flex flex-col gap-1 w-full text-left ${!n.read ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity"}`}>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
                              {n.title}
                            </span>
                            <span className="text-[9px] font-bold text-indigo-500 shrink-0 uppercase tracking-wider">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </DropdownItem>
                  ))
                )}
              </div>
            </Dropdown>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center gap-2.5 p-1 pr-3 hover:bg-indigo-50 dark:hover:bg-white/[0.05] rounded-full cursor-pointer transition-all duration-300 group active:scale-95 border border-transparent hover:border-indigo-100 dark:hover:border-white/[0.05] hover:shadow-sm">
                  <div className="w-8 h-8 min-w-[2rem] min-h-[2rem] aspect-square rounded-full shrink-0 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-2 border-transparent group-hover:border-indigo-400 shadow-sm overflow-hidden transition-all duration-300 relative">
                    {user?.photo ? (
                      <img
                        src={getFaceFocusedUrl(user.photo, 80)}
                        className="object-cover w-full h-full rounded-full transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <UserCircle size={18} className="transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase leading-none mb-0.5 tracking-wider">
                      {Array.isArray(user?.roles) &&
                        user.roles.some((r: any) =>
                          (typeof r === "string" ? r : r?.name || "")
                            .toUpperCase()
                            .includes("SUPERADMIN"),
                        )
                        ? "Super Admin"
                        : Array.isArray(user?.roles) &&
                          user.roles.some((r: any) =>
                            (typeof r === "string" ? r : r?.name || "")
                              .toUpperCase()
                              .includes("ADMIN"),
                          )
                          ? "Administrator"
                          : "Standard User"}
                    </p>
                    <p className="text-[12px] font-bold dark:text-white text-gray-800 leading-none">
                      {user?.username || "Guest"}
                    </p>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform duration-300 ml-0.5 [[aria-expanded=true]_&]:rotate-180"
                  />
                </div>
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-black dark:text-white">
                  Logged in as
                </span>
                <span className="block truncate text-xs font-bold text-blue-600 dark:text-blue-400">
                  {user?.email || "admin@mtp.org"}
                </span>
              </DropdownHeader>

              <DropdownItem onClick={() => navigate("/settings")}>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Profile Settings</span>
                </div>
              </DropdownItem>

              {/* <DropdownDivider /> */}

              <DropdownDivider />
              <div className="px-4 py-2 text-xs font-black dark:text-gray-400 uppercase tracking-wider">
                Theme
              </div>
              <DropdownItem onClick={() => setTheme("light")}>
                <div
                  className={`flex items-center gap-2 ${theme === "light" ? "text-blue-600 font-bold" : ""}`}
                >
                  <Sun size={16} />
                  <span>Light Mode</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setTheme("dark")}>
                <div
                  className={`flex items-center gap-2 ${theme === "dark" ? "text-blue-600 font-bold" : ""}`}
                >
                  <Moon size={16} />
                  <span>Dark Mode (Default)</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setTheme("antigravity")}>
                <div
                  className={`flex items-center gap-2 ${theme === "antigravity" ? "text-blue-600 font-bold" : ""}`}
                >
                  <Monitor size={16} />
                  <span>Antigravity Theme</span>
                </div>
              </DropdownItem>

              <DropdownItem>
                <div className="flex items-center gap-2 w-full">
                  <Languages size={16} />
                  <div className="flex gap-2 flex-1">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage("en");
                      }}
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language === "en" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      EN
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage("fr");
                      }}
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language === "fr" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      FR
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage("km");
                      }}
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language === "km" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      KM
                    </div>
                  </div>
                </div>
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 font-bold"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span>Logout Session</span>
                </div>
              </DropdownItem>
            </Dropdown>
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
