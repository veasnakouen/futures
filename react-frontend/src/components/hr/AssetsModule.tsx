import React from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import { Monitor, Cpu, Plus } from 'lucide-react';

interface AssetsModuleProps {
   globalAssets: any[];
}

const AssetsModule: React.FC<AssetsModuleProps> = ({ globalAssets }) => {
   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black dark:text-white">Inventory Management</h3>
            <Button color="blue" size="sm" className="rounded-lg"><Plus size={16} className="mr-2"/> Assign Asset</Button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalAssets.length === 0 ? (
               <div className="col-span-full py-20 text-center border-2 border-dashed dark:border-gray-700 rounded-lg">
                  <Monitor size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Assets Registered</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">Initialize inventory nodes to track equipment</p>
               </div>
            ) : (
               globalAssets.map((a, i) => (
                  <Card key={i} className="border-none shadow-sm dark:bg-gray-800 rounded-lg p-8 hover:shadow-lg transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-blue-600 rounded-lg">
                           {a.type === 'Laptop' ? <Cpu size={24}/> : <Monitor size={24}/>}
                        </div>
                        <Badge color={a.status === 'Assigned' ? 'success' : 'info'} className="rounded-full px-4">{a.status || 'Active'}</Badge>
                     </div>
                     <h4 className="font-black dark:text-white text-lg">{a.name || 'Unnamed Asset'}</h4>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">S/N: {a.serial || 'N/A'}</p>
                     <div className="mt-8 pt-6 border-t dark:border-gray-700">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Currently Held By</p>
                        <p className="font-black text-blue-600 mt-1">{a.employeeName || 'Unassigned'}</p>
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default AssetsModule;
