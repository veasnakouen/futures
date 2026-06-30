import React from "react";
import { Bell } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface NotificationStreamProps {
  notifications: string[];
}

const NotificationStream: React.FC<NotificationStreamProps> = ({
  notifications,
}) => {
  return (
    <ScrollReveal
      className="h-full"
      animation="fade-in-up"
      delay={250}
      duration={600}
      triggerOnce={true}
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-800/40 dark:backdrop-blur-md border border-gray-100 dark:border-gray-800/80 p-8 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md shadow-sm">
              <Bell size={20} />
            </div>
            Notification Stream
          </h4>
          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 rounded-md px-4 py-1 font-black uppercase text-[10px] tracking-widest shadow-sm">
            {notifications.length} Signals
          </span>
        </div>

        <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <Bell
                size={48}
                className="mx-auto mb-4 opacity-20 dark:opacity-10 animate-bounce"
              />
              <p className="text-xs font-black uppercase tracking-widest">
                No new signals detected
              </p>
            </div>
          ) : (
            notifications.map((n: string, i: number) => (
              <div
                key={i}
                className="p-5 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 rounded-md border border-gray-100/50 dark:border-gray-700/50 flex gap-4 items-start animate-slide-in group transition-all duration-350 cursor-pointer"
              >
                <div className="relative flex items-center justify-center mt-1.5 shrink-0">
                  <div className="absolute w-3 h-3 bg-blue-400 rounded-md animate-ping opacity-60"></div>
                  <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-md shadow-[0_0_12px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform duration-200"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    {n}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      System Node A1
                    </p>
                    <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                      Just Now
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default NotificationStream;
