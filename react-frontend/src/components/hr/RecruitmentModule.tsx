import React from 'react';
import { Card, Button, Badge, Progress } from 'flowbite-react';
import { Zap, Search, Users, Calendar, ArrowRight } from 'lucide-react';

const RecruitmentModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
               { label: 'Active Vacancies', val: '12', icon: <Search/>, color: 'blue' },
               { label: 'Total Applicants', val: '458', icon: <Users/>, color: 'indigo' },
               { label: 'Interviews Today', val: '8', icon: <Calendar/>, color: 'emerald' },
               { label: 'Time to Fill', val: '14d', icon: <Zap/>, color: 'amber' }
            ].map((stat, i) => (
               <Card key={i} className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex justify-between items-end">
                     <h4 className="text-3xl font-black dark:text-white">{stat.val}</h4>
                     <div className={`p-2 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 rounded-lg`}>{stat.icon}</div>
                  </div>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-l-[12px] border-l-indigo-600">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black text-xl dark:text-white flex items-center gap-3">
                     <Zap className="text-indigo-600" /> Neural Candidate Screening
                  </h4>
                  <Badge color="purple" className="rounded-full px-4">AI Engine Active</Badge>
               </div>
               <div className="space-y-4">
                  {[
                     { name: 'Sarah Connor', position: 'Lead Dev', score: 98, status: 'Top Match' },
                     { name: 'John Doe', position: 'Social Worker', score: 92, status: 'High Match' },
                     { name: 'Jane Smith', position: 'Admin', score: 85, status: 'Qualified' }
                  ].map((c, i) => (
                     <div key={i} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center group cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-all border-2 border-transparent hover:border-indigo-600/30">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600">SC</div>
                           <div>
                              <p className="font-black dark:text-white">{c.name}</p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.position}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right w-32">
                              <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                                 <span className="text-gray-400">Match Score</span>
                                 <span className="text-indigo-600">{c.score}%</span>
                              </div>
                              <Progress progress={c.score} color="indigo" size="sm" />
                           </div>
                           <Badge color="info" className="rounded-full">{c.status}</Badge>
                           <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all" />
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
               <h4 className="font-black text-xl dark:text-white mb-6">Talent Pipeline</h4>
               <div className="space-y-6">
                  {[
                     { stage: 'Sourced', count: 124, color: 'blue' },
                     { stage: 'Screening', count: 42, color: 'indigo' },
                     { stage: 'Interview', count: 18, color: 'emerald' },
                     { stage: 'Offer', count: 4, color: 'amber' }
                  ].map((s, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className={`w-3 h-12 rounded-full bg-${s.color}-600`}></div>
                        <div className="flex-1">
                           <div className="flex justify-between items-end mb-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.stage}</p>
                              <p className="font-black dark:text-white">{s.count}</p>
                           </div>
                           <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                              <div className={`h-full bg-${s.color}-600 rounded-full`} style={{ width: `${(s.count / 124) * 100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               <Button color="blue" className="w-full mt-10 rounded-lg h-12 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20">Open Full ATS</Button>
            </Card>
         </div>
      </div>
   );
};

export default RecruitmentModule;
