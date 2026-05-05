import React from 'react';
import { Card, Button, Badge, Avatar } from 'flowbite-react';

interface LeavesModuleProps {
   globalLeaves: any[];
}

const LeavesModule: React.FC<LeavesModuleProps> = ({ globalLeaves }) => {
   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black dark:text-white">Absence Request Pipeline</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg">
               <button className="px-4 py-2 bg-white dark:bg-gray-600 rounded-lg text-[10px] font-black uppercase shadow-sm">All Pending</button>
               <button className="px-4 py-2 text-gray-400 text-[10px] font-black uppercase">Approved</button>
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {globalLeaves.length === 0 ? (
               <div className="col-span-full py-20 text-center border-2 border-dashed dark:border-gray-700 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                     <p className="text-2xl">📅</p>
                  </div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Leave Requests</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">Staff time-off requests will appear in this pipeline</p>
               </div>
            ) : (
               globalLeaves.map((l, i) => (
                  <Card key={i} className="border-none shadow-sm dark:bg-gray-800 rounded-lg p-10 border-l-[12px] border-l-blue-600 hover:shadow-lg transition-all">
                     <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                           <Avatar rounded size="md" />
                           <div>
                              <h4 className="text-xl font-black dark:text-white">{l.employeeName || 'Anonymous Staff'}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{l.type || 'General'}</p>
                                 <div className={`w-1 h-1 rounded-full ${l.type === 'Sick' ? 'bg-red-500' : l.type === 'Vacation' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{l.type === 'Sick' ? 'Medical Certificate Attached' : 'Planned Absence'}</p>
                              </div>
                           </div>
                        </div>
                        <Badge color={l.status === 'Approved' ? 'success' : 'warning'} className="rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest">{l.status || 'Pending'}</Badge>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-700/40 p-6 rounded-lg mb-8">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                           <span>Duration</span>
                           <span>Reason</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <p className="font-black dark:text-white">{l.startDate || 'N/A'} <span className="mx-2 opacity-30">→</span> {l.endDate || 'N/A'}</p>
                           <p className="text-xs font-medium dark:text-gray-400">Personal Leave</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button color="blue" className="flex-1 rounded-lg font-black uppercase text-[10px] h-12 shadow-xl shadow-blue-500/20">Approve Request</Button>
                        <Button color="light" className="flex-1 rounded-lg font-black uppercase text-[10px] h-12">Decline</Button>
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default LeavesModule;
