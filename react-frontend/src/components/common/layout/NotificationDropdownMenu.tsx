import React from "react";
import { Bell, Inbox } from "lucide-react";
import { Dropdown, DropdownItem, DropdownHeader } from "@/lib/flowbite-compat";

interface NotificationDropdownMenuProps {
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: any) => void;
}

export const NotificationDropdownMenu: React.FC<
  NotificationDropdownMenuProps
> = ({ notifications, unreadCount, markAsRead }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <div
          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/[0.05] rounded-xl transition-all relative cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 ? (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md ring-2 ring-white dark:ring-[#0d1117]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-white/[0.1] text-gray-500 dark:text-gray-400 text-[9px] font-bold shadow-md ring-2 ring-white dark:ring-[#0d1117]">
              0
            </span>
          )}
        </div>
      }
    >
      <DropdownHeader className="px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Bell size={14} className="text-indigo-500" />
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-[9px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {unreadCount} New
            </span>
          )}
        </div>
      </DropdownHeader>
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar w-80">
        {notifications.length === 0 ? (
          <div className="px-6 py-10 flex flex-col items-center justify-center text-center gap-4 bg-white dark:bg-[#0d1117] animate-fade-in-up">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full animate-ping [animation-duration:3s]" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center shadow-inner shadow-indigo-100 dark:shadow-indigo-900/20 transform transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500">
                <Inbox
                  size={26}
                  strokeWidth={1.5}
                  className="text-indigo-500 dark:text-indigo-400"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse [animation-delay:500ms] shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent uppercase tracking-[0.2em] mt-2">
                All caught up!
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium px-4 leading-relaxed">
                Your inbox is clear. New alerts will magically appear here when
                they arrive.
              </p>
            </div>
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownItem
              key={n.id}
              onClick={() => {
                if (!n.read) markAsRead(n.id);
              }}
              className={`px-4 py-3 border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-indigo-50/50 dark:hover:bg-white/[0.04] transition-colors ${
                !n.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
              }`}
            >
              <div className="flex gap-3 w-full">
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    !n.read
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      : "bg-transparent"
                  }`}
                />
                <div
                  className={`flex flex-col gap-1 w-full text-left ${
                    !n.read
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100 transition-opacity"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      {n.title}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-500 shrink-0 uppercase tracking-wider">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </DropdownItem>
          ))
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationDropdownMenu;
