import React from "react";
import { User, getAvatarStyle, getInitials, formatFullName } from "./UserAvatarHelper";
import { Badge, Checkbox } from "@/lib/flowbite-compat";
import { Key, Eye, EyeOff, Camera, RefreshCw, MoreVertical, Edit } from "lucide-react";

interface UserTableRowProps {
  user: User;
  t: (key: string) => string;
  isSuperAdmin: boolean;
  visibleColumns: {
    profile: boolean;
    contact: boolean;
    credentials: boolean;
    roles: boolean;
    status: boolean;
    governance: boolean;
  };
  showPasswordState: { [key: string]: boolean };
  onTogglePassword: (id: string) => void;
  onEditUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  t,
  isSuperAdmin,
  visibleColumns,
  showPasswordState,
  onTogglePassword,
  onEditUser,
  onToggleStatus,
  onResetPassword,
}) => {
  const isShowPassword = showPasswordState[user.id] || false;

  return (
    <tr className="hover:bg-slate-50/70 dark:hover:bg-gray-750/50 transition-colors group">
      {visibleColumns.profile && (
        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-sm ring-2 ${getAvatarStyle(
                    user.id || user.userName
                  )}`}
                >
                  {getInitials(user)}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.isActive ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-gray-900 dark:text-white">
                {formatFullName(user)}
              </span>
              <span className="text-xs text-gray-400 font-medium font-mono">
                @{user.userName}
              </span>
            </div>
          </div>
        </td>
      )}

      {visibleColumns.contact && (
        <td className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
          {user.email || "N/A"}
        </td>
      )}

      {isSuperAdmin && visibleColumns.credentials && (
        <td className="px-6 py-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">
              {isShowPassword
                ? user.passwordText || "••••••••"
                : "••••••••"}
            </span>
            <button
              onClick={() => onTogglePassword(user.id)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Toggle Password Visibility"
            >
              {isShowPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </td>
      )}

      {visibleColumns.roles && (
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1.5">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((r: any, idx: number) => {
                const roleName = typeof r === "string" ? r : r.name;
                return (
                  <Badge key={idx} color="info" size="xs" className="font-bold">
                    {roleName}
                  </Badge>
                );
              })
            ) : (
              <Badge color="gray" size="xs">
                {t("noRoles") || "USER"}
              </Badge>
            )}
          </div>
        </td>
      )}

      {visibleColumns.status && (
        <td className="px-6 py-4">
          <button
            onClick={() => onToggleStatus(user)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
              user.isActive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                user.isActive ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span>{user.isActive ? t("active") : t("inactive")}</span>
          </button>
        </td>
      )}

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditUser(user)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
            title="Edit User"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onResetPassword(user)}
            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition-colors"
            title="Reset Password"
          >
            <Key size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
