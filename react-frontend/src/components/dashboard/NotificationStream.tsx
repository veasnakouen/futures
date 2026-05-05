import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Bell } from 'lucide-react';

interface NotificationStreamProps {
   notifications: string[];
}

const NotificationStream: React.FC<NotificationStreamProps> = ({ notifications }) => {
   return (
      <Card className="dark:bg-gray-800 dark:border-gray-700 border-none shadow-xl shadow-gray-200/50 dark:shadow-none p-8 rounded-lg">
         <div className="flex items-center justify-between mb-10">
            <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
               <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg shadow-sm"><Bell size={20} /></div>
               Notification Stream
            </h4>
            <Badge color="info" className="rounded-full px-4 py-1 font-black uppercase text-[10px] tracking-widest">{notifications.length} New Signals</Badge>
         </div>
         <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
            {notifications.length === 0 ? (
               <div className="text-center py-16 text-gray-400">
                  <Bell size={56} className="mx-auto mb-6 opacity-10" />
                  <p className="text-sm font-bold italic uppercase tracking-widest">No new signals detected.</p>
               </div>
            ) : notifications.map((n: string, i: number) => (
               <div key={i} className="p-6 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg border border-gray-100/50 dark:border-gray-600/30 flex gap-5 items-start animate-slide-in group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform"></div>
                  <div>
                     <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{n}</p>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Just Now • System Node A1</p>
                  </div>
               </div>
            ))}
         </div>
      </Card>
   );
};

export default NotificationStream;
