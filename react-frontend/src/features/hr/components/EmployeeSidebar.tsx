import React from "react";
import { Avatar } from '@/lib/flowbite-compat';

interface EmployeeSidebarProps {
  employee: any;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  employee,
  activeMenu,
  setActiveMenu,
}) => {
  const menuItems = [
    "Profile Overview",
    "Performance",
    "Attendance",
    "Leave Management",
    "Payroll",
    "Assets & Equipment",
    "Documents",
    "History & Experience",
  ];

  // Map internal tab IDs if needed, but we can just use the strings
  const getMenuId = (item: string) => {
    switch (item) {
      case "Profile Overview": return "profile";
      case "Performance": return "performance";
      case "Attendance": return "attendance";
      case "Leave Management": return "leave";
      case "Payroll": return "payroll";
      case "Assets & Equipment": return "assets";
      case "Documents": return "documents";
      case "History & Experience": return "history";
      default: return "profile";
    }
  };

  const currentTab = getMenuId(activeMenu);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center relative">
        <div className="flex flex-col items-center mt-2">
          <div className={`px-3 py-1 font-bold text-[10px] rounded-full uppercase tracking-widest mb-2 ${employee?.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {employee?.status?.toUpperCase() || "ACTIVE"}
          </div>

          <div className="relative mb-4 group cursor-pointer">
            <Avatar
              img={employee?.photo || undefined}
              size="xl"
              rounded
              className="ring-4 ring-gray-50 dark:ring-gray-700 shadow-md"
            />
          </div>

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
            CODE: #{employee?.idNo || `EMP-0000`}
          </p>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1 text-center">
            {employee?.firstNameEnglish} {employee?.lastNameEnglish}
          </h2>
          <p className="text-sm text-gray-500 font-medium text-center">
            {employee?.firstNameKhmer} {employee?.lastNameKhmer}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-2">
            {employee?.currentPosition || "Staff"}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-gray-900 dark:text-white mb-1 leading-none text-center truncate w-full" title={typeof employee?.department === 'object' ? employee?.department?.name : employee?.department}>
            {typeof employee?.department === 'object' ? (employee?.department?.name || "N/A") : (employee?.department || "N/A")}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Department
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-gray-900 dark:text-white mb-1 leading-none text-center truncate w-full" title={typeof employee?.workShift === 'object' ? employee?.workShift?.name : employee?.workShift}>
            {typeof employee?.workShift === 'object' ? (employee?.workShift?.name || "N/A") : (employee?.workShift || "N/A")}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Shift
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-2">
        {menuItems.map((item) => {
          const isActive = activeMenu === item || currentTab === item;
          return (
            <button
              key={item}
              onClick={() => setActiveMenu(item)}
              className={`w-full text-left px-6 py-4 font-bold text-sm transition-colors border-b last:border-b-0 border-gray-100 dark:border-gray-700 ${
                isActive
                  ? "bg-[#7a2323] text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeSidebar;
