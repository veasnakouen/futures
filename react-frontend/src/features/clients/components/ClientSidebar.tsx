import React from "react";
import { Avatar } from '@/lib/flowbite-compat';
import { Edit2, Trash2 } from "lucide-react";

interface ClientSidebarProps {
  client: any;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onEditClient: () => void;
  onDeleteClient: () => void;
  programsCount?: number;
  staffsCount?: number;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({
  client,
  activeMenu,
  setActiveMenu,
  onEditClient,
  onDeleteClient,
  programsCount = 0,
  staffsCount = 0,
}) => {
  const menuItems = [
    "Client / Referral",
    "Program Management",
    "Case Management",
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onEditClient}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 dark:bg-gray-700 dark:text-gray-300 transition-colors"
            title="Edit Client"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDeleteClient}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
            title="Delete Client"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex flex-col items-center mt-2">
          <div className="px-3 py-1 bg-green-100 text-green-600 font-bold text-[10px] rounded-full uppercase tracking-widest mb-2">
            {client?.status?.toUpperCase() || "ACTIVE"}
          </div>
          <div className="flex items-center gap-1 mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            YELLOW
          </div>

          <div className="relative mb-4 group cursor-pointer">
            <Avatar
              img={client?.photo || undefined}
              size="xl"
              rounded
              className="ring-4 ring-gray-50 dark:ring-gray-700 shadow-md"
            />
          </div>
          <button className="px-4 py-1.5 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6">
            Upload Image
          </button>

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
            CODE: #{client?.clientCode || `MT-2026-0007`}
          </p>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">
            {client?.firstName} {client?.lastName}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {client?.englishName || "teasting teaser"}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none">
            {programsCount}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Active
          </span>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
            Programs
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none">
            {staffsCount}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Active
          </span>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
            Staffs
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-2">
        {menuItems.map((item, index) => {
          const isActive = activeMenu === item;
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

export default ClientSidebar;
