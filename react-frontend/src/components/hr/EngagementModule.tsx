import { Award, Activity, Zap, TrendingUp, MessageCircle } from 'lucide-react';
import { Button, Card, Avatar } from 'flowbite-react';
import { 
   ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
   CartesianGrid
} from 'recharts';

const EngagementModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="flex justify-between items-center">
            <div>
               <h3 className="text-2xl font-black dark:text-white">Engagement & Culture Hub</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Nurturing Human Capital & Organizational Spirit</p>
            </div>
            <Button color="blue" className="rounded-lg h-12 px-8 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20"><Award size={18} className="mr-2"/> Post Recognition</Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
               <h4 className="font-black text-xl dark:text-white mb-8">Wall of Recognition</h4>
               <div className="space-y-6">
                  {[
                     { user: 'Michael Jordan', recognition: 'Exceptional Leadership during Q1 systems migration.', badge: 'Trailblazer', time: '2h ago' },
                     { user: 'Sarah Jenkins', recognition: 'Outstanding commitment to employee wellness initiatives.', badge: 'Culture Hero', time: '1d ago' }
                  ].map((rec, i) => (
                     <div key={i} className="p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex gap-6 items-start border-2 border-transparent hover:border-blue-600/30 transition-all">
                        <Avatar rounded size="md" />
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="font-black dark:text-white">{rec.user}</p>
                                 <Badge color="purple" className="w-fit rounded-full mt-1">{rec.badge}</Badge>
                              </div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">{rec.time}</p>
                           </div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">"{rec.recognition}"</p>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            <div className="space-y-8">
               <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl bg-indigo-600 text-white relative overflow-hidden h-[400px]">
                  <Activity size={80} className="absolute -right-4 -bottom-4 opacity-10"/>
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 opacity-60">Engagement Sentiment Score</h4>
                  <div className="flex items-end gap-2 mb-8">
                     <h3 className="text-6xl font-black">4.8</h3>
                     <p className="text-[10px] font-black uppercase opacity-60 mb-2">/ 5.0 Global Pulse</p>
                  </div>
                  
                  <div className="flex-1 h-32 mb-8">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                           { month: 'Jan', score: 4.2 },
                           { month: 'Feb', score: 4.5 },
                           { month: 'Mar', score: 4.3 },
                           { month: 'Apr', score: 4.8 },
                        ]}>
                           <Line type="monotone" dataKey="score" stroke="#fff" strokeWidth={4} dot={{ r: 6, fill: '#fff', strokeWidth: 2 }} />
                           <Tooltip contentStyle={{ background: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="opacity-60">Team Morale Persistence</span>
                        <span>Very High</span>
                     </div>
                     <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[92%] shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                     </div>
                  </div>
               </Card>

               <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
                  <h4 className="font-black text-xl dark:text-white mb-6">Wellness Track</h4>
                  <div className="space-y-4">
                     {[
                        { label: 'Step Challenge', active: 45 },
                        { label: 'Mental Health Days', active: 12 },
                        { label: 'Gym Subsidy', active: 88 }
                     ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                           <span className="text-gray-400">{item.label}</span>
                           <span className="text-blue-600">{item.active} Participants</span>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
         </div>
      </div>
   );
};

export default EngagementModule;
