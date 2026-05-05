import React from 'react';
import { Card, TextInput, Select, Badge, Spinner, Button, Avatar } from 'flowbite-react';
import { Search, LayoutGrid, List, TrendingUp, Users, Edit3, Trash2, ChevronRight } from 'lucide-react';

interface WorkforceDirectoryProps {
   search: string;
   setSearch: (val: string) => void;
   viewMode: 'grid' | 'list';
   setViewMode: (mode: 'grid' | 'list') => void;
   deptFilter: string;
   setDeptFilter: (val: string) => void;
   statusFilter: string;
   setStatusFilter: (val: string) => void;
   contractFilter: string;
   setContractFilter: (val: string) => void;
   stats: any;
   loading: boolean;
   filteredEmployees: any[];
   handleEdit: (emp: any) => void;
   handleDelete: (id: number) => void;
   handleViewDetails: (emp: any) => void;
   getStatusColor: (status: string) => any;
   currentPage: number;
   totalPages: number;
   setCurrentPage: (page: number) => void;
}

const WorkforceDirectory: React.FC<WorkforceDirectoryProps> = ({
   search, setSearch, viewMode, setViewMode,
   deptFilter, setDeptFilter, statusFilter, setStatusFilter,
   contractFilter, setContractFilter, stats, loading,
   filteredEmployees, handleEdit, handleDelete, handleViewDetails, getStatusColor,
   currentPage, totalPages, setCurrentPage
}) => {
   return (
      <div className="space-y-6 animate-fade-in">
         <Card className="border-none shadow-sm dark:bg-gray-800 rounded-lg p-8">
            <div className="flex flex-col gap-6">
               <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-1 gap-2">
                     <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <TextInput
                           placeholder="Search by name, ID, position, or email..."
                           className="pl-12 rounded-lg border-none bg-gray-50 dark:bg-gray-700/50 h-14"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                        />
                     </div>
                     <div className="flex bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg">
                        <button onClick={() => setViewMode('grid')} className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><List size={18} /></button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700">
                  <Select className="rounded-lg border-none bg-gray-50 dark:bg-gray-700/50" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                     <option value="">All Departments</option>
                     <option value="IT">IT & Systems</option>
                     <option value="Social">Social Work</option>
                     <option value="Admin">Administration</option>
                     <option value="Finance">Financial Services</option>
                  </Select>
                  <Select className="rounded-lg border-none bg-gray-50 dark:bg-gray-700/50" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                     <option value="">Any Status</option>
                     <option value="Active">Active</option>
                     <option value="Probation">Probation</option>
                     <option value="On Leave">On Leave</option>
                     <option value="Terminated">Terminated</option>
                  </Select>
                  <Select className="rounded-lg border-none bg-gray-50 dark:bg-gray-700/50" value={contractFilter} onChange={(e) => setContractFilter(e.target.value)}>
                     <option value="">Any Contract</option>
                     <option value="Full-Time">Full-Time</option>
                     <option value="Part-Time">Part-Time</option>
                     <option value="Contractor">Contractor</option>
                     <option value="Intern">Intern</option>
                  </Select>
                  <div className="flex items-center gap-2 px-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                     <TrendingUp size={14} className="text-blue-600" />
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Found: {stats.total} Staff</p>
                  </div>
               </div>
            </div>
         </Card>

         <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar animate-fade-in">
            <div className="flex-shrink-0 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-[10px] font-black dark:text-gray-300 uppercase tracking-widest">{stats.active} Active Personnel</p>
            </div>
            <div className="flex-shrink-0 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
               <p className="text-[10px] font-black dark:text-gray-300 uppercase tracking-widest">{stats.probation} In Probation</p>
            </div>
            <div className="flex-shrink-0 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <p className="text-[10px] font-black dark:text-gray-300 uppercase tracking-widest">{stats.fullTime} Full-Time Core</p>
            </div>
         </div>

         {loading ? (
            <div className="flex justify-center py-24"><Spinner size="xl" /></div>
         ) : filteredEmployees.length === 0 ? (
            <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed dark:border-gray-700 animate-fade-in">
               <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={40} className="text-blue-600" />
               </div>
               <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Personnel Node Offline</h3>
               <p className="text-sm font-bold text-gray-400 mt-2 max-w-sm mx-auto">The workforce directory is currently empty. Execute the 'Onboard Staff' protocol or seed the database to initialize personnel records.</p>
               <Button color="blue" onClick={() => window.location.reload()} className="mt-8 mx-auto rounded-lg px-8 font-black uppercase text-[10px] h-12 shadow-lg shadow-blue-500/20">
                  Reload Directory
               </Button>
            </div>
         ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredEmployees.map((emp) => (
                  <Card key={emp.id} className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all dark:bg-gray-800 rounded-lg pt-8">
                     <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => handleEdit(emp)} className="p-2.5 bg-white dark:bg-gray-700 hover:bg-blue-50 text-blue-600 rounded-lg shadow-lg border dark:border-gray-600"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(emp.id)} className="p-2.5 bg-white dark:bg-gray-700 hover:bg-red-50 text-red-600 rounded-lg shadow-lg border dark:border-gray-600"><Trash2 size={14} /></button>
                     </div>
                     <div className="flex flex-col items-center pb-8 px-6">
                        <div className="relative mb-6">
                           <div className="w-24 h-24 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 overflow-hidden border-4 border-white dark:border-gray-700 shadow-inner">
                              {emp.photo ? <img src={emp.photo} className="w-full h-full object-cover" alt="Profile" /> : <Users size={40} />}
                           </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white text-center leading-none">{emp.firstNameEnglish} {emp.lastNameEnglish}</h3>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">{emp.position?.name || emp.position || 'Staff'}</p>
                        <Badge color={getStatusColor(emp.status)} className="mt-4 rounded-full px-4 text-[9px] font-black uppercase tracking-widest">{emp.status || 'Active'}</Badge>
                        <Button color="blue" onClick={() => handleViewDetails(emp)} className="w-full mt-8 rounded-lg font-black text-[10px] uppercase tracking-widest h-12 shadow-md">
                           Open Portal <ChevronRight size={14} className="ml-2" />
                        </Button>
                     </div>
                  </Card>
               ))}
            </div>
         ) : (
            <Card className="border-none shadow-sm dark:bg-gray-800 overflow-hidden rounded-lg">
               <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-700/30 border-b dark:border-gray-700">
                     <tr><th className="px-8 py-5">Personnel</th><th className="px-8 py-5">ID</th><th className="px-8 py-5">Dept</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                     {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                           <td className="px-8 py-5"><div className="flex items-center gap-3"><Avatar img={emp.photo} rounded size="sm" /><p className="font-black dark:text-white">{emp.firstNameEnglish} {emp.lastNameEnglish}</p></div></td>
                           <td className="px-8 py-5 font-mono text-xs font-bold text-gray-500">{emp.idNo}</td>
                           <td className="px-8 py-5 text-xs font-bold dark:text-gray-400">{emp.department}</td>
                           <td className="px-8 py-5"><Badge color={getStatusColor(emp.status)} className="rounded-full">{emp.status}</Badge></td>
                           <td className="px-8 py-5 text-right"><Button color="light" size="xs" className="rounded-lg" onClick={() => handleViewDetails(emp)}>Portal</Button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </Card>
         )}

         {/* Pagination Footer */}
         {!loading && totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6 animate-slide-up">
               <div className="flex items-center gap-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     Resource Page <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> of {totalPages}
                  </p>
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Enterprise Stream Active</p>
               </div>

               <div className="flex items-center gap-4">
                  <button
                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                     disabled={currentPage === 1}
                     className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-30 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border dark:border-gray-600"
                  >
                     Previous
                  </button>
                  <div className="flex gap-1">
                     {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Simple logic to show only few pages if totalPages is large
                        if (totalPages > 5) {
                           if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                              if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                              return null;
                           }
                        }
                        return (
                           <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg text-[10px] font-black transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-blue-600 border dark:border-gray-600'}`}
                           >
                              {pageNum}
                           </button>
                        );
                     })}
                  </div>
                  <button
                     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                     disabled={currentPage === totalPages}
                     className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-30 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border dark:border-gray-600"
                  >
                     Next
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default WorkforceDirectory;
