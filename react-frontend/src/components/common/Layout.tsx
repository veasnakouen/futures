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
import {Dropdown, DropdownItem, DropdownHeader, DropdownDivider} from '@/lib/flowbite-compat';
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
      return location.pathname === pathname && location.search.includes(search);
    }
    return location.pathname === path && !location.search;
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getSidebarBgClass = () => {
    if (sidebarTheme === "dark")
      return "bg-gray-900 border-gray-800 text-gray-300";
    if (sidebarTheme === "brand")
      return "bg-indigo-900 border-indigo-800 text-indigo-100";
    return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  };

  const getTopbarBgClass = () => {
    if (topbarTheme === "dark")
      return "bg-gray-900/95 border-gray-800 text-white";
    if (topbarTheme === "brand")
      return "bg-indigo-900/95 border-indigo-800 text-white";
    return "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700";
  };

  const getSidebarLinkClass = (active: boolean) => {
    if (active) {
      if (sidebarTheme === "brand") return "text-white font-semibold shadow-sm";
      if (sidebarTheme === "dark") return "text-white font-semibold shadow-sm";
      return "text-blue-600 dark:text-blue-400 font-semibold shadow-sm";
    }
    if (sidebarTheme === "brand")
      return "text-indigo-200 hover:bg-indigo-800 hover:text-white";
    if (sidebarTheme === "dark")
      return "text-gray-400 hover:bg-gray-800 hover:text-white";
    return "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50";
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
          { to: "/employees", icon: Users, label: t("teamDirectory") },
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
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden ${sidebarPosition ==="right"?"flex-row-reverse":""}`}
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
        className={`fixed inset-y-0 ${sidebarPosition ==="right"?"right-0 border-l":"left-0 border-r"} z-40 ${getSidebarBgClass()} transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMenuOpen ?"translate-x-0": sidebarPosition ==="right"?"translate-x-full":"-translate-x-full"} ${isSidebarCollapsed ?"w-20":"w-64"} flex flex-col`}
      >
        <div
          className={`p-6 flex items-center ${isSidebarCollapsed ?"justify-center":"justify-between"}`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              {appLogo ? (
                <img
                  src={appLogo}
                  alt="Logo"
                  className="max-w-[40px] max-h-[40px] object-contain rounded-md shadow-sm"
                />
              ) : (
                <div className="bg-blue-600 p-2 rounded-md text-white shadow-lg shadow-blue-500/20">
                  <Shield size={24} />
                </div>
              )}
              <span
                className={`font-bold text-xl tracking-tight ${sidebarTheme ==="brand"?"text-white":"dark:text-white"}`}
              >
                MTP
              </span>
            </div>
          )}
          {isSidebarCollapsed &&
            (appLogo ? (
              <img
                src={appLogo}
                alt="Logo"
                className="max-w-[40px] max-h-[40px] object-contain rounded-md shadow-sm"
                title="MTP System"
              />
            ) : (
              <div
                className="bg-blue-600 p-2 rounded-md text-white shadow-lg shadow-blue-500/20"
                title="MTP System"
              >
                <Shield size={24} />
              </div>
            ))}
          <button
            className={`lg:hidden ${sidebarTheme ==="brand"?"text-white":"dark:text-white"} ${isSidebarCollapsed ?"hidden":""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <LogOut
              size={20}
              className={sidebarPosition === "right"?"" :"rotate-180"}
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
                  className="w-full flex items-center justify-between px-4 mb-2 mt-4 group outline-none cursor-pointer"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300 ${
                      !isExpanded ? "-rotate-90" : ""
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
                        className={`relative flex items-center ${isSidebarCollapsed ?"justify-center p-3":"px-4 py-2.5"} rounded-md transition-colors ${getSidebarLinkClass(active)}`}
                      >
                        {active && (
                          <motion.div
                            layoutId="active-sidebar-item"
                            className={`absolute inset-0 rounded-md ${sidebarTheme ==="brand"?"bg-indigo-800": sidebarTheme ==="dark"?"bg-gray-800":"bg-blue-50 dark:bg-blue-900/30"}`}
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                        <div className={`relative z-10 flex items-center gap-3`}>
                          <link.icon size={isSidebarCollapsed ? 22 : 18} />
                          {!isSidebarCollapsed && (
                            <span className="text-xs font-semibold">
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

        <div className="p-4 border-t flex flex-col gap-2 shrink-0">
          <button
            onClick={toggleSidebar}
            className={`flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-all text-gray-500 dark:text-gray-400 ${isSidebarCollapsed ?"justify-center p-2.5":"gap-3 px-4 py-2.5"}`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs font-semibold">Collapse Sidebar</span>
              </>
            )}
          </button>
          <div
            className={`flex items-center ${isSidebarCollapsed ?"justify-center p-2":"gap-3 px-4 py-2"} bg-gray-50 dark:bg-gray-700/50 rounded-md`}
            title={isSidebarCollapsed ? "System Operational" : undefined}
          >
            <div className="w-2 h-2 rounded-md bg-green-500 animate-pulse shrink-0"></div>
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                System Operational
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header
          className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-8 z-20 transition-colors ${getTopbarBgClass()}`}
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
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors relative"
              title="My Network"
            >
              <Users size={20} />
            </button>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-800">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-black dark:text-white">
                  Notifications
                </span>
              </DropdownHeader>
              <div className="max-h-80 overflow-y-auto custom-scrollbar w-72">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownItem
                      key={n.id}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                    >
                      <div
                        className={`flex flex-col gap-1 w-full text-left ${!n.read ?"font-bold":"opacity-75"}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs text-blue-600 dark:text-blue-400 truncate">
                            {n.title}
                          </span>
                          <span className="text-[9px] text-gray-400 shrink-0">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs truncate dark:text-gray-300">
                          {n.message}
                        </p>
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
                <div className="flex items-center gap-2 p-1.5 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-all group">
                  <div className="w-10 h-10 rounded-full shrink-0 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border-2 border-white shadow-sm overflow-hidden">
                    {user?.photo ? (
                      <img
                        src={getFaceFocusedUrl(user.photo, 80)}
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <UserCircle size={20} />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
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
                    <p className="text-xs font-black dark:text-white leading-none">
                      {user?.username || "Guest"}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:text-blue-600 transition-transform duration-300 ml-1 [[aria-expanded=true]_&]:rotate-180"
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
                  className={`flex items-center gap-2 ${theme ==="light"?"text-blue-600 font-bold":""}`}
                >
                  <Sun size={16} />
                  <span>Light Mode</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setTheme("dark")}>
                <div
                  className={`flex items-center gap-2 ${theme ==="dark"?"text-blue-600 font-bold":""}`}
                >
                  <Moon size={16} />
                  <span>Dark Mode (Default)</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setTheme("antigravity")}>
                <div
                  className={`flex items-center gap-2 ${theme ==="antigravity"?"text-blue-600 font-bold":""}`}
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
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language ==="en"?"bg-blue-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      EN
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage("fr");
                      }}
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language ==="fr"?"bg-blue-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      FR
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage("km");
                      }}
                      className={`flex-1 text-[10px] font-bold py-1 rounded text-center cursor-pointer transition-colors ${i18n.language ==="km"?"bg-blue-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
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
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-4 lg:p-6">
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
