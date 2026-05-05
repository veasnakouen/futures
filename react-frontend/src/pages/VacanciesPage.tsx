import { useState, useEffect } from 'react'
import { Button, Spinner, Pagination } from 'flowbite-react'
import { Plus, Briefcase } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

// Modular Components
import VacancyFilters from '../components/vacancies/VacancyFilters'
import VacancyCard from '../components/vacancies/VacancyCard'
import VacancyFormModal from '../components/vacancies/VacancyFormModal'
import ApplyClientModal from '../components/vacancies/ApplyClientModal'
import QuickEmployerModal from '../components/vacancies/QuickEmployerModal'

const VacanciesPage = ({ isDark, setIsDark }: any) => {
   const [vacancies, setVacancies] = useState<any[]>([]);
   const [employers, setEmployers] = useState<any[]>([]);
   const [clients, setClients] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   // Modals
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

   const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
   const [applyForm, setApplyForm] = useState({
      clientId: '',
      placementDate: new Date().toISOString().split('T')[0]
   });
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<number | null>(null);

   const [quickEmployerData, setQuickEmployerData] = useState({
      name: '',
      contactPerson: ''
   });

   const [formData, setFormData] = useState({
      employerId: '' as any,
      jobPositionId: '' as any,
      jobCategoryId: '' as any,
      salary: '',
      positionAvailable: 1,
      contractType: '',
      closingDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      location: '',
      imageUrl: ''
   });

   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const PAGE_SIZE = 10;

   useEffect(() => {
      fetchData(currentPage - 1, PAGE_SIZE, searchTerm);
      fetchClients();
   }, [currentPage, searchTerm]);

   const fetchData = async (page = 0, size = 10, search = '') => {
      try {
         setLoading(true);
         const [vRes, eRes] = await Promise.all([
            api.get(`/vacancies?page=${page}&size=${size}&search=${search}`),
            api.get('/employers')
         ]);
         const vData = vRes.data;
         const eData = eRes.data;
         setVacancies(vData.content || (Array.isArray(vData) ? vData : []));
         setTotalPages(vData.totalPages || 1);
         setEmployers(eData.content || (Array.isArray(eData) ? eData : []));
      } catch (err) {
         toast.error("Failed to load vacancies data");
      } finally {
         setLoading(false);
      }
   };

   const fetchClients = async () => {
      try {
         const res = await api.get('/clients');
         setClients(res.data.content || res.data || []);
      } catch (err) {
         console.error("Failed to fetch clients");
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (isEditMode && editingId) {
            await api.put(`/vacancies/${editingId}`, formData);
            toast.success("Job vacancy updated");
         } else {
            await api.post('/vacancies', formData);
            toast.success("New job vacancy posted");
         }
         setIsModalOpen(false);
         resetForm();
         fetchData();
      } catch (err) {
         toast.error("Failed to save vacancy");
      }
   };

   const handleApplySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedVacancy || !applyForm.clientId) return;

      try {
         const placementData = {
            clientId: parseInt(applyForm.clientId),
            companyName: selectedVacancy.employerName,
            salary: selectedVacancy.salary,
            placementDate: applyForm.placementDate,
            placementType: 'Employment',
            status: 'Active',
            jobPositionId: selectedVacancy.jobPositionId
         };
         await api.post('/placements', placementData);
         setIsApplyModalOpen(false);
         setApplyForm({ clientId: '', placementDate: new Date().toISOString().split('T')[0] });
         toast.success("Application successful! Client has been placed.");
      } catch (err) {
         toast.error("Failed to create placement record.");
      }
   };

   const handleQuickEmployerSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const response = await api.post('/employers', quickEmployerData);
         const newEmployer = response.data;
         await fetchData();
         setFormData({ ...formData, employerId: newEmployer.id });
         setIsEmployerModalOpen(false);
         setQuickEmployerData({ name: '', contactPerson: '' });
         toast.success("Employer added and selected");
      } catch (err) {
         toast.error("Failed to save quick employer");
      }
   };

   const handleEdit = (vacancy: any) => {
      setFormData({
         employerId: vacancy.employerId || '',
         jobPositionId: vacancy.jobPositionId || '',
         jobCategoryId: vacancy.jobCategoryId || '',
         salary: vacancy.salary || '',
         positionAvailable: vacancy.positionAvailable || 1,
         contractType: vacancy.contractType || '',
         closingDate: vacancy.closingDate || new Date().toISOString().split('T')[0],
         status: vacancy.status || 'Open',
         location: vacancy.location || '',
         imageUrl: vacancy.imageUrl || '',
      });
      setEditingId(vacancy.id);
      setIsEditMode(true);
      setIsModalOpen(true);
   };

   const handleDelete = (id: number) => {
      setItemToDelete(id);
      setIsConfirmOpen(true);
   };

   const confirmDelete = async () => {
      if (!itemToDelete) return;
      try {
         await api.delete(`/vacancies/${itemToDelete}`);
         toast.success("Vacancy removed");
         fetchData();
      } catch (err) {
         toast.error("Failed to delete vacancy");
      } finally {
         setIsConfirmOpen(false);
         setItemToDelete(null);
      }
   };

   const resetForm = () => {
      setFormData({
         employerId: '',
         jobPositionId: '',
         jobCategoryId: '',
         salary: '',
         positionAvailable: 1,
         contractType: '',
         closingDate: new Date().toISOString().split('T')[0],
         status: 'Open',
         location: '',
         imageUrl: ''
      });
      setEditingId(null);
      setIsEditMode(false);
   };


   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Job Vacancies">
         <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
            <header className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600 text-white rounded-lg shadow-xl shadow-blue-500/20">
                     <Briefcase size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black dark:text-white tracking-tight">Active Opportunities</h2>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connecting Clients to Labour Market Nodes
                     </p>
                  </div>
               </div>
               <Button color="blue" onClick={() => { resetForm(); setIsModalOpen(true); }} className="rounded-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]">
                  <Plus size={20} className="mr-2" /> Post New Vacancy
               </Button>
            </header>

            <VacancyFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="space-y-6">
               {loading ? (
                  <div className="py-32 flex flex-col items-center justify-center text-gray-500">
                     <Spinner size="xl" />
                     <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em]">Accessing Opportunity Grid...</p>
                  </div>
               ) : vacancies.length > 0 ? (
                  vacancies.map((vacancy) => (
                     <VacancyCard
                        key={vacancy.id}
                        vacancy={vacancy}
                        onApply={(v) => { setSelectedVacancy(v); setIsApplyModalOpen(true); }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                     />
                  ))
               ) : (
                  <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
                     <Briefcase size={64} className="mx-auto text-gray-200 mb-6 opacity-20" />
                     <h3 className="text-2xl font-black dark:text-white uppercase tracking-widest">No Active Nodes</h3>
                     <p className="text-xs text-gray-400 font-bold mt-2 uppercase">The opportunity grid is currently awaiting new broadcasts.</p>
                  </div>
               )}
            </div>

            {/* Pagination Footer */}
            {!loading && vacancies.length > 0 && totalPages > 1 && (
               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm px-8 py-6 flex justify-center items-center gap-6 animate-slide-up">
                  <Pagination 
                     currentPage={currentPage} 
                     totalPages={totalPages} 
                     onPageChange={setCurrentPage} 
                     showIcons 
                     className="pagination-premium"
                  />
               </div>
            )}

            <VacancyFormModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               isEditMode={isEditMode}
               formData={formData}
               setFormData={setFormData}
               handleSubmit={handleSubmit}
               employers={employers}
               onQuickEmployer={() => setIsEmployerModalOpen(true)}
            />

            <ApplyClientModal
               isOpen={isApplyModalOpen}
               onClose={() => setIsApplyModalOpen(false)}
               selectedVacancy={selectedVacancy}
               clients={clients}
               applyForm={applyForm}
               setApplyForm={setApplyForm}
               handleApplySubmit={handleApplySubmit}
            />

            <QuickEmployerModal
               isOpen={isEmployerModalOpen}
               onClose={() => setIsEmployerModalOpen(false)}
               quickEmployerData={quickEmployerData}
               setQuickEmployerData={setQuickEmployerData}
               handleSubmit={handleQuickEmployerSubmit}
            />

            <ConfirmModal
               show={isConfirmOpen}
               onClose={() => setIsConfirmOpen(false)}
               onConfirm={confirmDelete}
               message="Are you sure you want to decommission this vacancy broadcast? This will terminate all active application links."
            />
         </div>
      </Layout>
   )
}

export default VacanciesPage;
