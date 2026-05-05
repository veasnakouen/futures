import { useState, useEffect } from 'react'
import {
   Card, Button, Badge, Spinner, Avatar,
   TextInput, Select, Modal as FlowbiteModal, Label
} from 'flowbite-react'

const Modal = FlowbiteModal as any;
import {
   DollarSign, Download, Printer, Search,
   Filter, TrendingUp, Wallet, ArrowUpRight,
   ChevronRight, Calendar, Users, Briefcase,
   CheckCircle2, Clock
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const PayrollPage = ({ isDark, setIsDark }: any) => {
   const [employees, setEmployees] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [isProcessing, setIsProcessing] = useState(false);

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         setLoading(true);
         const response = await api.get('/employees');
         const data = response.data;
         setEmployees(data.content || (Array.isArray(data) ? data : []));
      } catch (err) {
         console.error("Failed to fetch payroll data");
      } finally {
         setLoading(false);
      }
   };

   const calculateTotalPayroll = () => {
      return employees.reduce((acc, emp) => acc + (parseFloat(emp?.basicSalary) || 0), 0);
   };

   const handleProcessPayroll = async () => {
      setIsProcessing(true);
      try {
         await api.post('/api/hr/payroll/process');
         toast.success("Payroll processed successfully for all active employees!");
      } catch (err) {
         toast.error("Failed to process payroll");
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Financial & Payroll">
         <div className="space-y-8 animate-fade-in pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                     <Wallet className="text-emerald-500" /> Payroll Engine
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">Monthly compensation management and financial auditing</p>
               </div>
               <div className="flex gap-3">
                  <Button color="light" className="rounded-lg"><Download size={18} className="mr-2" /> Export Audit</Button>
                  <Button color="blue" onClick={handleProcessPayroll} disabled={isProcessing} className="rounded-lg shadow-lg shadow-blue-500/20">
                     {isProcessing ? <Spinner size="sm" className="mr-2" /> : <TrendingUp size={18} className="mr-2" />}
                     {isProcessing ? 'Processing...' : 'Run Payroll'}
                  </Button>
               </div>
            </header>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Total Payroll (Monthly)</p>
                        <h3 className="text-4xl font-black mt-1">${calculateTotalPayroll().toLocaleString()}</h3>
                     </div>
                     <div className="p-3 bg-white/10 rounded-lg"><DollarSign size={24} /></div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                     <ArrowUpRight size={14} /> 4.2% from last month
                  </div>
               </Card>

               <Card className="border-none shadow-xl dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Payees</p>
                        <h3 className="text-3xl font-black dark:text-white mt-1">{employees.length} Staff</h3>
                     </div>
                     <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Users size={24} /></div>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                     <div className="flex -space-x-2">
                        {employees.slice(0, 4).map((emp, i) => (
                           <Avatar key={i} img={emp.photo} rounded size="xs" className="ring-2 ring-white dark:ring-gray-800" />
                        ))}
                        {employees.length > 4 && <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 ring-2 ring-white">+{employees.length - 4}</div>}
                     </div>
                     <span className="text-xs font-bold text-gray-500">Awaiting disbursement</span>
                  </div>
               </Card>

               <Card className="border-none shadow-xl dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Next Pay Day</p>
                        <h3 className="text-3xl font-black dark:text-white mt-1">May 01, 2024</h3>
                     </div>
                     <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg"><Calendar size={24} /></div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600">
                     <Clock size={14} /> 3 days remaining
                  </div>
               </Card>
            </div>

            {/* Disbursement Table */}
            <Card className="border-none shadow-xl dark:bg-gray-800 rounded-lg overflow-hidden">
               <div className="p-6 border-b dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                  <h4 className="font-black text-xl dark:text-white">Staff Compensation Ledger</h4>
                  <div className="flex gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <TextInput placeholder="Search name..." className="pl-6" value={search} onChange={(e) => setSearch(e.target.value)} />
                     </div>
                     <Button color="gray" className="rounded-lg"><Filter size={18} /></Button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="text-[10px] text-gray-400 uppercase tracking-[0.1em] bg-gray-50/50 dark:bg-gray-700/30 border-b dark:border-gray-700">
                        <tr>
                           <th className="px-8 py-5 font-black">Employee</th>
                           <th className="px-8 py-5 font-black">Contract</th>
                           <th className="px-8 py-5 font-black text-right">Base Salary</th>
                           <th className="px-8 py-5 font-black text-right">Allowances</th>
                           <th className="px-8 py-5 font-black text-right">Net Payable</th>
                           <th className="px-8 py-5 font-black text-center">Status</th>
                           <th className="px-8 py-5 font-black text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                           <tr><td colSpan={7} className="text-center py-20"><Spinner size="xl" /><p className="mt-4 font-bold text-gray-400 animate-pulse">Calculating Ledger...</p></td></tr>
                        ) : employees.filter(e => `${e.firstNameEnglish} ${e.lastNameEnglish}`.toLowerCase().includes(search.toLowerCase())).map((emp) => (
                           <tr key={emp.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                    <Avatar img={emp.photo} rounded size="sm" />
                                    <div>
                                       <p className="font-black text-gray-900 dark:text-white leading-tight">{emp.firstNameEnglish} {emp.lastNameEnglish}</p>
                                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{emp.position?.name || emp.position || 'Staff'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <Briefcase size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold dark:text-gray-300">Full-Time</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right font-mono font-bold dark:text-white">${emp.basicSalary?.toLocaleString() || '0.00'}</td>
                              <td className="px-8 py-5 text-right font-mono text-gray-500">$0.00</td>
                              <td className="px-8 py-5 text-right font-mono font-black text-blue-600 dark:text-blue-400">${emp.basicSalary?.toLocaleString() || '0.00'}</td>
                              <td className="px-8 py-5">
                                 <div className="flex justify-center">
                                    <Badge color="gray" className="rounded-full px-3 uppercase text-[9px] font-black tracking-widest">Pending</Badge>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Printer size={16} /></button>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><ChevronRight size={16} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="p-6 bg-gray-50/50 dark:bg-gray-700/20 border-t dark:border-gray-700 flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-500">Showing {employees.length} disbursements</p>
                  <div className="flex gap-2">
                     <Button color="light" size="xs" className="rounded-lg">Previous</Button>
                     <Button color="light" size="xs" className="rounded-lg">Next</Button>
                  </div>
               </div>
            </Card>
         </div>
      </Layout>
   );
};

export default PayrollPage;
