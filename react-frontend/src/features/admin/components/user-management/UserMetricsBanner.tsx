import React from "react";
import { User as UserIcon, Shield, Key, UserCog } from "lucide-react";

interface Props {
  state: any;
}

export default function UserMetricsBanner({ state }: Props) {
  const { users, roles } = state;

  const totalUsers = users.length;
  const activeCount = users.filter((u: any) => u.isActive !== false).length;
  const superAdminCount = users.filter((u: any) =>
    u.roles?.some((r: any) => (typeof r === "string" ? r : r?.name || "").toUpperCase().includes("SUPERADMIN"))
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-blue-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/20">
          <UserIcon size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Total Managed Users
          </p>
          <h4 className="text-xl font-black text-gray-900 dark:text-white">
            {totalUsers}
          </h4>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-emerald-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-500/20">
          <Shield size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Active Security Profiles
          </p>
          <h4 className="text-xl font-black text-gray-900 dark:text-white">
            {activeCount}
          </h4>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-purple-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-600 text-white rounded-lg shadow-md shadow-purple-500/20">
          <Key size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Super Admins
          </p>
          <h4 className="text-xl font-black text-gray-900 dark:text-white">
            {superAdminCount}
          </h4>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-amber-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-amber-600 text-white rounded-lg shadow-md shadow-amber-500/20">
          <UserCog size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            System Roles Catalog
          </p>
          <h4 className="text-xl font-black text-gray-900 dark:text-white">
            {roles.length || 6}
          </h4>
        </div>
      </div>
    </div>
  );
}
