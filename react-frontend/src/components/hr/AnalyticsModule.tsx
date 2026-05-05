import React from 'react';
import { Card, Button, Badge, Progress, Select } from 'flowbite-react';
import { Award, Activity, TrendingUp, Users, DollarSign, Calendar, FileText, Plus } from 'lucide-react';

const AnalyticsModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         {/* Top Level KPIs */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
               { label: 'Total Headcount', val: '142', change: '+4%', icon: <Users size={120}/>, color: 'blue' },
               { label: 'Turnover Rate', val: '5.2%', change: '-1.2%', icon: <Activity size={120}/>, color: 'rose' },
               { label: 'Avg. Time-to-Hire', val: '18 Days', change: '-2d', icon: <Calendar size={120}/>, color: 'emerald' },
               { label: 'Cost-per-Hire', val: '$2,450', change: '+12%', icon: <DollarSign size={120}/>, color: 'amber' }
            ].map((kpi, i) => {
               const colorMap: any = {
                  blue: 'text-blue-600 bg-blue-50',
                  rose: 'text-rose-600 bg-rose-50',
                  emerald: 'text-emerald-600 bg-emerald-50',
                  amber: 'text-amber-600 bg-amber-50'
               };
               const currentColors = colorMap[kpi.color] || 'text-blue-600 bg-blue-50';
               
               return (
                  <Card key={i} className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
                     <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all ${currentColors.split(' ')[0]}`}>
                        {kpi.icon}
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                     <h4 className="text-3xl font-black dark:text-white mb-4">{kpi.val}</h4>
                     <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           {kpi.change}
                        </span>
                        <span className="text-[8px] font-black text-gray-400 uppercase">vs Last Quarter</span>
                     </div>
                  </Card>
               );
            })}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Workforce Forecasting */}
            <Card className="lg:col-span-2 p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-blue-600">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h4 className="font-black text-xl dark:text-white">Workforce Forecasting</h4>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Projected Headcount vs Operational Capacity</p>
                  </div>
                  <Select sizing="sm" className="rounded-lg border-none bg-gray-50 dark:bg-gray-700/50">
                     <option>Next 6 Months</option>
                     <option>Next 12 Months</option>
                  </Select>
               </div>
               <div className="h-64 flex items-end justify-between gap-4 px-4">
                  {[45, 52, 48, 61, 58, 72].map((v, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                        <div className="relative w-full">
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all">{v}%</div>
                           <div className="w-full bg-blue-50 dark:bg-blue-900/10 rounded-lg h-48 overflow-hidden flex flex-col justify-end">
                              <div className="bg-blue-600 w-full rounded-lg transition-all group-hover:bg-indigo-600" style={{ height: `${v}%` }}></div>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">{['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'][i]}</p>
                     </div>
                  ))}
               </div>
            </Card>

            {/* Demographic Breakdown */}
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
               <h4 className="font-black text-xl dark:text-white mb-8">Demographics</h4>
               <div className="space-y-8">
                  {[
                     { label: 'Gen Z (18-24)', val: 24, color: 'blue' },
                     { label: 'Millennials (25-40)', val: 58, color: 'indigo' },
                     { label: 'Gen X (41-55)', val: 12, color: 'emerald' },
                     { label: 'Boomers (56+)', val: 6, color: 'amber' }
                  ].map((d, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="dark:text-gray-300">{d.label}</span>
                           <span className="dark:text-white">{d.val}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                           <div 
                              className={`h-full ${d.color === 'blue' ? 'bg-blue-600' : d.color === 'indigo' ? 'bg-indigo-600' : d.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`} 
                              style={{ width: `${d.val}%` }}
                           ></div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-10 pt-8 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-400">Gender Balance</span>
                     <div className="flex gap-4">
                        <span className="text-blue-600">M: 48%</span>
                        <span className="text-rose-600">F: 52%</span>
                     </div>
                  </div>
               </div>
            </Card>
         </div>

         {/* Reporting Engine */}
         <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
            <div className="flex justify-between items-center mb-10">
               <h4 className="font-black text-xl dark:text-white">Scheduled Executive Reports</h4>
               <Button color="blue" size="sm" className="rounded-lg px-6 font-black uppercase text-[10px]"><Plus size={16} className="mr-2"/> New Schedule</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                  { title: 'Monthly Retention Audit', frequency: 'Monthly', lastRun: 'Apr 01', nextRun: 'May 01' },
                  { title: 'Diversity & Inclusion Pulse', frequency: 'Quarterly', lastRun: 'Mar 15', nextRun: 'Jun 15' },
                  { title: 'Operational Capacity Forecast', frequency: 'Bi-Weekly', lastRun: 'Apr 14', nextRun: 'Apr 28' }
               ].map((report, i) => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-transparent hover:border-blue-600 transition-all cursor-pointer group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white dark:bg-gray-800 text-blue-600 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <FileText size={20}/>
                        </div>
                        <Badge color="info" className="rounded-full">{report.frequency}</Badge>
                     </div>
                     <h5 className="font-black dark:text-white text-sm mb-4">{report.title}</h5>
                     <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        <span>Last: {report.lastRun}</span>
                        <span>Next: {report.nextRun}</span>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>
   );
};

export default AnalyticsModule;
