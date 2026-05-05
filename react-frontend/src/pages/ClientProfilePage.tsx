import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
   Card, Button, Badge, Spinner, Avatar,
   Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Select, Datepicker, Popover
} from 'flowbite-react'

import {
   ArrowLeft, Phone, Mail, MapPin, Calendar, Briefcase,
   ShieldCheck, FileText, User, Plus,
   History, GraduationCap, Award, MoreVertical,
   Edit, Trash2, Heart, ShieldAlert
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const ClientProfilePage = ({ isDark, setIsDark }: any) => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState('Overview');

   // Modals state
   const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
   const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
   const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<{ type: string, id: number } | null>(null);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);

   // Form states
   const [placementForm, setPlacementForm] = useState({
      clientId: id,
      companyName: '',
      salary: '',
      placementDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      placementType: 'Employment'
   });

   const [supportForm, setSupportForm] = useState({
      clientId: id,
      healthProblem: false,
      healthProblemDetail: '',
      drugProblem: false,
      drugProblemDetail: '',
      description: ''
   });

   const [educationForm, setEducationForm] = useState({
      clientId: id,
      schoolName: '',
      currentLevel: 'High School',
      status: 'Completed'
   });

   const handleDateChange = (date: Date | null) => {
      if (date) {
         const dateString = date.toISOString().split('T')[0];
         setPlacementForm({ ...placementForm, placementDate: dateString });
      }
   };

   useEffect(() => {
      fetchProfile();
   }, [id]);

   const fetchProfile = async () => {
      try {
         setLoading(true);
         const response = await api.get(`/clients/${id}/portfolio`);
         setData(response.data);
         setError(null);
      } catch (err) {
         console.error("Profile load error:", err);
         setError("Failed to load client portfolio. Please check your connection.");
      } finally {
         setLoading(false);
      }
   };

   const handleAddPlacement = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const formattedData = {
            ...placementForm,
            placementDate: placementForm.placementDate + " 00:00:00"
         };
         if (isEditMode && editingId) {
            await api.put(`/placements/${editingId}`, formattedData);
         } else {
            await api.post('/placements', formattedData);
         }
         setIsPlacementModalOpen(false);
         fetchProfile();
      } catch (err) {
         console.error("Failed to save placement");
      }
   };

   const handleAddSupport = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (isEditMode && editingId) {
            await api.put(`/social-supports/${editingId}`, supportForm);
         } else {
            await api.post('/social-supports', supportForm);
         }
         setIsSupportModalOpen(false);
         fetchProfile();
      } catch (err) {
         console.error("Failed to save support");
      }
   };

   const handleAddEducation = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (isEditMode && editingId) {
            await api.put(`/educations/${editingId}`, educationForm);
         } else {
            await api.post('/educations', educationForm);
         }
         setIsEducationModalOpen(false);
         toast.success("Education record saved");
         fetchProfile();
      } catch (err) {
         toast.error("Failed to save education");
      }
   };

   const handleDeleteItem = (type: string, id: number) => {
      setItemToDelete({ type, id });
      setIsConfirmOpen(true);
   };

   const confirmDeleteItem = async () => {
      if (!itemToDelete) return;
      try {
         const endpoint = itemToDelete.type === 'placement' ? `/placements/${itemToDelete.id}` :
            itemToDelete.type === 'support' ? `/social-supports/${itemToDelete.id}` :
               `/educations/${itemToDelete.id}`;
         await api.delete(endpoint);
         toast.success(`${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} removed from profile`);
         fetchProfile();
      } catch (err) {
         toast.error(`Failed to delete ${itemToDelete.type}`);
      }
   };

   if (loading) {
      return (
         <Layout isDark={isDark} setIsDark={setIsDark} title="Client Portfolio">
            <div className="flex flex-col items-center justify-center h-[70vh]">
               <Spinner size="xl" />
               <p className="mt-4 text-gray-500 font-medium animate-pulse">Building 360° Portfolio View...</p>
            </div>
         </Layout>
      );
   }

   if (error || !data) {
      return (
         <Layout isDark={isDark} setIsDark={setIsDark} title="Error">
            <div className="max-w-md mx-auto mt-20 text-center">
               <Alert color="failure" className="rounded-lg p-8 shadow-xl">
                  <h3 className="text-lg font-bold mb-2">Portfolio Unavailable</h3>
                  <p className="mb-6">{error}</p>
                  <Button color="gray" onClick={() => navigate('/clients')} className="mx-auto rounded-lg">
                     <ArrowLeft size={18} className="mr-2" /> Back to Client List
                  </Button>
               </Alert>
            </div>
         </Layout>
      );
   }

   const { client, cases, placements, socialSupports, educations } = data;

   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title={`${client.firstName} ${client.lastName}`}>
         <div className="space-y-8 animate-fade-in pb-20">
            {/* Header / Summary Card */}
            <div className="relative">
               <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 rounded-lg shadow-lg"></div>
               <div className="px-8 -mt-20">
                  <Card className="rounded-lg border-none shadow-2xl dark:bg-gray-800">
                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                           <div className="relative group">
                              <Avatar
                                 img={client.photo || '/default.png'}
                                 size="xl"
                                 rounded
                                 className="ring-4 ring-white dark:ring-gray-700 shadow-xl"
                                 placeholderInitials={client.firstName[0] + client.lastName[0]}
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                 <Plus size={24} className="text-white" />
                              </div>
                           </div>
                           <div className="text-center md:text-left">
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                 <h2 className="text-3xl font-black text-gray-900 dark:text-white">{client.firstName} {client.lastName}</h2>
                                 <Badge color={client.status === 'Active' ? 'success' : 'warning'} className="rounded-full px-3 py-1 font-bold">
                                    {client.status || 'Active'}
                                 </Badge>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2 justify-center md:justify-start">
                                 <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">{client.clientCode}</span>
                                 • Registered {client.registerDate ? format(new Date(client.registerDate), 'MMM dd, yyyy') : 'N/A'}
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                           <Button color="blue" onClick={() => navigate(`/clients/${id}/cv`)} className="rounded-lg flex-1 md:flex-none shadow-lg shadow-blue-500/20">
                              <FileText size={18} className="mr-2" /> Generate CV
                           </Button>
                           <Button color="gray" className="rounded-lg flex-1 md:flex-none">
                              <MoreVertical size={18} />
                           </Button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t dark:border-gray-700">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <Phone size={12} /> Phone Number
                           </p>
                           <p className="text-sm font-bold dark:text-gray-200">{client.contactPhone || 'No contact'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <Mail size={12} /> Email Address
                           </p>
                           <p className="text-sm font-bold dark:text-gray-200 truncate">{client.email || 'None'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <MapPin size={12} /> Location
                           </p>
                           <p className="text-sm font-bold dark:text-gray-200">{client.province || client.address || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <Calendar size={12} /> Date of Birth
                           </p>
                           <p className="text-sm font-bold dark:text-gray-200">
                              {client.dateOfBirth ? format(new Date(client.dateOfBirth), 'dd MMM yyyy') : 'Unknown'}
                           </p>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>

            {/* Main Content Tabs */}
            <div className="px-4">
               <div className="flex border-b dark:border-gray-700 mb-6 gap-6 overflow-x-auto">
                  {['Overview', 'Social Support', 'CV & Education'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold transition-all border-b-2 px-1 whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>

               <div className="animate-fade-in">
                  {activeTab === 'Overview' && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                        {/* Left: Quick Stats & Timeline */}
                        <div className="lg:col-span-2 space-y-8">
                           <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                              <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                 <History className="text-blue-600" /> Interaction Timeline
                              </h3>
                              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                                 {cases.map((c: any, i: number) => (
                                    <div key={i} className="relative">
                                       <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 text-blue-600">
                                          <ShieldCheck size={10} />
                                       </div>
                                       <div>
                                          <p className="font-bold text-[10px] uppercase tracking-widest text-blue-500 mb-1">
                                             {format(new Date(c.openDate), 'MMM dd, yyyy')}
                                          </p>
                                          <h4 className="text-base font-black dark:text-white mb-1">
                                             {c.serviceType}: {c.subject}
                                          </h4>
                                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                             {c.description}
                                          </p>
                                          <Badge color="info" className="mt-2 inline-flex">{c.status}</Badge>
                                       </div>
                                    </div>
                                 ))}
                                 <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 text-gray-500">
                                       <User size={10} />
                                    </div>
                                    <div>
                                       <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                          {client.registerDate ? format(new Date(client.registerDate), 'MMM dd, yyyy') : 'N/A'}
                                       </p>
                                       <h4 className="text-base font-black dark:text-white">Account Created</h4>
                                       <p className="text-sm text-gray-500">Initial registration in {client.branch} branch.</p>
                                    </div>
                                 </div>
                              </div>
                           </Card>

                           <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800 overflow-hidden">
                              <div className="flex justify-between items-center mb-6">
                                 <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Briefcase className="text-emerald-500" /> Placement History
                                 </h3>
                                 <Button color="success" size="xs" onClick={() => { setIsEditMode(false); setPlacementForm({ clientId: id, companyName: '', salary: '', placementDate: new Date().toISOString().split('T')[0], status: 'Active', placementType: 'Employment' }); setIsPlacementModalOpen(true); }} className="rounded-lg">
                                    <Plus size={16} className="mr-1" /> Record Placement
                                 </Button>
                              </div>
                              <div className="overflow-x-auto">
                                 <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-700/30 dark:text-gray-400 border-b dark:border-gray-700">
                                       <tr>
                                          <th className="px-6 py-4 font-bold">Company</th>
                                          <th className="px-6 py-4 font-bold">Date</th>
                                          <th className="px-6 py-4 font-bold">Salary</th>
                                          <th className="px-6 py-4 font-bold">Status</th>
                                          <th className="px-6 py-4 font-bold text-right">Action</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                       {placements.length === 0 ? (
                                          <tr><td colSpan={5} className="text-center py-8 text-gray-400 italic">No placements recorded.</td></tr>
                                       ) : placements.map((p: any, i: number) => (
                                          <tr key={i} className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                             <td className="px-6 py-4 font-bold dark:text-white">{p.companyName}</td>
                                             <td className="px-6 py-4 text-xs">{p.placementDate ? format(new Date(p.placementDate), 'MMM yyyy') : 'N/A'}</td>
                                             <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{p.salary || 'N/A'}</td>
                                             <td className="px-6 py-4"><Badge color={p.status === 'Active' ? 'success' : 'gray'}>{p.status}</Badge></td>
                                             <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                   <button onClick={() => {
                                                      setPlacementForm({
                                                         clientId: p.clientId,
                                                         companyName: p.companyName || '',
                                                         salary: p.salary || '',
                                                         placementDate: p.placementDate ? p.placementDate.split('T')[0] : '',
                                                         status: p.status || 'Active',
                                                         placementType: p.placementType || 'Employment'
                                                      });
                                                      setEditingId(p.id);
                                                      setIsEditMode(true);
                                                      setIsPlacementModalOpen(true);
                                                   }} className="p-2 text-blue-400 hover:text-blue-600">
                                                      <Edit size={16} />
                                                   </button>
                                                   <button onClick={() => handleDeleteItem('placement', p.id)} className="p-2 text-red-400 hover:text-red-600">
                                                      <Trash2 size={16} />
                                                   </button>
                                                </div>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </Card>
                        </div>

                        {/* Right: Personal Details & Documents */}
                        <div className="space-y-8">
                           <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                              <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">Vital Information</h3>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender</span>
                                    <span className="text-sm font-bold dark:text-gray-200">{client.gender}</span>
                                 </div>
                                 <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Marital Status</span>
                                    <span className="text-sm font-bold dark:text-gray-200">{client.maritalStatus || 'Single'}</span>
                                 </div>
                                 <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID Card</span>
                                    <span className="text-sm font-bold dark:text-gray-200 font-mono">{client.idCard || 'N/A'}</span>
                                 </div>
                                 <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nationality</span>
                                    <span className="text-sm font-bold dark:text-gray-200">{client.nationality || 'Khmer'}</span>
                                 </div>
                                 <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Physical</span>
                                    <span className="text-sm font-bold dark:text-gray-200">{client.height || '-'} cm / {client.weight || '-'} kg</span>
                                 </div>
                              </div>
                           </Card>

                           <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                              <div className="flex items-center justify-between mb-6">
                                 <h3 className="font-black text-lg text-gray-900 dark:text-white">Attachments</h3>
                                 <Button color="light" size="xs" className="rounded-lg"><Plus size={14} /></Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 {[
                                    { label: 'Photo ID', icon: <User />, color: 'blue' },
                                    { label: 'Contract', icon: <FileText />, color: 'emerald' },
                                    { label: 'ID Poor', icon: <Award />, color: 'orange' },
                                    { label: 'CV', icon: <GraduationCap />, color: 'violet' }
                                 ].map((doc, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 flex flex-col items-center gap-2 group cursor-pointer hover:border-blue-400 transition-all">
                                       <div className="p-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm group-hover:scale-110 transition-transform">
                                          {doc.icon}
                                       </div>
                                       <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{doc.label}</span>
                                    </div>
                                 ))}
                              </div>
                           </Card>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Social Support' && (
                     <div className="pt-6 space-y-6">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xl font-black dark:text-white">Health & Wellbeing Support</h3>
                           <Button color="blue" onClick={() => { setIsEditMode(false); setSupportForm({ clientId: id, healthProblem: false, healthProblemDetail: '', drugProblem: false, drugProblemDetail: '', description: '' }); setIsSupportModalOpen(true); }} className="rounded-lg shadow-lg shadow-blue-500/20">
                              <Plus size={18} className="mr-2" /> New Support Entry
                           </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {socialSupports.map((s: any, i: number) => (
                              <Card key={i} className="rounded-lg border-none shadow-lg dark:bg-gray-800 relative group">
                                 <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                       onClick={() => {
                                          setSupportForm({
                                             clientId: s.clientId,
                                             healthProblem: s.healthProblem,
                                             healthProblemDetail: s.healthProblemDetail || '',
                                             drugProblem: s.drugProblem,
                                             drugProblemDetail: s.drugProblemDetail || '',
                                             description: s.description || ''
                                          });
                                          setEditingId(s.id);
                                          setIsEditMode(true);
                                          setIsSupportModalOpen(true);
                                       }}
                                       className="p-2 text-blue-400 hover:text-blue-600"
                                    >
                                       <Edit size={16} />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteItem('support', s.id)}
                                       className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                                 <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                       <ShieldAlert className={s.healthProblem || s.drugProblem ? 'text-red-500' : 'text-emerald-500'} size={18} />
                                       Support Assessment #{s.id}
                                    </h4>
                                 </div>
                                 <div className="space-y-4">
                                    <div className={`p-4 rounded-lg ${s.healthProblem ? 'bg-red-50 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                                       <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
                                          <Heart size={12} /> Health Support
                                       </p>
                                       <p className="text-sm dark:text-gray-200">{s.healthProblemDetail || 'No health issues reported.'}</p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${s.drugProblem ? 'bg-orange-50 dark:bg-orange-900/10' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                                       <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
                                          <ShieldAlert size={12} /> Drug Assistance
                                       </p>
                                       <p className="text-sm dark:text-gray-200">{s.drugProblemDetail || 'No history of drug issues.'}</p>
                                    </div>
                                 </div>
                              </Card>
                           ))}
                           {socialSupports.length === 0 && (
                              <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                 <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                 <p className="text-gray-500 font-bold">No social support records found for this client.</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {activeTab === 'CV & Education' && (
                     <div className="pt-6 space-y-6">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xl font-black dark:text-white">Academic & Professional Development</h3>
                           <Button color="indigo" onClick={() => { setIsEditMode(false); setEducationForm({ clientId: id, schoolName: '', currentLevel: 'High School', status: 'Completed' }); setIsEducationModalOpen(true); }} className="rounded-lg shadow-lg shadow-indigo-500/20">
                              <Plus size={18} className="mr-2" /> Add Education Record
                           </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {educations?.map((edu: any, i: number) => (
                              <Card key={i} className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative">
                                 <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                       onClick={() => {
                                          setEducationForm({
                                             clientId: edu.clientId,
                                             schoolName: edu.schoolName || '',
                                             currentLevel: edu.currentLevel || 'High School',
                                             status: edu.status || 'Completed'
                                          });
                                          setEditingId(edu.id);
                                          setIsEditMode(true);
                                          setIsEducationModalOpen(true);
                                       }}
                                       className="p-2 text-blue-400 hover:text-blue-600"
                                    >
                                       <Edit size={16} />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteItem('education', edu.id)}
                                       className="p-2 text-gray-400 hover:text-red-500"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                       <GraduationCap size={24} />
                                    </div>
                                    <div>
                                       <h4 className="font-black text-gray-900 dark:text-white">{edu.schoolName}</h4>
                                       <p className="text-sm text-gray-500 font-bold uppercase tracking-wider text-[10px]">{edu.currentLevel}</p>
                                    </div>
                                 </div>
                              </Card>
                           ))}
                           {(educations?.length === 0 || !educations) && (
                              <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                 <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                                 <p className="text-gray-500 font-bold">Education history is currently empty.</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* --- MODALS --- */}

            {/* Placement Modal */}
            <Modal show={isPlacementModalOpen} onClose={() => setIsPlacementModalOpen(false)} size="lg">
               <ModalHeader className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <h3 className="text-xl font-bold dark:text-white">{isEditMode ? 'Update Placement' : 'Record New Placement'}</h3>
               </ModalHeader>
               <ModalBody className="p-8 bg-white dark:bg-gray-800">
                  <form onSubmit={handleAddPlacement} className="space-y-6 pb-96">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                           <Label className="mb-1 block">Company Name</Label>
                           <TextInput
                              required
                              value={placementForm.companyName}
                              onChange={(e) => setPlacementForm({ ...placementForm, companyName: e.target.value })}
                           />
                        </div>
                        <div>
                           <Label className="mb-1 block">Placement Type</Label>
                           <Select
                              value={placementForm.placementType}
                              onChange={(e) => setPlacementForm({ ...placementForm, placementType: e.target.value })}
                           >
                              <option>Employment</option>
                              <option>Internship</option>
                              <option>Vocational Training</option>
                           </Select>
                        </div>
                        <div>
                           <Label className="mb-1 block">Monthly Salary</Label>
                           <TextInput
                              value={placementForm.salary}
                              onChange={(e) => setPlacementForm({ ...placementForm, salary: e.target.value })}
                              placeholder="e.g. $250"
                           />
                        </div>
                        <div>
                           <Label className="mb-1 block">Start Date</Label>
                           <Popover
                              content={
                                 <div className="p-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
                                    <Datepicker 
                                       inline={true}
                                       value={placementForm.placementDate ? new Date(placementForm.placementDate) : new Date()}
                                       onChange={handleDateChange}
                                    />
                                 </div>
                              }
                              placement="top"
                              trigger="click"
                           >
                              <div className="group relative cursor-pointer">
                                 <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg group-hover:border-blue-400 transition-all">
                                    <span className={`text-sm font-bold ${placementForm.placementDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                       {placementForm.placementDate ? format(new Date(placementForm.placementDate), 'MMM dd, yyyy') : 'Select Date...'}
                                    </span>
                                    <Calendar size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                 </div>
                              </div>
                           </Popover>
                        </div>
                        <div>
                           <Label className="mb-1 block">Status</Label>
                           <Select
                              value={placementForm.status}
                              onChange={(e) => setPlacementForm({ ...placementForm, status: e.target.value })}
                           >
                              <option>Active</option>
                              <option>Resigned</option>
                              <option>Terminated</option>
                           </Select>
                        </div>
                     </div>
                  </form>
               </ModalBody>
               <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                  <div className="flex gap-4 w-full">
                     <Button color="blue" onClick={handleAddPlacement} className="flex-1 font-bold h-12 shadow-xl shadow-blue-500/20">
                        {isEditMode ? 'Update Placement' : 'Save Placement'}
                     </Button>
                     <Button color="gray" onClick={() => setIsPlacementModalOpen(false)}>
                        Cancel
                     </Button>
                  </div>
               </ModalFooter>
            </Modal>

            {/* Social Support Modal */}
            <Modal show={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} size="lg">
               <ModalHeader className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <h3 className="text-xl font-bold dark:text-white">{isEditMode ? 'Update Assessment' : 'New Support Entry'}</h3>
               </ModalHeader>
               <ModalBody className="p-8 bg-white dark:bg-gray-800">
                  <form onSubmit={handleAddSupport} className="space-y-6">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                           <input
                              type="checkbox"
                              id="health"
                              checked={supportForm.healthProblem}
                              onChange={(e) => setSupportForm({ ...supportForm, healthProblem: e.target.checked })}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                           />
                           <label htmlFor="health" className="font-bold dark:text-white">Health Problem Detected?</label>
                        </div>
                        {supportForm.healthProblem && (
                           <Textarea
                              placeholder="Provide details about health issues and support provided..."
                              value={supportForm.healthProblemDetail}
                              onChange={(e) => setSupportForm({ ...supportForm, healthProblemDetail: e.target.value })}
                              rows={3}
                           />
                        )}

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                           <input
                              type="checkbox"
                              id="drug"
                              checked={supportForm.drugProblem}
                              onChange={(e) => setSupportForm({ ...supportForm, drugProblem: e.target.checked })}
                              className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                           />
                           <label htmlFor="drug" className="font-bold dark:text-white">Drug Issue Detected?</label>
                        </div>
                        {supportForm.drugProblem && (
                           <Textarea
                              placeholder="Provide details about drug issues and support provided..."
                              value={supportForm.drugProblemDetail}
                              onChange={(e) => setSupportForm({ ...supportForm, drugProblemDetail: e.target.value })}
                              rows={3}
                           />
                        )}
                     </div>
                  </form>
               </ModalBody>
               <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                  <div className="flex gap-4 w-full">
                     <Button color="blue" onClick={handleAddSupport} className="flex-1 font-bold h-12 shadow-xl shadow-blue-500/20">
                        {isEditMode ? 'Update Record' : 'Record Assessment'}
                     </Button>
                     <Button color="gray" onClick={() => setIsSupportModalOpen(false)}>
                        Cancel
                     </Button>
                  </div>
               </ModalFooter>
            </Modal>

            {/* Education Modal */}
            <Modal show={isEducationModalOpen} onClose={() => setIsEducationModalOpen(false)} size="md">
               <ModalHeader className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <h3 className="text-xl font-bold dark:text-white">{isEditMode ? 'Update Education' : 'Add Education'}</h3>
               </ModalHeader>
               <ModalBody className="p-8 bg-white dark:bg-gray-800">
                  <form onSubmit={handleAddEducation} className="space-y-6">
                     <div>
                        <Label className="mb-1 block">School / Institution Name</Label>
                        <TextInput
                           required
                           value={educationForm.schoolName}
                           onChange={(e) => setEducationForm({ ...educationForm, schoolName: e.target.value })}
                           placeholder="e.g. Future Hope School"
                        />
                     </div>
                     <div>
                        <Label className="mb-1 block">Education Level</Label>
                        <Select
                           value={educationForm.currentLevel}
                           onChange={(e) => setEducationForm({ ...educationForm, currentLevel: e.target.value })}
                        >
                           <option>Primary School</option>
                           <option>High School</option>
                           <option>Vocational</option>
                           <option>University</option>
                        </Select>
                     </div>
                  </form>
               </ModalBody>
               <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                  <div className="flex gap-4 w-full">
                     <Button color="indigo" onClick={handleAddEducation} className="flex-1 font-bold h-12 shadow-xl shadow-indigo-500/20">
                        {isEditMode ? 'Update Record' : 'Add Record'}
                     </Button>
                     <Button color="gray" onClick={() => setIsEducationModalOpen(false)}>
                        Cancel
                     </Button>
                  </div>
               </ModalFooter>
            </Modal>

            <ConfirmModal
               show={isConfirmOpen}
               onClose={() => setIsConfirmOpen(false)}
               onConfirm={confirmDeleteItem}
               message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
            />
         </div>
      </Layout>
   );
};

export default ClientProfilePage;
