import React from "react";
import { ShieldCheck, BookmarkPlus, ChevronRight } from "lucide-react";
import { Badge } from "@/lib/flowbite-compat";

interface RoleTableProps {
  roles: any[];
  t: (key: string) => string;
  onAssignPermissions: (role: any) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  t,
  onAssignPermissions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <div
          key={role.id || role.name}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <Badge color="info" size="sm" className="font-bold">
                {role.permissions?.length || 0} {t("permissions")}
              </Badge>
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              {role.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 mb-4">
              {role.description || t("defaultRoleDesc")}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t("rbacPolicy")}
            </span>
            <button
              onClick={() => onAssignPermissions(role)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 transition-all"
            >
              <BookmarkPlus size={14} />
              <span>{t("assignPermissions")}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleTable;
