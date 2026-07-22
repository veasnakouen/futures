import React from "react";
import { User, ShieldCheck } from "lucide-react";

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
  return (
    <div className="p-5 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800/80">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] aspect-square rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/20 shrink-0">
          <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User size={24} className="text-blue-600 dark:text-blue-400" />
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
              {userRole}
            </span>
            <ShieldCheck size={14} className="text-blue-500" />
          </div>
          <h4 className="text-sm font-black dark:text-white text-gray-900 truncate mt-1">
            {user?.username || "System Administrator"}
          </h4>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "admin@mtp.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderCard;
