import { useState, useEffect } from 'react'
import {
   Card, Button, Badge, Spinner, Pagination,
   TextInput, Label, Modal, Textarea, Select, ModalHeader, ModalBody
} from 'flowbite-react'
import {
   Edit, Trash2, Filter, LayoutGrid, List, Camera, Building2, X,
   Search, Plus, MapPin, Phone, Mail, Globe
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const EmployersPage = ({ isDark, setIsDark }: any) => {
   const [employers, setEmployers] = useState<any[]>([]);
   const [jobCategories, setJobCategories] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [goToPageInput, setGoToPageInput] = useState('');
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const PAGE_SIZE = viewMode === 'grid' ? 9 : 10;

   const [formData, setFormData] = useState({
      name: '',
      jobCategoryId: '' as any,
      contactPerson: '',
      contactPhone: '',
      email: '',
      address: '',
      website: '',
      status: 'Active',
      logoUrl: ''
   });

   const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
      fetchEmployers(currentPage - 1, PAGE_SIZE, searchTerm);
   }, [currentPage, searchTerm, viewMode]);

   useEffect(() => {
      api.get('/job-categories').then(res => {
         const data = res.data;
         setJobCategories(Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));
      }).catch(() => { });
   }, []);

   const fetchEmployers = async (page = 0, size = 9, search = '') => {
      try {
         setLoading(true);
         const response = await api.get(`/employers?page=${page}&size=${size}&search=${search}`);
         const data = response.data;
         setEmployers(data.content || (Array.isArray(data) ? data : []));
         setTotalPages(data.totalPages || 1);
      } catch (err) {
         toast.error("Failed to load employers data");
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (isEditMode && editingId) {
            await api.put(`/employers/${editingId}`, formData);
            toast.success("Employer record updated");
         } else {
            await api.post('/employers', formData);
            toast.success("New employer registered");
         }
         setIsModalOpen(false);
         resetForm();
         fetchEmployers();
      } catch (err) {
         toast.error("Failed to save employer");
      }
   };

   const handleEdit = (employer: any) => {
      setFormData({
         name: employer.name || '',
         jobCategoryId: employer.jobCategoryId || '',
         contactPerson: employer.contactPerson || '',
         contactPhone: employer.contactPhone || '',
         email: employer.email || '',
         address: employer.address || '',
         website: employer.website || '',
         status: employer.status || 'Active',
         logoUrl: employer.logoUrl || ''
      });
      setEditingId(employer.id);
      setIsEditMode(true);
      setIsModalOpen(true);
   };

   const confirmDelete = async () => {
      if (!itemToDelete) return;
      try {
         await api.delete(`/employers/${itemToDelete}`);
         toast.success("Employer removed");
         fetchEmployers();
      } catch (err) {
         toast.error("Failed to delete employer");
      }
   };

   const resetForm = () => {
      setFormData({
         name: '',
         jobCategoryId: '',
         contactPerson: '',
         contactPhone: '',
         email: '',
         address: '',
         website: '',
         status: 'Active',
         logoUrl: ''
      });
      setEditingId(null);
      setIsEditMode(false);
   };

   const paginatedEmployers = employers;

   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData({ ...formData, logoUrl: reader.result as string });
         };
         reader.readAsDataURL(file);
      }
   };

   // Reset to page 1 when search or viewMode changes
   useEffect(() => { setCurrentPage(1); }, [searchTerm, viewMode]);

   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Employers Management">
         <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h2 className="text-2xl font-black dark:text-white tracking-tight">Partner Employers</h2>
                  <p className="text-sm text-gray-500 font-medium">Manage corporate partnerships and placement sites</p>
               </div>
               <Button color="blue" onClick={() => { resetForm(); setIsModalOpen(true); }} className="rounded-lg shadow-xl shadow-blue-500/20 px-4">
                  <Plus size={20} className="mr-2" /> Add New Employer
               </Button>
            </header>

            {/* Filters + View Toggle */}
            <Card className="border-none shadow-sm dark:bg-gray-800">
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input
                        type="text"
                        placeholder="Search by company name, contact, or industry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all text-sm"
                     />
                  </div>
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                     <button
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid'
                           ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                           : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                           }`}
                     >
                        <LayoutGrid size={16} />
                        <span className="hidden sm:inline">Grid</span>
                     </button>
                     <button
                        onClick={() => setViewMode('list')}
                        title="List View"
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list'
                           ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                           : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                           }`}
                     >
                        <List size={16} />
                        <span className="hidden sm:inline">List</span>
                     </button>
                  </div>
               </div>
            </Card>

            {/* Employer Grid View */}
            {viewMode === 'grid' && (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                     <div className="col-span-full py-20 flex justify-center"><Spinner size="xl" /></div>
                  ) : paginatedEmployers.map((employer) => (
                     <Card key={employer.id} className="border-none shadow-sm hover:shadow-xl transition-all dark:bg-gray-800 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                           <button onClick={() => handleEdit(employer)} className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              <Edit size={16} />
                           </button>
                           <button onClick={() => { setItemToDelete(employer.id); setIsConfirmOpen(true); }} className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden border dark:border-gray-600 shadow-md">
                                 {employer.logoUrl ? (
                                    <img src={employer.logoUrl} alt={employer.name} className="w-full h-full object-cover" />
                                 ) : (
                                    <Building2 className="text-blue-600" size={28} />
                                 )}
                              </div>
                              <div>
                                 <Badge color={employer.status === 'Active' ? 'success' : 'warning'} className="mb-1 rounded-lg px-2">
                                    {employer.status || 'Active'}
                                 </Badge>
                                 <h3 className="text-lg font-black dark:text-white leading-tight">{employer.name}</h3>
                                 <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{employer.jobCategoryName || 'General'}</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 gap-2 pt-2">
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                 <MapPin size={16} className="shrink-0" /> <span className="truncate">{employer.address || 'No address provided'}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                 <Phone size={16} className="shrink-0" /> <span>{employer.contactPhone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                 <Mail size={16} className="shrink-0" /> <span className="truncate">{employer.email || 'N/A'}</span>
                              </div>
                           </div>
                           <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Person</span>
                                 <span className="text-sm font-bold dark:text-gray-200">{employer.contactPerson || 'N/A'}</span>
                              </div>
                              {employer.website && (
                                 <a href={employer.website} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Globe size={18} />
                                 </a>
                              )}
                           </div>
                        </div>
                     </Card>
                  ))}
                  {employers.length === 0 && !loading && (
                     <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold dark:text-white">No Employers Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or add a new partner.</p>
                     </div>
                  )}
               </div>
            )}

            {/* Employer List View */}
            {viewMode === 'list' && (
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  {loading ? (
                     <div className="py-20 flex justify-center"><Spinner size="xl" /></div>
                  ) : employers.length === 0 ? (
                     <div className="py-20 text-center">
                        <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold dark:text-white">No Employers Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or add a new partner.</p>
                     </div>
                  ) : (
                     <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {/* List Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 dark:bg-gray-700/30">
                           <div className="col-span-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</div>
                           <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</div>
                           <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</div>
                           <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</div>
                           <div className="col-span-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</div>
                           <div className="col-span-1 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</div>
                        </div>
                        {paginatedEmployers.map((employer) => (
                           <div key={employer.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors group items-center">
                              {/* Company */}
                              <div className="md:col-span-4 flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden border dark:border-gray-600 shadow-sm shrink-0">
                                    {employer.logoUrl ? (
                                       <img src={employer.logoUrl} alt={employer.name} className="w-full h-full object-cover" />
                                    ) : (
                                       <Building2 className="text-blue-600" size={18} />
                                    )}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white truncate">{employer.name}</p>
                                    <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                       <Mail size={10} /> {employer.email || 'no-email'}
                                    </p>
                                 </div>
                              </div>
                              {/* Category */}
                              <div className="md:col-span-2">
                                 <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
                                    {employer.jobCategoryName || 'General'}
                                 </span>
                              </div>
                              {/* Contact Person */}
                              <div className="md:col-span-2 text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
                                 {employer.contactPerson || '—'}
                              </div>
                              {/* Phone */}
                              <div className="md:col-span-2 text-sm text-gray-500 flex items-center gap-1.5">
                                 <Phone size={13} className="text-gray-400 shrink-0" />
                                 {employer.contactPhone || '—'}
                              </div>
                              {/* Status */}
                              <div className="md:col-span-1">
                                 <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${employer.status === 'Active'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${employer.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                                       }`} />
                                    {employer.status || 'Active'}
                                 </span>
                              </div>
                              {/* Actions */}
                              <div className="md:col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleEdit(employer)} className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Edit size={14} />
                                 </button>
                                 <button onClick={() => { setItemToDelete(employer.id); setIsConfirmOpen(true); }} className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {/* Pagination Footer */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               Page <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> of {totalPages}
            </p>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Go to</span>
               <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={goToPageInput}
                  placeholder={String(currentPage)}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onBlur={() => {
                     const val = parseInt(goToPageInput);
                     if (!isNaN(val) && val >= 1 && val <= totalPages) setCurrentPage(val);
                     setGoToPageInput('');
                  }}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        const val = parseInt(goToPageInput);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) setCurrentPage(val);
                        setGoToPageInput('');
                        (e.target as HTMLInputElement).blur();
                     }
                  }}
                  className="w-12 h-8 px-1 text-center text-xs font-bold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
               />
            </div>
            {totalPages > 1 && (
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                  showIcons
                  className="pagination-premium"
               />
            )}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
               <ModalHeader className="border-none p-0" />
               <ModalBody className="p-0 dark:bg-gray-800">
                  <div className="p-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-2xl font-black dark:text-white leading-tight">{isEditMode ? 'Modify Partner' : 'Register Employer'}</h3>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Corporate Node Activation</p>
                        </div>
                        <div className="relative group">
                           <div className="w-20 h-20 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                              {formData.logoUrl ? (
                                 <>
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    <button
                                       type="button"
                                       onClick={(e) => { e.preventDefault(); setFormData({ ...formData, logoUrl: '' }); }}
                                       className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                       <X size={12} />
                                    </button>
                                 </>
                              ) : (
                                 <Building2 className="text-gray-300" size={32} />
                              )}
                           </div>
                           <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg cursor-pointer shadow-lg hover:bg-blue-700 transition-all">
                              <Camera size={14} />
                              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                           </label>
                        </div>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2">
                              <Label className="mb-1 block">Company Name</Label>
                              <TextInput
                                 required
                                 value={formData.name}
                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                           </div>
                           <div>
                              <Label className="mb-1 block">Industry / Category</Label>
                              <Select
                                 value={formData.jobCategoryId}
                                 onChange={(e) => setFormData({ ...formData, jobCategoryId: e.target.value ? parseInt(e.target.value) : '' })}
                              >
                                 <option value="">-- Select Category --</option>
                                 {jobCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                 ))}
                              </Select>
                           </div>
                           <div>
                              <Label className="mb-1 block">Status</Label>
                              <Select
                                 value={formData.status}
                                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              >
                                 <option>Active</option>
                                 <option>Inactive</option>
                              </Select>
                           </div>
                           <div>
                              <Label className="mb-1 block">Contact Person</Label>
                              <TextInput
                                 value={formData.contactPerson}
                                 onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                              />
                           </div>
                           <div>
                              <Label className="mb-1 block">Contact Phone</Label>
                              <TextInput
                                 value={formData.contactPhone}
                                 onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              />
                           </div>
                           <div>
                              <Label className="mb-1 block">Email</Label>
                              <TextInput
                                 type="email"
                                 value={formData.email}
                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                           </div>
                           <div>
                              <Label className="mb-1 block">Website</Label>
                              <TextInput
                                 value={formData.website}
                                 onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                              />
                           </div>
                           <div className="md:col-span-2">
                              <Label className="mb-1 block">Address</Label>
                              <Textarea
                                 rows={3}
                                 value={formData.address}
                                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              />
                           </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                           <Button color="blue" type="submit" className="flex-1 font-bold">
                              {isEditMode ? 'Update Record' : 'Save Employer'}
                           </Button>
                           <Button color="gray" onClick={() => setIsModalOpen(false)}>
                              Cancel
                           </Button>
                        </div>
                     </form>
                  </div>
               </ModalBody>
            </Modal>
            <ConfirmModal
               show={isConfirmOpen}
               onClose={() => setIsConfirmOpen(false)}
               onConfirm={confirmDelete}
               message="Are you sure you want to delete this employer? This will also remove all linked job vacancies."
            />
         </div >
      </Layout >
   )
}

export default EmployersPage;
