import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { Clock, FileText, MapPin, Zap, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { 
   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
   CartesianGrid, Cell
} from 'recharts';

interface AttendanceModuleProps {
   globalAttendance: any[];
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ globalAttendance }) => {
   return (
      <div className="space-y-6 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 rounded-lg dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">On Premises</p>
               <h4 className="text-3xl font-black dark:text-white">12</h4>
            </Card>
            <Card className="p-6 rounded-lg dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Overtime Hours</p>
               <h4 className="text-3xl font-black text-blue-600">42.5h</h4>
            </Card>
            <Card className="p-6 rounded-lg dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">OT Payout Est.</p>
               <h4 className="text-3xl font-black text-emerald-500">$850</h4>
            </Card>
            <div className="flex flex-col gap-2">
               <Button color="blue" className="rounded-lg h-12 shadow-lg shadow-blue-500/20 font-black uppercase text-[10px]">
                  <Clock size={16} className="mr-2" /> Manual Log
               </Button>
               <Button color="light" className="rounded-lg h-12 font-black uppercase text-[10px]">
                  <FileText size={16} className="mr-2" /> Attendance Audit
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm h-[300px]">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <TrendingUp size={14} className="text-blue-600" /> Weekly Presence Trends
                  </h4>
                  <Badge color="info">Last 7 Days</Badge>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                     { day: 'Mon', count: 42 },
                     { day: 'Tue', count: 38 },
                     { day: 'Wed', count: 45 },
                     { day: 'Thu', count: 40 },
                     { day: 'Fri', count: 35 },
                     { day: 'Sat', count: 12 },
                     { day: 'Sun', count: 8 },
                  ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                     <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {[42, 38, 45, 40, 35, 12, 8].map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry > 30 ? '#3b82f6' : '#94a3b8'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </Card>
            
            <div className="flex flex-col gap-6">
               <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg w-full">
                  <button className="flex-1 py-3 bg-white dark:bg-gray-600 rounded-lg text-[10px] font-black uppercase shadow-sm">Matrix</button>
                  <button className="flex-1 py-3 text-gray-400 text-[10px] font-black uppercase">Schedule</button>
                  <button className="flex-1 py-3 text-gray-400 text-[10px] font-black uppercase">Reports</button>
               </div>
               <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                  <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Punctuality Score</h5>
                  <h3 className="text-4xl font-black">94.8%</h3>
                  <p className="text-[10px] font-bold mt-4 opacity-80">+2.1% improvement from last week's aggregate</p>
                  <div className="mt-8 flex gap-2">
                     <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[94.8%]"></div>
                     </div>
                  </div>
               </Card>
            </div>
         </div>

         <Card className="border-none shadow-sm dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-8 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
               <h4 className="font-black text-xl dark:text-white">Attendance Matrix</h4>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                     <span className="text-[10px] font-black text-gray-400 uppercase">Fingerprint Linked</span>
                  </div>
                  <div className="flex gap-2">
                     <Badge color="success" className="rounded-full">Present</Badge>
                     <Badge color="warning" className="rounded-full">Late</Badge>
                     <Badge color="failure" className="rounded-full">Absent</Badge>
                  </div>
               </div>
            </div>
            <table className="w-full text-sm text-left">
               <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-700/30">
                  <tr><th className="px-8 py-5">Staff Member</th><th className="px-8 py-5">Shift</th><th className="px-8 py-5">Clock In</th><th className="px-8 py-5">Biometric</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Location</th></tr>
               </thead>
               <tbody className="divide-y dark:divide-gray-700">
                  {globalAttendance.map((log, i) => (
                     <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-8 py-5 font-black dark:text-white">{log.employeeName}</td>
                        <td className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Day Shift (08:00 - 17:00)</td>
                        <td className="px-8 py-5 font-mono text-blue-600 font-bold">{format(new Date(log.clockIn), 'hh:mm a')}</td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-emerald-500">
                              <Zap size={12} fill="currentColor" />
                              <span className="text-[10px] font-black uppercase">Verified</span>
                           </div>
                        </td>
                        <td className="px-8 py-5"><Badge color={log.status === 'Present' ? 'success' : 'warning'} className="rounded-full">{log.status}</Badge></td>
                        <td className="px-8 py-5 text-gray-500 text-xs font-bold text-right flex items-center justify-end gap-2"><MapPin size={12}/> {log.location}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </Card>
      </div>
   );
};

export default AttendanceModule;
