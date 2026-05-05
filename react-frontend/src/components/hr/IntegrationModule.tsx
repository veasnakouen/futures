import React from 'react';
import { Card, Button, Badge, TextInput, Select, Label } from 'flowbite-react';
import { Settings, Zap, ShieldCheck, Database, Layout, Search, Trash2 } from 'lucide-react';

const IntegrationModule: React.FC = () => {
   return (
      <div className="space-y-8 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SSO & Identity */}
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-blue-600">
               <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" /> Identity & SSO
               </h4>
               <div className="space-y-4">
                  {[
                     { name: 'Azure AD (Entra)', status: 'Connected', icon: 'AZ' },
                     { name: 'Okta Identity', status: 'Standby', icon: 'OK' },
                     { name: 'Google Workspace', status: 'Connected', icon: 'GW' }
                  ].map((idp, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-transparent hover:border-blue-600/30 transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center font-black text-xs shadow-sm">{idp.icon}</div>
                           <p className="text-sm font-black dark:text-white">{idp.name}</p>
                        </div>
                        <Badge color={idp.status === 'Connected' ? 'success' : 'info'} className="rounded-full">{idp.status}</Badge>
                     </div>
                  ))}
               </div>
               <Button color="light" className="w-full mt-6 rounded-lg h-12 font-black uppercase text-[10px]">Configure SAML 2.0</Button>
            </Card>

            {/* Third Party Ops */}
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-indigo-600">
               <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3">
                  <Zap className="text-indigo-600" /> Strategic API Links
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { name: 'Slack Enterprise', type: 'Messaging' },
                     { name: 'MS Teams', type: 'Collaboration' },
                     { name: 'QuickBooks', type: 'Accounting' },
                     { name: 'Checkr', type: 'Background' }
                  ].map((app, i) => (
                     <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-transparent hover:border-indigo-600/30 transition-all group cursor-pointer text-center">
                        <p className="text-[10px] font-black dark:text-white group-hover:text-indigo-600 transition-colors">{app.name}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1">{app.type}</p>
                     </div>
                  ))}
               </div>
               <Button color="blue" className="w-full mt-8 rounded-lg h-12 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20">Explore App Directory</Button>
            </Card>

            {/* Webhook Manager */}
            <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl border-t-8 border-t-emerald-500">
               <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3">
                  <Database className="text-emerald-500" /> Webhook Manager
               </h4>
               <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center border-l-4 border-l-emerald-500">
                     <div>
                        <p className="text-[10px] font-black dark:text-white truncate max-w-[120px]">https://api.payroll.com/sync</p>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Event: Onboarding_Complete</p>
                     </div>
                     <Badge color="success">POST</Badge>
                  </div>
               </div>
               <div className="space-y-3">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">Register New Endpoint</Label>
                  <TextInput placeholder="https://your-service.com/webhook" className="rounded-lg h-10 text-xs" />
                  <Button color="light" size="xs" className="w-full rounded-lg">Add Hook</Button>
               </div>
            </Card>
         </div>

         {/* Custom Schema Builder */}
         <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h4 className="font-black text-xl dark:text-white flex items-center gap-3">
                     <Layout className="text-blue-600" /> Dynamic Schema & Field Mapping
                  </h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Extend System Data Model without code</p>
               </div>
               <Button color="blue" size="sm" className="rounded-lg px-8 font-black uppercase text-[10px]">Add Custom Field</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="p-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed dark:border-gray-700 group hover:border-blue-600/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-4 bg-white dark:bg-gray-800 text-blue-600 rounded-lg shadow-sm"><Settings size={24}/></div>
                     <Badge color="info">Persistent</Badge>
                  </div>
                  <h5 className="font-black dark:text-white mb-2 text-lg">Employee_TShirt_Size</h5>
                  <p className="text-xs text-gray-400 font-bold mb-6">Data Type: Dropdown (S, M, L, XL, XXL)</p>
                  <div className="flex gap-2">
                     <Button color="light" size="xs" className="rounded-lg flex-1">Mapping</Button>
                     <Button color="light" size="xs" className="rounded-lg text-red-500 hover:text-red-600"><Trash2 size={16}/></Button>
                  </div>
               </div>
            </div>
         </Card>
      </div>
   );
};

export default IntegrationModule;
