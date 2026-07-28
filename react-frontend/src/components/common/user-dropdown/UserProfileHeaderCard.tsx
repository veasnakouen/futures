import React from "react";
import { ShieldCheck, User as UserIcon } from "lucide-react";

interface UserProfileHeaderCardProps {
  user: any;
  userRole: string;
  photoUrl: string | null;
}

export const UserProfileHeaderCard: React.FC<UserProfileHeaderCardProps> = ({
  user,
  userRole,
  photoUrl,
}) => {
  // Extract user display name avoiding email duplication
  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.name) return user.name;
    if (user?.displayName) return user.displayName;
    if (user?.username && !user.username.includes("@")) return user.username;
    if (user?.email) {
      const prefix = user.email.split("@")[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1) + " User";
    }
    return "System Administrator";
  };

  // Generate 2-character initials
  const getInitials = () => {
    const nameStr = user?.fullName || user?.name || user?.username || user?.email || "Admin";
    if (nameStr.includes("@")) {
      const prefix = nameStr.split("@")[0];
      return prefix.slice(0, 2).toUpperCase();
    }
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const displayName = getDisplayName();
  const initials = getInitials();

  return (
    <div className="p-5 bg-blue-50/80 dark:bg-slate-900/90 border-b border-gray-200/80 dark:border-gray-800 relative z-10">
      <div className="flex items-center gap-3.5">
        {/* Avatar Container */}
        <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] aspect-square rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/20 shrink-0">
          <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm flex items-center justify-center tracking-wider">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* User Role & Name */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
              {userRole || "ADMINISTRATOR"}
            </span>
            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
          </div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">
            {displayName}
          </h4>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {user?.email || "admin@mtp.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderCard;
