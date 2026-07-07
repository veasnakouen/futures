"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  QrCode,
  MapPin,
  ShieldCheck,
  Activity,
  Smartphone,
  LogOut,
  Moon,
  Sun,
  Bell,
  Trash2
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(true); // Default dark based on screenshot

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "ការស្កេនវត្តមានបរាជ័យ",
      body: "Koeun Veasna ស្កេនបរាជ័យ៖ រកមិនឃើញទិន្នន័យ Check In សម្រាប់វេន TimeTable AM ទេ! / No...",
      time: "មុននេះ 3 ថ្ងៃ / 3d ago",
      unread: true,
      type: "warning"
    },
    {
      id: 2,
      title: "ការស្កេនវត្តមានបរាជ័យ",
      body: "Koeun Veasna ស្កេនបរាជ័យ៖ រកមិនឃើញទិន្នន័យ Check In សម្រាប់វេន TimeTable AM ទេ! / No...",
      time: "មុននេះ 3 ថ្ងៃ / 3d ago",
      unread: true,
      type: "warning"
    },
    {
      id: 3,
      title: "ការស្កេនវត្តមានបរាជ័យ",
      body: "Koeun Veasna ស្កេនបរាជ័យ៖ រកមិនឃើញទិន្នន័យ Check In សម្រាប់វេន TimeTable AM ទេ! / No...",
      time: "មុននេះ 3 ថ្ងៃ / 3d ago",
      unread: true,
      type: "warning"
    }
  ];

  const links = [
    { name: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/hr/users", icon: Users },
    { name: "Attendance", href: "/hr/attendance", icon: Clock },
    { name: "Timetable", href: "/hr/timetable", icon: Calendar },
    { name: "Reports", href: "/hr/reports", icon: FileText },
    { name: "QR Screen", href: "/hr/qr-screen", icon: QrCode },
    { name: "Branches", href: "/hr/branches", icon: MapPin },
    { name: "Audit", href: "/hr/audit", icon: ShieldCheck },
    { name: "Scan Hub", href: "/hr/scan-hub", icon: Activity },
    { name: "Directory", href: "/hr/directory", icon: Smartphone },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Sidebar - Dark Crimson #5a1212 */}
      <div className="w-[260px] bg-[#5a1212] text-white flex flex-col hidden md:flex shrink-0 shadow-2xl z-20">
        <div className="p-5 flex items-center gap-3 border-b border-red-900/30">
          <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center p-1">
            <div className="w-full h-full border-2 border-[#5a1212] rounded-sm"></div>
          </div>
          <h1 className="font-bold text-sm tracking-wide">អង្គការម្លប់តាប៉ាង</h1>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all
                  ${isActive
                    ? 'bg-white/10 border-l-[3px] border-white text-white'
                    : 'text-red-50 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'
                  }
                `}
              >
                <link.icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#1a1f2c]">
        {/* Top Navbar */}
        <header className="h-[72px] bg-[#111827] text-white flex items-center justify-end px-8 shrink-0 gap-6 border-b border-gray-800 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lg border border-gray-600">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-bold leading-none">{user?.username || 'Admin Manager'}</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">ADMIN • ADMINISTRATION</span>
            </div>
          </div>

          <div className="flex items-center gap-5 border-l border-gray-700 pl-6 h-8 relative">
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-gray-400 hover:text-white relative"
              >
                <Bell size={20} />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border-2 border-[#111827]">
                  9
                </span>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-12 right-0 w-[380px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-50 animate-fade-in text-gray-800 flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">ការជូនដំណឹង / Notifications</h3>
                    <button className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:text-blue-800">
                      <span className="text-[10px]">✓✓</span> អានទាំងអស់
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-1">
                          <span className="font-black text-sm">⚠</span>
                        </div>
                        <div className="flex-1 pr-6">
                          <h4 className="font-bold text-[13px] text-gray-900 mb-1">{notif.title}</h4>
                          <p className="text-gray-500 text-[13px] leading-tight mb-2 line-clamp-2">{notif.body}</p>
                          <span className="text-[11px] font-bold text-gray-400">{notif.time}</span>
                        </div>
                        {notif.unread && (
                          <div className="absolute right-4 top-5 w-2 h-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-100 flex justify-between bg-gray-50/50">
                    <button className="flex items-center gap-2 text-rose-500 font-bold text-xs hover:text-rose-700">
                      <Trash2 size={14} /> លុបទាំងអស់ / Clear All
                    </button>
                    <button className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:text-blue-800">
                      <Bell size={14} /> បង្ហាញទាំងអស់ / View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setIsDark(!isDark)} className="text-gray-400 hover:text-white">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="flex items-center gap-2 bg-white text-rose-600 hover:bg-gray-100 px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm ml-2">
              <LogOut size={14} /> ចាកចេញ / Log Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
