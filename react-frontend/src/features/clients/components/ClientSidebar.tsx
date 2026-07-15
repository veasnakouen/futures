import React from "react";
import { Avatar } from '@/lib/flowbite-compat';
import { Camera, Edit2, Trash2, Phone, MapPin, Search, FileText, Activity, Users, Settings, LogOut, CheckCircle, Clock, User, Briefcase } from "lucide-react";

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
    { id: "Client / Referral", icon: User },
    { id: "Program Management", icon: Briefcase },
    { id: "Case Management", icon: Activity },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Profile Card */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-800/50 p-5 flex flex-col relative overflow-hidden group">
        {/* Decorative Background Blur */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col w-full z-10">
          {/* Top Row: Avatar & Actions */}
          <div className="flex justify-between items-start w-full mb-3">
            <div className="relative group/avatar cursor-pointer shrink-0 w-48 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 z-10" />
              {client?.photo ? (
                <img src={client.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 z-20 backdrop-blur-sm">
                <Camera size={24} className="text-white scale-75 group-hover/avatar:scale-100 transition-transform" />
              </div>
            </div>

            {/* Actions Menu (Always takes space, fades in on hover) */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={onEditClient}
                className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-sm flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all hover:scale-105 active:scale-95"
                title="Edit Client"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={onDeleteClient}
                className="w-8 h-8 rounded-xl bg-white/80 hover:bg-rose-500 dark:bg-gray-800/80 dark:hover:bg-rose-500 backdrop-blur-sm flex items-center justify-center text-rose-500 hover:text-white shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all hover:scale-105 active:scale-95"
                title="Delete Client"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Info & Badges */}
          <div className="flex flex-col w-full text-left">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-0.5 tracking-tight line-clamp-1">
              {client?.firstName} {client?.lastName}
            </h2>
            <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-3">
              {client?.englishName || "teasting teaser"}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-100/50 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg">
                CODE: <span className="text-gray-700 dark:text-gray-300">#{client?.clientCode || `MT-2026-0007`}</span>
              </p>
              <div className="px-2.5 py-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-black text-[9px] rounded-lg uppercase tracking-[0.2em] shadow-md shadow-emerald-500/20">
                {client?.status?.toUpperCase() || "ACTIVE"}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] bg-white/50 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                YELLOW
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/50 p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-xl group">
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-1.5 leading-none group-hover:scale-110 transition-transform duration-300">
            {programsCount}
          </span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">
            Active
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Programs
          </span>
        </div>
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/50 p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-xl group">
          <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-1.5 leading-none group-hover:scale-110 transition-transform duration-300">
            {staffsCount}
          </span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">
            Active
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Staffs
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/50 overflow-hidden p-1.5 flex flex-col gap-1">
        {menuItems.map((item, index) => {
          const isActive = activeMenu === item.id;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-sm transition-all rounded-xl relative overflow-hidden ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <ItemIcon size={16} className={isActive ? "text-white" : "opacity-70"} />
                {item.id}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClientSidebar;
