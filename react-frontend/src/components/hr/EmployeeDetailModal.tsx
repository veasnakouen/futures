import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Badge, Card, Progress, Spinner } from 'flowbite-react';
import { Users, Clock, Calendar, DollarSign, Monitor, FileText, Award, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { format } from 'date-fns';
import { 
   Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
   CartesianGrid, AreaChart, Area
} from 'recharts';

interface EmployeeDetailModalProps {
   isOpen: boolean;
   onClose: () => void;
   selectedEmployee: any;
   portalTab: string;
   setPortalTab: (tab: any) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
   isOpen, onClose, selectedEmployee, portalTab, setPortalTab
}) => {
   const [attendanceData, setAttendanceData] = useState<any[]>([]);
   const [leaveData, setLeaveData] = useState<any[]>([]);
   const [loadingData, setLoadingData] = useState(false);

   useEffect(() => {
      if (isOpen && selectedEmployee?.id) {
         fetchPortalData();
      }
   }, [isOpen, selectedEmployee, portalTab]);

   const fetchPortalData = async () => {
      // Only fetch if tab matches
      if (portalTab === 'attendance') {
         try {
            setLoadingData(true);
            const res = await api.get(`/hr/attendance/employee/${selectedEmployee.id}`);
            setAttendanceData(res.data || []);
         } catch (err) {
            console.error("Failed to fetch attendance");
         } finally {
            setLoadingData(false);
         }
      } else if (portalTab === 'leave') {
         try {
            setLoadingData(true);
            const res = await api.get(`/hr/leaves/employee/${selectedEmployee.id}`);
            setLeaveData(res.data || []);
         } catch (err) {
            console.error("Failed to fetch leave requests");
         } finally {
            setLoadingData(false);
         }
      }
   };

   const formatDateSafely = (dateStr: string, formatStr: string) => {
      if (!dateStr) return 'N/A';
      try {
         return format(new Date(dateStr), formatStr);
      } catch (e) {
         return dateStr;
      }
   };

   return (
      <Modal show={isOpen} onClose={onClose} size="5xl">
         <ModalHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center gap-4">
               <Avatar img={selectedEmployee?.photo} rounded size="sm" />
               <div>
                  <h3 className="text-xl font-black dark:text-white leading-tight">
                     Personnel Dossier: {selectedEmployee?.firstNameEnglish} {selectedEmployee?.lastNameEnglish}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Record ID: {selectedEmployee?.idNo || 'TEMPORARY'}</p>
               </div>
            </div>
         </ModalHeader>
         <ModalBody className="p-0 dark:bg-gray-800">
            <div className="flex h-[70vh] min-h-[500px] overflow-hidden">
               <div className="w-64 bg-gray-50 dark:bg-gray-700/30 border-r dark:border-gray-700 flex flex-col p-6">
                  <nav className="space-y-1 flex-1">
                     {[
                        { id: 'profile', label: 'Personnel Profile', icon: <Users size={18} /> },
                        { id: 'performance', label: 'Performance & KPI', icon: <Award size={18} /> },
                        { id: 'attendance', label: 'Attendance Log', icon: <Clock size={18} /> },
                        { id: 'leave', label: 'Leave & Time Off', icon: <Calendar size={18} /> },
                        { id: 'payroll', label: 'Compensation', icon: <DollarSign size={18} /> },
                        { id: 'assets', label: 'Company Assets', icon: <Monitor size={18} /> },
                        { id: 'documents', label: 'Documents', icon: <FileText size={18} /> }
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setPortalTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${portalTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                           {item.icon} {item.label}
                        </button>
                     ))}
                  </nav>
               </div>
               <div className="flex-1 p-10 overflow-y-auto bg-white dark:bg-gray-800">
                  <header className="flex justify-between items-center mb-10">
                     <h2 className="text-2xl font-black dark:text-white capitalize">{portalTab} Analysis</h2>
                     <Button color="light" size="sm" onClick={() => window.print()} className="rounded-lg"><FileText size={16} className="mr-2" /> Export Report</Button>
                  </header>
                  
                  <div className="max-w-4xl space-y-10 pb-10">
                     {portalTab === 'profile' && (
                        <div className="space-y-12 animate-fade-in">
                           <section>
                              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Core Identity
                              </h4>
                               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                  {/* Large Profile Photo */}
                                  <div className="col-span-1">
                                     <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-4 border-white dark:border-gray-700 shadow-2xl overflow-hidden group relative">
                                        {selectedEmployee?.photo ? (
                                           <img src={selectedEmployee.photo} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                           <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                              <Users size={48} className="mb-2" />
                                              <p className="text-[8px] font-black uppercase">No Image</p>
                                           </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                           <p className="text-[8px] font-black text-white uppercase tracking-widest">Employee Visual ID</p>
                                        </div>
                                     </div>
                                  </div>

                                  {/* Identity Details */}
                                  <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 bg-gray-50/50 dark:bg-gray-700/20 p-8 rounded-2xl">
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Full Legal Name (EN/KH)</p>
                                         <p className="text-lg font-black dark:text-white leading-tight">
                                            {selectedEmployee?.title} {selectedEmployee?.firstNameEnglish} {selectedEmployee?.lastNameEnglish}
                                            {selectedEmployee?.firstNameKhmer && <span className="block text-sm font-black text-blue-600 mt-1">{selectedEmployee.firstNameKhmer} {selectedEmployee.lastNameKhmer}</span>}
                                         </p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Gender Identity</p>
                                         <p className="text-lg font-black dark:text-white leading-tight">{selectedEmployee?.gender}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Date of Birth</p>
                                         <p className="text-lg font-black dark:text-white leading-tight">{selectedEmployee?.dateOfBirth || 'N/A'}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Nationality</p>
                                         <p className="text-lg font-black dark:text-white leading-tight">{selectedEmployee?.nationality || 'N/A'}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Place of Birth</p>
                                         <p className="text-lg font-black dark:text-white leading-tight">{selectedEmployee?.placeOfBirth || 'N/A'}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Blood Group</p>
                                         <p className="text-lg font-black text-red-600 leading-tight">{selectedEmployee?.bloodGroup || 'O+'}</p>
                                      </div>
                                      <div className="space-y-1 col-span-2">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Residential Address</p>
                                         <p className="text-sm font-bold dark:text-gray-300 leading-tight">{selectedEmployee?.address || 'No address recorded'}</p>
                                      </div>
                                     <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Personnel ID</p>
                                        <p className="text-lg font-black text-blue-600 leading-tight">{selectedEmployee?.idNo}</p>
                                     </div>
                                     <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Primary Contact</p>
                                        <p className="text-lg font-black dark:text-white leading-tight">{selectedEmployee?.phoneNumber}</p>
                                     </div>
                                     <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Staff Email</p>
                                        <p className="text-lg font-black dark:text-white leading-tight truncate">{selectedEmployee?.email}</p>
                                     </div>
                                  </div>
                               </div>
                            </section>

                            <section>
                               <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Career Roadmap
                               </h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-4">Current Designation</p>
                                     <p className="text-2xl font-black dark:text-white">{selectedEmployee?.position?.name || selectedEmployee?.position || 'Staff'}</p>
                                     <div className="mt-6 pt-6 border-t dark:border-gray-700 flex justify-between items-center">
                                         <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Department</p>
                                            <p className="font-black dark:text-gray-300">{selectedEmployee?.department?.name || selectedEmployee?.department || 'General'}</p>
                                         </div>
                                         <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase text-right">Join Date</p>
                                            <p className="font-black dark:text-gray-300 text-right">{selectedEmployee?.joinDate}</p>
                                         </div>
                                      </div>
                                      <div className="mt-4 grid grid-cols-2 gap-4">
                                         <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Contract Period</p>
                                            <p className="text-[10px] font-black dark:text-white truncate">{selectedEmployee?.contractStartDate || 'N/A'} — {selectedEmployee?.contractEndDate || 'Ongoing'}</p>
                                         </div>
                                         <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <p className="text-[8px] font-black text-blue-600 uppercase">Probation End Date</p>
                                            <p className="text-[10px] font-black dark:text-white">{selectedEmployee?.probationEndDate || 'None'}</p>
                                         </div>
                                         <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Supervisor</p>
                                            <p className="text-[10px] font-black dark:text-white">{selectedEmployee?.manager || 'Not Assigned'}</p>
                                         </div>
                                      </div>
                                  </Card>
                                 <div className="space-y-4">
                                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex justify-between items-center border border-emerald-100 dark:border-emerald-900/20">
                                       <div>
                                          <p className="text-[9px] font-black text-emerald-600 uppercase">Employment Status</p>
                                          <p className="font-black dark:text-white">Full-Time Persistent</p>
                                       </div>
                                       <Badge color="success" className="rounded-full px-4">Active</Badge>
                                    </div>
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex justify-between items-center border border-blue-100 dark:border-blue-900/20">
                                       <div>
                                          <p className="text-[9px] font-black text-blue-600 uppercase">Compensation Tier</p>
                                          <p className="font-black dark:text-white">Tier-1 Salary Scale</p>
                                       </div>
                                       <p className="font-black text-lg dark:text-white">${selectedEmployee?.basicSalary?.toLocaleString()}</p>
                                    </div>
                                 </div>
                              </div>
                           </section>

                           {(selectedEmployee?.customFields?.length > 0 || true) && (
                              <section>
                                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Organization Attributes
                                 </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     <div className="p-4 border-2 border-dashed dark:border-gray-700 rounded-lg text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Marital Status</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.maritalStatus || 'Single'}</p>
                                     </div>
                                     <div className="p-4 border-2 border-dashed dark:border-gray-700 rounded-lg text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Children</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.children || '0'}</p>
                                     </div>
                                     <div className="p-4 border-2 border-dashed dark:border-gray-700 rounded-lg text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{selectedEmployee?.identityCardType || 'National ID'}</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.identityCardNumber || 'N/A'}</p>
                                     </div>
                                     {selectedEmployee?.customFields?.length > 0 ? selectedEmployee.customFields.map((f: any, i: number) => (
                                        <div key={i} className="p-4 border-2 border-dashed dark:border-gray-700 rounded-lg text-center">
                                           <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{f.key}</p>
                                           <p className="font-black dark:text-white">{f.value}</p>
                                        </div>
                                     )) : null}
                                  </div>
                              </section>
                           )}

                           <section>
                              <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Emergency Protocol
                              </h4>
                              <div className="p-8 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 flex items-center gap-8">
                                 <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center shadow-inner">
                                    <ShieldCheck size={32} />
                                 </div>
                                 <div className="flex-1 grid grid-cols-3 gap-8">
                                     <div>
                                        <p className="text-[9px] font-black text-red-600/60 uppercase">Primary Contact</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.emergencyContactName || 'Unspecified'}</p>
                                     </div>
                                     <div>
                                        <p className="text-[9px] font-black text-red-600/60 uppercase">Relationship</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.emergencyContact || 'N/A'}</p>
                                     </div>
                                     <div>
                                        <p className="text-[9px] font-black text-red-600/60 uppercase">Crisis Hotline</p>
                                        <p className="font-black dark:text-white">{selectedEmployee?.emergencyContactPhone || 'N/A'}</p>
                                     </div>
                                 </div>
                              </div>
                           </section>
                        </div>
                     )}

                     {portalTab === 'performance' && (
                        <div className="space-y-10 animate-fade-in">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm h-[400px]">
                                 <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Competency Radar</h5>
                                 <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                       { subject: 'Technical', A: 92, fullMark: 100 },
                                       { subject: 'Soft Skills', A: 88, fullMark: 100 },
                                       { subject: 'Punctuality', A: 95, fullMark: 100 },
                                       { subject: 'Leadership', A: 78, fullMark: 100 },
                                       { subject: 'Innovation', A: 85, fullMark: 100 },
                                    ]}>
                                       <PolarGrid stroke="#e2e8f0" />
                                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                       <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                    </RadarChart>
                                 </ResponsiveContainer>
                              </Card>
                              <div className="space-y-6">
                                 <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm bg-blue-600 text-white">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Strategic Performance Note</h5>
                                    <p className="text-sm font-bold leading-relaxed italic">"Exceeded all targets for Q1. Consistently demonstrates high levels of initiative and technical leadership. Recommended for senior-tier mentorship roles."</p>
                                    <div className="mt-8 flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">M</div>
                                       <p className="text-[10px] font-black uppercase">Reviewed by Director of Operations</p>
                                    </div>
                                 </Card>
                                 <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quarterly KPI Growth</h5>
                                    <div className="h-32">
                                       <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={[
                                             { month: 'Jan', val: 75 },
                                             { month: 'Feb', val: 82 },
                                             { month: 'Mar', val: 92 },
                                          ]}>
                                             <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                             </defs>
                                             <Tooltip />
                                             <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                                          </AreaChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </Card>
                              </div>
                           </div>
                        </div>
                     )}

                     {portalTab === 'attendance' && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="flex justify-between items-center">
                              <h4 className="font-black dark:text-white">Recent Attendance Logs</h4>
                              {attendanceData.length > 0 && <Badge color="info">Historical Data Active</Badge>}
                           </div>
                           
                           {loadingData ? (
                              <div className="flex justify-center py-12"><Spinner size="xl" /></div>
                           ) : attendanceData.length === 0 ? (
                              <div className="py-20 text-center border-2 border-dashed dark:border-gray-700 rounded-lg">
                                 <Clock className="mx-auto text-gray-400 mb-4" size={40} />
                                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Attendance Records Found</p>
                              </div>
                           ) : (
                              <div className="space-y-3">
                                 {attendanceData.map((log, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-transparent hover:border-blue-500/30 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Clock size={18}/></div>
                                          <div>
                                             <p className="text-xs font-black dark:text-white">{formatDateSafely(log.clockIn, 'MMM dd, yyyy')}</p>
                                             <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1">
                                                <MapPin size={10} /> {log.location || 'Central Office'}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-xs font-black dark:text-white">
                                             {formatDateSafely(log.clockIn, 'hh:mm a')} - {log.clockOut ? formatDateSafely(log.clockOut, 'hh:mm a') : 'Active'}
                                          </p>
                                          <p className={`text-[8px] font-black uppercase ${log.status === 'Present' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                             {log.status || 'Active Session'}
                                          </p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}

                     {portalTab === 'leave' && (
                        <div className="space-y-10 animate-fade-in">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                 { label: 'Annual Leave', val: 14, total: 18, color: 'blue' },
                                 { label: 'Sick Leave', val: 2, total: 10, color: 'rose' },
                                 { label: 'Emergency', val: 0, total: 5, color: 'amber' }
                              ].map((l, i) => (
                                 <div key={i} className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-2">{l.label}</p>
                                    <h5 className={`text-2xl font-black text-blue-600`}>{l.val} / {l.total}</h5>
                                 </div>
                              ))}
                           </div>
                           <Card className="p-8 rounded-lg dark:bg-gray-800 border-none shadow-sm">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Leave Request History</h5>
                              
                              {loadingData ? (
                                 <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                              ) : leaveData.length === 0 ? (
                                 <div className="py-12 text-center border-2 border-dashed dark:border-gray-700 rounded-lg">
                                    <Calendar className="mx-auto text-gray-400 mb-3" size={32} />
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No Leave History Available</p>
                                 </div>
                              ) : (
                                 <div className="space-y-4">
                                    {leaveData.map((leave, i) => (
                                       <div key={i} className="p-5 bg-gray-50 dark:bg-gray-700/20 rounded-lg flex justify-between items-center">
                                          <div>
                                             <p className="text-xs font-black dark:text-white uppercase">{leave.leaveType || 'General Leave'}</p>
                                             <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                                                {formatDateSafely(leave.startDate, 'MMM dd')} - {formatDateSafely(leave.endDate, 'MMM dd, yyyy')}
                                             </p>
                                          </div>
                                          <Badge color={leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'failure'}>
                                             {leave.status}
                                          </Badge>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </Card>
                        </div>
                     )}

                     {portalTab === 'payroll' && (
                        <div className="space-y-8 animate-fade-in">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card className="p-10 rounded-lg dark:bg-gray-800 border-none shadow-xl bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                                 <div className="flex justify-between items-start mb-8">
                                    <div>
                                       <p className="text-[10px] font-black uppercase opacity-60">Current Base Salary</p>
                                       <h5 className="text-4xl font-black">${selectedEmployee?.basicSalary?.toLocaleString()}</h5>
                                    </div>
                                    <Badge color="info">Pay Grade E-4</Badge>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                                       <p className="text-[8px] font-black uppercase opacity-60">Bank Account</p>
                                       <p className="text-xs font-black">{selectedEmployee?.bankName} • {selectedEmployee?.bankAccountNumber?.slice(-4).padStart(selectedEmployee?.bankAccountNumber?.length || 0, '*') || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                                       <p className="text-[8px] font-black uppercase opacity-60">Last Disbursement</p>
                                       <p className="text-xs font-black">April 30, 2024</p>
                                    </div>
                                 </div>
                              </Card>

                              <Card className="p-8 rounded-lg dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
                                 <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex justify-between">
                                    <span>Detailed Earnings Preview</span>
                                    <span className="text-blue-600">Q2 2024</span>
                                 </h5>
                                 <div className="space-y-4">
                                    {[
                                       { label: 'Basic Monthly Salary', val: selectedEmployee?.basicSalary, type: 'plus' },
                                       { label: 'Technical Allowance', val: 150, type: 'plus' },
                                       { label: 'Seniority Bonus', val: 50, type: 'plus' },
                                       { label: 'Standard Tax Deductions', val: -(selectedEmployee?.basicSalary * 0.05), type: 'minus' },
                                    ].map((item, i) => (
                                       <div key={i} className="flex justify-between items-center text-xs">
                                          <span className="font-bold text-gray-500">{item.label}</span>
                                          <span className={`font-mono font-black ${item.type === 'plus' ? 'text-emerald-500' : 'text-red-500'}`}>
                                             {item.val < 0 ? '-' : '+'}${Math.abs(item.val).toLocaleString()}
                                          </span>
                                       </div>
                                    ))}
                                    <div className="pt-4 border-t-2 border-dashed dark:border-gray-700 flex justify-between items-center">
                                       <span className="text-[10px] font-black uppercase dark:text-white">Estimated Net Payable</span>
                                       <span className="text-xl font-black text-blue-600">${(selectedEmployee?.basicSalary + 200 - (selectedEmployee?.basicSalary * 0.05)).toLocaleString()}</span>
                                    </div>
                                 </div>
                              </Card>
                           </div>
                        </div>
                     )}

                     {portalTab === 'assets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                           {[
                              { name: 'MacBook Pro 16"', sn: 'MP2024-X82', date: 'Jan 2024' },
                              { name: 'Dell UltraSharp 27"', sn: 'DS27-9021', date: 'Jan 2024' }
                           ].map((a, i) => (
                              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center gap-6">
                                 <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg flex items-center justify-center"><Monitor size={24}/></div>
                                 <div>
                                    <p className="text-xs font-black dark:text-white">{a.name}</p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase">S/N: {a.sn}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {portalTab === 'documents' && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xl font-black dark:text-white">Employee Repository</h4>
                              <Button color="blue" size="xs" className="rounded-lg font-black uppercase text-[9px]">Upload New</Button>
                           </div>
                           <div className="grid grid-cols-1 gap-3">
                              {[
                                 { name: 'Employment_Contract_2024.pdf', type: 'PDF', size: '1.2 MB' },
                                 { name: 'Government_ID_Scan.png', type: 'IMG', size: '450 KB' },
                                 { name: 'Bachelor_Degree_Cert.pdf', type: 'PDF', size: '2.8 MB' }
                              ].map((doc, i) => (
                                 <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-transparent hover:border-blue-500/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <p className="font-black dark:text-white text-sm">{doc.name}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.type} • {doc.size}</p>
                                       </div>
                                    </div>
                                    <Button color="light" size="xs" className="rounded-lg">View</Button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </ModalBody>
         <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex justify-between items-center w-full">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidential Personnel Data • Authorized Access Only</p>
               <Button color="gray" onClick={onClose} className="rounded-lg px-8 font-black uppercase text-[10px]">Close Portal</Button>
            </div>
         </ModalFooter>
      </Modal>
   );
};

export default EmployeeDetailModal;
