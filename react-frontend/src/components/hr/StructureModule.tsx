import React from 'react';
import { Card, Button, Avatar, Badge } from 'flowbite-react';
import { Building2, Users, ChevronDown, Plus } from 'lucide-react';

const StructureModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="flex justify-between items-center">
            <div>
               <h3 className="text-2xl font-black dark:text-white">Organization Architecture</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Hierarchical Mapping & Department Nodes</p>
            </div>
            <div className="flex gap-3">
               <Button color="light" className="rounded-lg"><Building2 size={16} className="mr-2"/> Manage Depts</Button>
               <Button color="blue" className="rounded-lg shadow-lg shadow-blue-500/20"><Plus size={16} className="mr-2"/> Add Node</Button>
            </div>
         </div>

         {/* Visual Org Chart Placeholder */}
         <Card className="p-12 rounded-lg dark:bg-gray-800 border-none shadow-xl flex flex-col items-center">
            <div className="relative">
               <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border-4 border-blue-600 shadow-xl flex flex-col items-center w-64">
                  <Avatar rounded size="md" className="mb-4" />
                  <h5 className="font-black dark:text-white">Executive Board</h5>
                  <p className="text-[9px] font-black text-blue-600 uppercase mt-1">Strategic Leadership</p>
               </div>
               
               <div className="h-16 w-1 bg-gray-200 dark:bg-gray-700 mx-auto my-0"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-0">
                  {[
                     { dept: 'Technology & IT', lead: 'David Chen', staff: 12 },
                     { dept: 'Social Operations', lead: 'Maria Garcia', staff: 45 },
                     { dept: 'Finance & Admin', lead: 'Robert Fox', staff: 8 }
                  ].map((dept, i) => (
                     <div key={i} className="flex flex-col items-center">
                        <div className="h-12 w-1 bg-gray-200 dark:bg-gray-700 mb-0"></div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-transparent hover:border-blue-600/30 transition-all cursor-pointer w-60 text-center group">
                           <h6 className="font-black dark:text-white text-sm mb-1">{dept.dept}</h6>
                           <p className="text-[9px] font-bold text-gray-400 uppercase mb-4">{dept.lead} • Head</p>
                           <div className="flex items-center justify-center gap-2 text-blue-600">
                              <Users size={12} />
                              <span className="text-[10px] font-black">{dept.staff} Members</span>
                              <ChevronDown size={12} className="group-hover:translate-y-1 transition-transform" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
               <h4 className="font-black text-lg dark:text-white mb-6">Position Management</h4>
               <div className="space-y-3">
                  {['Senior Social Worker', 'Systems Architect', 'Admin Coordinator'].map((pos, i) => (
                     <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex justify-between items-center">
                        <p className="text-sm font-black dark:text-white">{pos}</p>
                        <Badge color="info" className="rounded-full">4 Openings</Badge>
                     </div>
                  ))}
               </div>
            </Card>
            <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
               <h4 className="font-black text-lg dark:text-white mb-6">Reporting Matrix</h4>
               <p className="text-xs text-gray-400 font-bold leading-relaxed">Dynamic reporting relationship visualization. This graph-based interface allows you to reassign reporting nodes via drag-and-drop orchestration.</p>
               <Button color="light" className="mt-6 rounded-lg w-full">Open Matrix Editor</Button>
            </Card>
         </div>
      </div>
   );
};

export default StructureModule;
