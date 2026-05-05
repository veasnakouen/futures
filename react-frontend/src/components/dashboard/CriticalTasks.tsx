import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Calendar, CheckCircle2 } from 'lucide-react';

const CriticalTasks: React.FC = () => {
  const tasks = [
    { task: 'Annual Reporting Cycle', status: 'In Progress', color: 'info', urgency: 'High' },
    { task: 'Database Synchronization', status: 'Healthy', color: 'success', urgency: 'Normal' },
    { task: 'System Backup Policy', status: 'Verified', color: 'success', urgency: 'Critical' },
    { task: 'New Security Patch', status: 'Pending', color: 'warning', urgency: 'High' }
  ];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 border-none shadow-xl shadow-gray-200/50 dark:shadow-none p-8 rounded-lg">
      <div className="flex items-center justify-between mb-10">
         <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg shadow-sm"><Calendar size={20}/></div>
            Critical Operations
         </h4>
         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Tasks</button>
      </div>
      <div className="space-y-4">
         {tasks.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-6 bg-gray-50/80 dark:bg-gray-700/30 rounded-lg border border-gray-100/50 dark:border-gray-600/30 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all group cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform`}>
                     <CheckCircle2 size={16} className={item.color === 'success' ? 'text-emerald-500' : 'text-gray-300'} />
                  </div>
                  <div>
                     <span className="text-sm font-black text-gray-800 dark:text-gray-200 block">{item.task}</span>
                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Priority: {item.urgency}</span>
                  </div>
               </div>
               <Badge color={item.color} className="rounded-full px-5 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm">{item.status}</Badge>
            </div>
         ))}
      </div>
    </Card>
  );
};

export default CriticalTasks;
