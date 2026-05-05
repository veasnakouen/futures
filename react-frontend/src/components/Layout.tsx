import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileBarChart, Settings,
  Sun, Moon, LogOut, Shield, UserCircle,
  History, Briefcase, FolderKanban, Package, LifeBuoy, Building2,
  Languages, User, ChevronDown, DollarSign, MessageCircle
} from 'lucide-react';
import { Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import Chat from './Chat/Chat';

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  title?: string;
}

const Layout = ({ children, isDark, setIsDark, title }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = authService.getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/", icon: LayoutDashboard, label: t('dashboard') },
    { to: "/clients", icon: Users, label: t('clients') },
    { to: "/cases", icon: FolderKanban, label: "Cases" },
    { to: "/logbook", icon: History, label: "Logbook" },
    { to: "/placements", icon: Briefcase, label: "Placements" },
    { to: "/employers", icon: Building2, label: t('employers') },
    { to: "/vacancies", icon: Briefcase, label: t('vacancies') },
    { to: "/employees", icon: Users, label: "Team Directory" },
    { to: "/payroll", icon: DollarSign, label: "Financial & Payroll" },
    { to: "/inventory", icon: Package, label: "Stock & Inventory" },
    { to: "/support", icon: LifeBuoy, label: "Support Portal" },
    { to: "/reports", icon: FileBarChart, label: t('reports') },
    { to: "/chat", icon: MessageCircle, label: "Live Team Chat" },
    { to: "/settings", icon: Settings, label: t('settings') },
  ];

  // Debugging user roles
  React.useEffect(() => {
    if (user) {
      console.log('Current User Roles:', user.roles);
    }
  }, [user]);

  const isAdmin = Array.isArray(user?.roles) && user.roles.some((role: any) => {
    const roleName = (typeof role === 'string' ? role : (role?.name || '')).toUpperCase();
    return roleName.includes('ADMIN');
  });

  if (isAdmin) {
    navLinks.push({ to: "/admin", icon: Shield, label: "Administration" });
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      {/* Mobile Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20">
              <Shield size={24} />
            </div>
            <span className="font-bold text-xl dark:text-white tracking-tight">MTP System</span>
          </div>
          <button className="lg:hidden dark:text-white" onClick={() => setIsMenuOpen(false)}>
            <LogOut size={20} className="rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(link.to) ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <link.icon size={20} /> {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 z-20 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              <LayoutDashboard size={24} />
            </button>
            <h2 className="text-lg font-semibold dark:text-white truncate max-w-[150px] sm:max-w-none">{title || t('dashboard')}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all group">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
                    {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <UserCircle size={20} />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                      {Array.isArray(user?.roles) && user.roles.some((r: any) => (typeof r === 'string' ? r : (r?.name || '')).toUpperCase().includes('SUPERADMIN')) 
                        ? 'Super Admin' 
                        : (Array.isArray(user?.roles) && user.roles.some((r: any) => (typeof r === 'string' ? r : (r?.name || '')).toUpperCase().includes('ADMIN')) ? 'Administrator' : 'Standard User')}
                    </p>
                    <p className="text-xs font-black dark:text-white leading-none">{user?.username || 'Guest'}</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors ml-1" />
                </div>
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-black dark:text-white">Logged in as</span>
                <span className="block truncate text-xs font-bold text-blue-600 dark:text-blue-400">{user?.email || 'admin@mtp.org'}</span>
              </DropdownHeader>

              <DropdownItem icon={User} onClick={() => navigate('/settings')}>
                Profile Settings
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                icon={isDark ? Sun : Moon}
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </DropdownItem>

              <DropdownItem icon={Languages}>
                <div className="flex gap-2 w-full">
                  <button onClick={(e) => { e.stopPropagation(); i18n.changeLanguage('en'); }} className={`flex-1 text-[10px] font-bold py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>EN</button>
                  <button onClick={(e) => { e.stopPropagation(); i18n.changeLanguage('fr'); }} className={`flex-1 text-[10px] font-bold py-1 rounded ${i18n.language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>FR</button>
                </div>
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem icon={LogOut} onClick={handleLogout} className="text-red-600 dark:text-red-400 font-bold">
                Logout Session
              </DropdownItem>
            </Dropdown>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-4 lg:p-8">
          {children}
        </div>
        <Chat />
      </main>
    </div>
  );
};

export default Layout;
