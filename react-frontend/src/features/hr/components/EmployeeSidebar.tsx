import React from "react";
import { Avatar } from '@/lib/flowbite-compat';
import {
  User,
  TrendingUp,
  Clock,
  Calendar,
  DollarSign,
  Monitor,
  FileText,
  History,
} from "lucide-react";

interface EmployeeSidebarProps {
  employee: any;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const menuItems = [
  { label: "Profile Overview", id: "profile", icon: User },
  { label: "Performance", id: "performance", icon: TrendingUp },
  { label: "Attendance", id: "attendance", icon: Clock },
  { label: "Leave Management", id: "leave", icon: Calendar },
  { label: "Payroll", id: "payroll", icon: DollarSign },
  { label: "Assets & Equipment", id: "assets", icon: Monitor },
  { label: "Documents", id: "documents", icon: FileText },
  { label: "History & Experience", id: "history", icon: History },
];

const getMenuId = (item: string): string => {
  const found = menuItems.find(m => m.label === item || m.id === item);
  return found?.id ?? item;
};

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  employee,
  activeMenu,
  setActiveMenu,
}) => {
  const activeId = getMenuId(activeMenu);

  const deptName =
    typeof employee?.department === "object"
      ? employee?.department?.name
      : employee?.department;

  const shiftName =
    typeof employee?.workShift === "object"
      ? employee?.workShift?.name
      : employee?.workShift;

  const isActive = employee?.status === "Active";

  return (
    <div className="w-full flex flex-col gap-3">
      {/* ── Profile Card ── */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/60 overflow-hidden">
        {/* Decorative header band */}
        <div className="h-16 bg-gradient-to-r from-[#7a2323] via-[#9b2c2c] to-[#c53030] relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        </div>

        {/* Avatar overlapping the band */}
        <div className="flex flex-col items-center -mt-10 px-6 pb-5">
          <div className="relative">
            <div className="p-1 rounded-full bg-gradient-to-br from-[#7a2323] to-[#f87171] shadow-lg">
              <div className="p-0.5 rounded-full bg-white dark:bg-gray-900">
                <Avatar
                  img={employee?.photo || undefined}
                  size="xl"
                  rounded
                  className="shadow-md rounded-full"
                />
              </div>
            </div>
            {isActive && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-gray-900 rounded-full shadow" />
            )}
          </div>

          {/* Status pill */}
          <span className={`mt-3 px-3 py-0.5 text-[9px] font-black rounded-full uppercase tracking-widest ${
            isActive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}>
            {employee?.status || "Active"}
          </span>

          {/* Name */}
          <h2 className="mt-2 text-base font-black text-gray-900 dark:text-white text-center leading-tight">
            {employee?.firstNameEnglish} {employee?.lastNameEnglish}
          </h2>
          {(employee?.firstNameKhmer || employee?.lastNameKhmer) && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center mt-0.5">
              {employee?.firstNameKhmer} {employee?.lastNameKhmer}
            </p>
          )}

          {/* Position */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c53030]" />
            <p className="text-xs text-[#c53030] dark:text-red-400 font-bold">
              {employee?.currentPosition || "Staff"}
            </p>
          </div>

          {/* ID badge */}
          <p className="mt-2 text-[10px] text-gray-400 font-mono font-bold tracking-widest uppercase">
            #{employee?.idNo || "EMP-0000"}
          </p>
        </div>
      </div>

      {/* ── Metric Pills ── */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Department", value: deptName || "N/A" },
          { label: "Shift", value: shiftName || "N/A" },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-3 flex flex-col items-center justify-center text-center gap-0.5"
          >
            <span className="text-xs font-black text-gray-800 dark:text-white truncate w-full text-center" title={m.value}>
              {m.value}
            </span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Navigation ── */}
      <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden">
        {menuItems.map((item, idx) => {
          const active = activeId === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200
                ${idx !== 0 ? "border-t border-gray-50 dark:border-gray-800" : ""}
                ${active
                  ? "bg-gradient-to-r from-[#7a2323] to-[#b91c1c] text-white shadow-inner"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <span className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-[#7a2323]/10 group-hover:text-[#7a2323] dark:group-hover:text-red-400"
              }`}>
                <Icon size={14} />
              </span>
              <span className="flex-1 text-left text-[13px]">{item.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
