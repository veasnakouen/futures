import React from 'react';
import { Card, Button, Badge, Progress } from 'flowbite-react';
import { Award, Play, CheckCircle, Clock } from 'lucide-react';

const TrainingModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black dark:text-white">LMS & Development Hub</h3>
            <div className="flex gap-4 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg">
               <button className="px-6 py-2 bg-white dark:bg-gray-600 rounded-lg text-[10px] font-black uppercase shadow-sm">My Catalog</button>
               <button className="px-6 py-2 text-gray-400 text-[10px] font-black uppercase">Admin Dashboard</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { title: 'Cybersecurity Fundamentals', provider: 'Internal Compliance', duration: '2h 15m', progress: 100, status: 'Completed' },
               { title: 'Advanced Social Work Ethics', provider: 'Board of Ethics', duration: '8h 00m', progress: 45, status: 'In Progress' },
               { title: 'Data Privacy & GDPR', provider: 'Global Standard', duration: '4h 30m', progress: 0, status: 'Not Started' }
            ].map((course, i) => (
               <Card key={i} className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all dark:bg-gray-800 rounded-lg p-0">
                  <div className="h-40 bg-gradient-to-br from-indigo-500 to-blue-700 p-8 flex flex-col justify-end">
                     <div className="absolute top-4 right-4 text-white/40"><Award size={40}/></div>
                     <Badge color={course.status === 'Completed' ? 'success' : 'warning'} className="w-fit mb-3 rounded-full">{course.status}</Badge>
                     <h4 className="text-white font-black text-lg leading-tight">{course.title}</h4>
                  </div>
                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock size={12}/> {course.duration}</span>
                        <span>{course.provider}</span>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                           <span className="dark:text-gray-300">Completion</span>
                           <span className="text-blue-600">{course.progress}%</span>
                        </div>
                        <Progress progress={course.progress} color="blue" size="sm" />
                     </div>
                     <Button color={course.status === 'Completed' ? 'light' : 'blue'} className="w-full rounded-lg font-black uppercase text-[10px] h-12">
                        {course.status === 'Completed' ? <CheckCircle size={16} className="mr-2"/> : <Play size={16} className="mr-2"/>}
                        {course.status === 'Completed' ? 'Review Content' : 'Resume Learning'}
                     </Button>
                  </div>
               </Card>
            ))}
         </div>

         <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-emerald-500">
            <h4 className="font-black text-xl dark:text-white mb-6">Certification Pipeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center">
                     <Award size={32}/>
                  </div>
                  <div>
                     <p className="font-black dark:text-white text-lg">Next Audit Deadline</p>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">December 31, 2024</p>
                  </div>
               </div>
               <div className="flex flex-col justify-center">
                  <p className="text-xs text-gray-400 font-bold leading-relaxed mb-4">You have 3 certifications expiring within the next 90 days. Please ensure all required personnel complete their mandatory refreshers.</p>
                  <Button color="light" size="sm" className="rounded-lg w-fit">View Expiry Report</Button>
               </div>
            </div>
         </Card>
      </div>
   );
};

export default TrainingModule;
