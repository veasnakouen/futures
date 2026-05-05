import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { DollarSign } from 'lucide-react';

interface PayrollModuleProps {
   globalPayroll: any[];
}

const PayrollModule: React.FC<PayrollModuleProps> = ({ globalPayroll }) => {
   return (
      <Card className="border-none shadow-sm dark:bg-gray-800 rounded-lg overflow-hidden animate-fade-in">
         <div className="p-8 border-b dark:border-gray-700 flex justify-between items-center">
            <h4 className="font-black text-xl dark:text-white">Disbursement Archive</h4>
            <Button color="blue" size="sm" className="rounded-lg px-6">Run Payroll</Button>
         </div>
         <div className="p-8 space-y-4">
            {globalPayroll.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed dark:border-gray-700 rounded-lg">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Disbursement History</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">Execute 'Run Payroll' to generate new records</p>
               </div>
            ) : (
               globalPayroll.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-6 border-2 border-dashed dark:border-gray-700 rounded-lg hover:border-blue-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg"><DollarSign size={24} /></div>
                        <div>
                           <p className="font-black dark:text-white text-lg">{p.month || 'Unknown Month'}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.count || 0} Staff Members</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">${(p.totalAmount || 0).toLocaleString()}</p>
                        <Badge color="success" className="rounded-full px-4 mt-1">{p.status || 'Processed'}</Badge>
                     </div>
                  </div>
               ))
            )}
         </div>
      </Card>
   );
};

export default PayrollModule;
