import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { ShieldCheck, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';

const ComplianceModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-l-[12px] border-l-emerald-500">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-lg"><ShieldCheck size={32}/></div>
                  <Badge color="success" className="rounded-full px-4">Compliant</Badge>
               </div>
               <h4 className="font-black dark:text-white text-xl">Governance Status</h4>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">All Regulatory Nodes Active</p>
               <div className="mt-8 pt-8 border-t dark:border-gray-700 flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-gray-400">GDPR Compliance</span>
                  <span className="text-emerald-500">Active</span>
               </div>
               <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-gray-400">Local Labor Laws</span>
                  <span className="text-emerald-500">Active</span>
               </div>
            </Card>

            <Card className="lg:col-span-2 p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black text-xl dark:text-white flex items-center gap-3">
                     <FileText className="text-blue-600" /> Immutable Audit Trail
                  </h4>
                  <div className="flex gap-2">
                     <Button color="light" size="xs" className="rounded-lg">Export CSV</Button>
                     <Button color="blue" size="xs" className="rounded-lg">Advanced Filter</Button>
                  </div>
               </div>
               <div className="space-y-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                  {[
                     { user: 'Admin_Michael', action: 'Modified Payroll DTO', target: 'Salary Scale E-4', time: '12 mins ago', type: 'info' },
                     { user: 'System_Sync', action: 'External ID Mismatch', target: 'Azure AD Connect', time: '45 mins ago', type: 'warning' },
                     { user: 'HR_Sarah', action: 'Document Access', target: 'Legal_Contract_J92.pdf', time: '1h ago', type: 'info' },
                     { user: 'Admin_Michael', action: 'Role Assigned', target: 'Security_Lead', time: '3h ago', type: 'critical' }
                  ].map((log, i) => (
                     <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`w-2 h-2 rounded-full ${log.type === 'critical' ? 'bg-red-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                           <div>
                              <p className="text-xs font-black dark:text-white">{log.action}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{log.user} • {log.target}</p>
                           </div>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{log.time}</p>
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-blue-600">
               <h4 className="font-black text-xl dark:text-white mb-6">RBAC Control Matrix</h4>
               <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8">Manage role-based access control across all HR modules. Ensure that only authorized personnel can view sensitive financial and personal data nodes.</p>
               <div className="grid grid-cols-2 gap-4">
                  <Button color="blue" className="rounded-lg h-12 font-black uppercase text-[10px]">Permission Grid</Button>
                  <Button color="light" className="rounded-lg h-12 font-black uppercase text-[10px]">MFA Health Check</Button>
               </div>
            </Card>
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-rose-600">
               <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3"><ShieldAlert className="text-rose-600"/> Security Fortification</h4>
               <div className="flex items-center gap-8 bg-rose-50 dark:bg-rose-900/10 p-6 rounded-lg">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-rose-600 shadow-sm"><AlertTriangle size={32}/></div>
                  <div>
                     <p className="text-lg font-black dark:text-white leading-tight">System Audit Due</p>
                     <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">Pending Cybersecurity Review</p>
                  </div>
               </div>
               <Button color="blue" className="w-full mt-6 rounded-lg h-12 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20">Execute Security Scan</Button>
            </Card>
         </div>
      </div>
   );
};

export default ComplianceModule;
