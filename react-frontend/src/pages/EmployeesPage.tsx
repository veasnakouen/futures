import { useState, useEffect } from 'react'
import { Button } from 'flowbite-react'
import {
   Users, Clock, Calendar, LayoutGrid, List, Building2,
   Activity, Award, Monitor, Zap, Settings, ShieldCheck,
   TrendingUp, DollarSign, Plus,
   CalendarCheck
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { subDays, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

// Modular Components
import WorkforceDirectory from '../components/hr/WorkforceDirectory'
import AttendanceModule from '../components/hr/AttendanceModule'
import LeavesModule from '../components/hr/LeavesModule'
import AnalyticsModule from '../components/hr/AnalyticsModule'
import PayrollModule from '../components/hr/PayrollModule'
import AssetsModule from '../components/hr/AssetsModule'
import RecruitmentModule from '../components/hr/RecruitmentModule'
import StructureModule from '../components/hr/StructureModule'
import TrainingModule from '../components/hr/TrainingModule'
import ComplianceModule from '../components/hr/ComplianceModule'
import IntegrationModule from '../components/hr/IntegrationModule'
import AutomationModule from '../components/hr/AutomationModule'
import EngagementModule from '../components/hr/EngagementModule'

import EmployeeRegistrationModal from '../components/hr/EmployeeRegistrationModal'
import EmployeeDetailModal from '../components/hr/EmployeeDetailModal'
import AnalyticsModal from '../components/hr/AnalyticsModal'

const EmployeesPage = ({ isDark, setIsDark }: any) => {
   const [employees, setEmployees] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const [statusFilter, setStatusFilter] = useState('');
   const [contractFilter, setContractFilter] = useState('');
   const [search, setSearch] = useState('');
   const [deptFilter, setDeptFilter] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const itemsPerPage = 12;

   // Page Module State
   const [activeModule, setActiveModule] = useState<'directory' | 'attendance' | 'leaves' | 'analytics' | 'payroll' | 'assets' | 'recruitment' | 'structure' | 'training' | 'compliance' | 'portal' | 'manager' | 'scheduling' | 'retention' | 'succession' | 'wellness' | 'automation' | 'engagement' | 'integrations'>('directory');

   // Modals & Selection
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
   const [portalTab, setPortalTab] = useState<'profile' | 'attendance' | 'leave' | 'performance' | 'payroll' | 'assets'>('profile');

   // Related Data (Global)
   const [globalAttendance, setGlobalAttendance] = useState<any[]>([]);
   const [globalLeaves, setGlobalLeaves] = useState<any[]>([]);
   const [globalAssets, setGlobalAssets] = useState<any[]>([]);
   const [globalPayroll, setGlobalPayroll] = useState<any[]>([]);

   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<number | null>(null);

   const [formData, setFormData] = useState({
      firstNameEnglish: '',
      lastNameEnglish: '',
      firstNameKhmer: '',
      lastNameKhmer: '',
      gender: 'Male',
      dateOfBirth: '',
      idNo: '',
      email: '',
      phoneNumber: '',
      address: '',
      department: 'General',
      position: 'Staff',
      joinDate: new Date().toISOString().split('T')[0],
      contractType: 'Full-Time',
      status: 'Active',
      basicSalary: 0,
      bankName: '',
      bankAccountNumber: '',
      emergencyContactName: '',
      emergencyContact: '',
      emergencyContactPhone: '',
      photo: '',
      title: 'Mr',
      placeOfBirth: '',
      country: 'Cambodia',
      nationality: 'Khmer',
      bloodGroup: '',
      manager: '',
      maritalStatus: 'Single',
      children: '0',
      identityCardNumber: '',
      identityCardType: 'National ID',
      note: '',
      contractStartDate: '',
      contractEndDate: '',
      probationEndDate: '',
      customFields: [] as any[]
   });

   const [regTab, setRegTab] = useState<'personal' | 'employment' | 'financial' | 'emergency' | 'custom'>('personal');

   useEffect(() => {
      fetchEmployees(currentPage - 1, itemsPerPage, search, deptFilter, statusFilter, contractFilter);
   }, [currentPage, search, deptFilter, statusFilter, contractFilter]);

   useEffect(() => {
      fetchGlobalData();
   }, []);

   const fetchEmployees = async (page = 0, size = 12, searchTerms = '', dept = '', status = '', contract = '') => {
      try {
         setLoading(true);
         const response = await api.get(`/employees?page=${page}&size=${size}&search=${searchTerms}&dept=${dept}&status=${status}&contract=${contract}`);
         const data = response.data;
         setEmployees(data.content || (Array.isArray(data) ? data : []));
         setTotalPages(data.totalPages || 1);
      } catch (err) {
         console.error("Failed to fetch employees");
      } finally {
         setLoading(false);
      }
   };

   const fetchGlobalData = () => {
      setGlobalAttendance([
         { employeeName: 'Sarah Conner', clockIn: subDays(new Date(), 0).setHours(8, 30), status: 'Present', location: 'Office' },
         { employeeName: 'John Wick', clockIn: subDays(new Date(), 0).setHours(8, 45), status: 'Present', location: 'Field' },
         { employeeName: 'Elena Gilbert', clockIn: subDays(new Date(), 0).setHours(9, 15), status: 'Late', location: 'Office' }
      ]);
      setGlobalLeaves([
         { employeeName: 'Elena Gilbert', startDate: '2024-04-10', endDate: '2024-04-12', type: 'Sick', status: 'Approved' },
         { employeeName: 'Tony Stark', startDate: '2024-05-01', endDate: '2024-05-05', type: 'Annual', status: 'Pending' }
      ]);
      setGlobalAssets([
         { name: 'MacBook Air', serial: 'MBA-9901', employeeName: 'Sarah Conner', status: 'Assigned', type: 'Laptop' },
         { name: 'iPhone 15', serial: 'IP-8822', employeeName: 'John Wick', status: 'Assigned', type: 'Mobile' }
      ]);
      setGlobalPayroll([
         { month: 'March 2024', totalAmount: 12500, status: 'Disbursed', count: 12 },
         { month: 'February 2024', totalAmount: 11800, status: 'Disbursed', count: 11 }
      ]);
   };

   const seedDemoData = () => {
      const demoEmployees = [
         { id: 101, firstNameEnglish: 'Sarah', lastNameEnglish: 'Conner', idNo: 'MTP-001', email: 'sarah.c@mtp.org', department: 'IT', position: 'CTO', status: 'Active', basicSalary: 3500, phoneNumber: '+855 12 888 999', photo: 'https://i.pravatar.cc/150?u=sarah' },
         { id: 102, firstNameEnglish: 'John', lastNameEnglish: 'Wick', idNo: 'MTP-002', email: 'j.wick@mtp.org', department: 'Social', position: 'Field Manager', status: 'Active', basicSalary: 1200, phoneNumber: '+855 12 777 666', photo: 'https://i.pravatar.cc/150?u=john' },
         { id: 103, firstNameEnglish: 'Elena', lastNameEnglish: 'Gilbert', idNo: 'MTP-003', email: 'elena.g@mtp.org', department: 'Finance', position: 'Accountant', status: 'On Leave', basicSalary: 950, phoneNumber: '+855 99 111 222', photo: 'https://i.pravatar.cc/150?u=elena' },
         { id: 104, firstNameEnglish: 'Tony', lastNameEnglish: 'Stark', idNo: 'MTP-004', email: 'tony.s@mtp.org', department: 'IT', position: 'Senior Dev', status: 'Active', basicSalary: 4500, phoneNumber: '+855 11 333 444', photo: 'https://i.pravatar.cc/150?u=tony' }
      ];
      setEmployees(demoEmployees);
      toast.success("Demo workforce data seeded!");
   };

   const handleViewDetails = (emp: any) => {
      setSelectedEmployee(emp);
      setPortalTab('profile');
      setIsDetailModalOpen(true);
   };

   const handleEdit = (emp: any) => {
      setFormData({
         firstNameEnglish: emp.firstNameEnglish || '',
         lastNameEnglish: emp.lastNameEnglish || '',
         firstNameKhmer: emp.firstNameKhmer || '',
         lastNameKhmer: emp.lastNameKhmer || '',
         gender: emp.gender || 'Male',
         dateOfBirth: emp.dateOfBirth || '',
         idNo: emp.idNo || '',
         email: emp.email || '',
         phoneNumber: emp.phoneNumber || '',
         address: emp.address || '',
         department: emp.department?.name || emp.department || 'General',
         position: emp.position?.name || emp.position || 'Staff',
         joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
         contractType: emp.contractType || 'Full-Time',
         status: emp.status || 'Active',
         basicSalary: emp.basicSalary || 0,
         bankName: emp.bankName || '',
         bankAccountNumber: emp.bankAccountNumber || '',
         emergencyContactName: emp.emergencyContactName || '',
         emergencyContact: emp.emergencyContact || '',
         emergencyContactPhone: emp.emergencyContactPhone || '',
         photo: emp.photo || '',
         title: emp.title || 'Mr',
         placeOfBirth: emp.placeOfBirth || '',
         country: emp.country || 'Cambodia',
         nationality: emp.nationality || 'Khmer',
         bloodGroup: emp.bloodGroup || '',
         manager: emp.manager || '',
         maritalStatus: emp.maritalStatus || 'Single',
         children: emp.children || '0',
         identityCardNumber: emp.identityCardNumber || '',
         identityCardType: emp.identityCardType || 'National ID',
         note: emp.note || '',
         contractStartDate: emp.contractStartDate || '',
         contractEndDate: emp.contractEndDate || '',
         probationEndDate: emp.probationEndDate || '',
         customFields: (() => {
            if (!emp.customFields) return [];
            if (typeof emp.customFields === 'string') {
               try {
                  return JSON.parse(emp.customFields);
               } catch (e) {
                  return [];
               }
            }
            return emp.customFields;
         })()
      });
      setEditingId(emp.id);
      setIsEditMode(true);
      setRegTab('personal');
      setIsModalOpen(true);
   };

   const handleDelete = (id: number) => {
      setItemToDelete(id);
      setIsConfirmOpen(true);
   };

   const confirmDelete = async () => {
      if (!itemToDelete) return;
      try {
         await api.delete(`/employees/${itemToDelete}`);
         toast.success('Personnel record decommissioned');
         fetchEmployees();
      } catch (err: any) {
         toast.error('Decommission failure: ' + (err.response?.data?.message || 'Server error'));
      }
      setIsConfirmOpen(false);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setLoading(true);
         if (isEditMode && editingId) {
            await api.put(`/employees/${editingId}`, formData);
            toast.success("Personnel record synchronized successfully");
         } else {
            await api.post('/employees', formData);
            toast.success("New staff onboarded successfully");
         }
         fetchEmployees();
         setIsModalOpen(false);
      } catch (err: any) {
         console.error("Submission error:", err);
         toast.error(err.response?.data?.message || "Critical system failure during submission");
      } finally {
         setLoading(false);
      }
   };


   const stats = {
      total: Array.isArray(employees) ? employees.length : 0,
      active: Array.isArray(employees) ? employees.filter(e => e?.status === 'Active').length : 0,
      probation: Array.isArray(employees) ? employees.filter(e => e?.status === 'Probation').length : 0,
      fullTime: Array.isArray(employees) ? employees.filter(e => e?.contractType === 'Full-Time').length : 0
   };

   const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'active': return 'success';
         case 'on leave': return 'warning';
         case 'terminated': return 'failure';
         default: return 'info';
      }
   };

   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Team Directory">
         <div className="space-y-8 max-w-[1600px] mx-auto">
            <header className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600 text-white rounded-lg shadow-xl shadow-blue-500/20">
                     <Activity size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black dark:text-white tracking-tight">HR Command Center</h2>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Node Active: Operational Compliance 98%
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Button color="light" onClick={() => setIsAnalyticsModalOpen(true)} className="rounded-lg border-2 px-4 h-12 font-black uppercase tracking-widest text-[10px]">
                     <TrendingUp size={16} className="mr-2 text-blue-600" /> Analytics
                  </Button>
                  <Button color="light" onClick={seedDemoData} className="rounded-lg border-dashed border-2 px-4 py-1 h-12">
                     <Zap size={16} className="mr-2 text-yellow-500" /> Seed Data
                  </Button>
                  {activeModule === 'directory' && (
                     <Button color="blue" onClick={() => {
                        setIsEditMode(false);
                        setEditingId(null);
                        setFormData({
                           firstNameEnglish: '',
                           lastNameEnglish: '',
                           firstNameKhmer: '',
                           lastNameKhmer: '',
                           gender: 'Male',
                           dateOfBirth: '',
                           idNo: '',
                           email: '',
                           phoneNumber: '',
                           address: '',
                           department: 'General',
                           position: 'Staff',
                           joinDate: new Date().toISOString().split('T')[0],
                           contractType: 'Full-Time',
                           status: 'Active',
                           basicSalary: 0,
                           bankName: '',
                           bankAccountNumber: '',
                           emergencyContactName: '',
                           emergencyContact: '',
                           emergencyContactPhone: '',
                           photo: '',
                           title: 'Mr',
                           placeOfBirth: '',
                           country: 'Cambodia',
                           nationality: 'Khmer',
                           bloodGroup: '',
                           manager: '',
                           maritalStatus: 'Single',
                           children: '0',
                           identityCardNumber: '',
                           identityCardType: 'National ID',
                           note: '',
                           contractStartDate: '',
                           contractEndDate: '',
                           probationEndDate: '',
                           customFields: []
                        });
                        setRegTab('personal');
                        setIsModalOpen(true);
                     }} className="rounded-lg px-8 shadow-lg shadow-blue-500/20 h-12 font-black uppercase tracking-widest text-[10px]">
                        <Plus size={18} className="mr-2" /> Onboard Staff
                     </Button>
                  )}
               </div>
            </header>

            <nav className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg border dark:border-gray-700/50 overflow-x-auto scrollbar-hide no-scrollbar animate-slide-up">
               {[
                  { id: 'directory', label: 'Workforce', icon: <Users size={18} /> },
                  { id: 'attendance', label: 'Attendance', icon: <Clock size={18} /> },
                  { id: 'leaves', label: 'Leaves', icon: <Calendar size={18} /> },
                  { id: 'analytics', label: 'Intelligence', icon: <TrendingUp size={18} /> },
                  { id: 'payroll', label: 'Payroll', icon: <DollarSign size={18} /> },
                  { id: 'assets', label: 'Inventory', icon: <Monitor size={18} /> },
                  { id: 'recruitment', label: 'Recruitment', icon: <Zap size={18} /> },
                  { id: 'structure', label: 'Structure', icon: <Building2 size={18} /> },
                  { id: 'training', label: 'LMS', icon: <Award size={18} /> },
                  { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={18} /> },
                  { id: 'portal', label: 'My Portal', icon: <Activity size={18} /> },
                  { id: 'manager', label: 'Manager Hub', icon: <CalendarCheck size={18} /> },
                  { id: 'scheduling', label: 'Scheduling', icon: <Activity size={18} /> },
                  { id: 'retention', label: 'Retention', icon: <TrendingUp size={18} /> },
                  { id: 'succession', label: 'Succession', icon: <Award size={18} /> },
                  { id: 'wellness', label: 'Wellness', icon: <Activity size={18} /> },
                  { id: 'automation', label: 'AI/Flows', icon: <Zap size={18} /> },
                  { id: 'engagement', label: 'Culture', icon: <Award size={18} /> },
                  { id: 'integrations', label: 'Integrations', icon: <Settings size={18} /> }
               ].map((item) => (
                  <button
                     key={item.id}
                     onClick={() => setActiveModule(item.id as any)}
                     className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-lg text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeModule === item.id ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-lg border dark:border-gray-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30'}`}
                  >
                     {item.icon} {item.label}
                  </button>
               ))}
            </nav>

            <main className="space-y-6">
               {activeModule === 'directory' && (
                  <WorkforceDirectory
                     search={search} setSearch={setSearch}
                     viewMode={viewMode} setViewMode={setViewMode}
                     deptFilter={deptFilter} setDeptFilter={setDeptFilter}
                     statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                     contractFilter={contractFilter} setContractFilter={setContractFilter}
                     stats={stats} loading={loading}
                     filteredEmployees={employees}
                     handleEdit={handleEdit} handleDelete={handleDelete}
                     handleViewDetails={handleViewDetails} getStatusColor={getStatusColor}
                     currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}
                  />
               )}
               {activeModule === 'attendance' && <AttendanceModule globalAttendance={globalAttendance} />}
               {activeModule === 'leaves' && <LeavesModule globalLeaves={globalLeaves} />}
               {activeModule === 'analytics' && <AnalyticsModule />}
               {activeModule === 'payroll' && <PayrollModule globalPayroll={globalPayroll} />}
               {activeModule === 'assets' && <AssetsModule globalAssets={globalAssets} />}
               {activeModule === 'recruitment' && <RecruitmentModule />}
               {activeModule === 'structure' && <StructureModule />}
               {activeModule === 'training' && <TrainingModule />}
               {activeModule === 'compliance' && <ComplianceModule />}
               {activeModule === 'integrations' && <IntegrationModule />}
               {activeModule === 'automation' && <AutomationModule />}
               {activeModule === 'engagement' && <EngagementModule />}
               {/* Placeholders for other modules to keep UX consistent */}
               {!['directory', 'attendance', 'leaves', 'analytics', 'payroll', 'assets', 'recruitment', 'structure', 'training', 'compliance', 'integrations', 'automation', 'engagement'].includes(activeModule) && (
                  <div className="py-24 text-center animate-fade-in">
                     <Settings size={64} className="mx-auto text-gray-300 mb-6 animate-spin-slow" />
                     <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">Module Initializing</h3>
                     <p className="text-xs text-gray-400 font-bold mt-2">Connecting to enterprise data node: {activeModule}</p>
                  </div>
               )}
            </main>
         </div>
         <EmployeeRegistrationModal
            isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
            isEditMode={isEditMode} regTab={regTab} setRegTab={setRegTab}
            formData={formData} setFormData={setFormData}
            handleSubmit={handleSubmit}
         />
         <EmployeeDetailModal
            isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}
            selectedEmployee={selectedEmployee} portalTab={portalTab} setPortalTab={setPortalTab}
         />
         <AnalyticsModal
            isOpen={isAnalyticsModalOpen}
            onClose={() => setIsAnalyticsModalOpen(false)}
         />

         <ConfirmModal
            show={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
            title="Decommission Record"
            message="Are you sure you want to decommission this personnel record? This action is immutable."
         />
      </Layout>
   );
};

export default EmployeesPage;
