import { useState, useEffect } from 'react'
import {
   Card, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell,
   Badge, Button, Spinner,
   Modal, ModalHeader, ModalBody, ModalFooter,
   Label, TextInput, Select, Datepicker, Popover
} from 'flowbite-react'
import {
   Briefcase, Calendar, Building, DollarSign,
   Plus, Edit, Trash2, Search
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const PlacementsPage = ({ isDark, setIsDark }: any) => {
   const [placements, setPlacements] = useState<any[]>([])
   const [stats, setStats] = useState<any>(null)
   const [loading, setLoading] = useState(true)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [isEditMode, setIsEditMode] = useState(false)
   const [editingId, setEditingId] = useState<number | null>(null)
   const [isConfirmOpen, setIsConfirmOpen] = useState(false)
   const [itemToDelete, setItemToDelete] = useState<number | null>(null)

   const [formData, setFormData] = useState({
      clientId: '',
      companyName: '',
      salary: '',
      placementDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      placementType: 'Employment'
   })

   const [searchQuery, setSearchQuery] = useState('')
   const [statusFilter, setStatusFilter] = useState('All')

   useEffect(() => {
      fetchData()
   }, [])

   const fetchData = async () => {
      try {
         setLoading(true)
         await Promise.all([fetchPlacements(), fetchStats()])
      } finally {
         setLoading(false)
      }
   }

   const fetchPlacements = async () => {
      try {
         const response = await api.get('/placements')
         // Handle paginated response from backend
         const data = Array.isArray(response.data) ? response.data : (response.data.content || [])
         setPlacements(data)
      } catch (error) {
         toast.error("Failed to fetch placements")
         setPlacements([])
      }
   }

   const fetchStats = async () => {
      try {
         const response = await api.get('/placements/stats')
         setStats(response.data)
      } catch (error) {
         console.error("Failed to fetch stats", error)
      }
   }

   const handleOpenModal = (placement?: any) => {
      if (placement) {
         setFormData({
            clientId: placement.clientId || '',
            companyName: placement.companyName || '',
            salary: placement.salary || '',
            placementDate: placement.placementDate ? placement.placementDate.split('T')[0] : '',
            status: placement.status || 'Active',
            placementType: placement.placementType || 'Employment'
         })
         setEditingId(placement.id)
         setIsEditMode(true)
      } else {
         setFormData({
            clientId: '',
            companyName: '',
            salary: '',
            placementDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            placementType: 'Employment'
         })
         setIsEditMode(false)
      }
      setIsModalOpen(true)
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         const formattedData = {
            ...formData,
            placementDate: formData.placementDate + " 00:00:00"
         }
         if (isEditMode && editingId) {
            await api.put(`/placements/${editingId}`, formattedData)
            toast.success("Placement updated")
         } else {
            await api.post('/placements', formattedData)
            toast.success("Placement recorded")
         }
         setIsModalOpen(false)
         fetchData()
      } catch (error) {
         toast.error("Failed to save placement")
      }
   }

   const handleDeleteClick = (id: number) => {
      setItemToDelete(id)
      setIsConfirmOpen(true)
   }

   const confirmDelete = async () => {
      if (!itemToDelete) return
      try {
         await api.delete(`/placements/${itemToDelete}`)
         toast.success("Placement removed")
         fetchData()
      } catch (error) {
         toast.error("Deletion failed")
      }
   }

   const filteredPlacements = (placements || []).filter(p => {
      const matchesSearch = p.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesStatus
   })

   const handleDateChange = (date: Date | null) => {
      if (date) {
         const dateString = date.toISOString().split('T')[0];
         setFormData({ ...formData, placementDate: dateString });
      }
   };

   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Career Placements">
         <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
               <div className="flex flex-1 gap-4">
                  <div className="relative flex-1 max-w-md">
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <TextInput
                        placeholder="Search company or candidate..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
                     <option>All Status</option>
                     <option>Active</option>
                     <option>Resigned</option>
                     <option>Terminated</option>
                  </Select>
               </div>
               <Button color="blue" onClick={() => handleOpenModal()} className="rounded-lg shadow-lg shadow-blue-500/20 px-6 font-bold">
                  <Plus size={18} className="mr-2" /> Record Placement
               </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                  {
                     label: 'Total Placements',
                     value: stats?.totalPlacements || placements.length,
                     icon: <Briefcase className="text-blue-500" />,
                     color: 'blue'
                  },
                  {
                     label: 'Active Roles',
                     value: stats?.statusDistribution?.find((s: any) => s.name === 'Active')?.value || placements.filter(p => p.status === 'Active').length,
                     icon: <Building className="text-emerald-500" />,
                     color: 'emerald'
                  },
                  {
                     label: 'Avg Salary',
                     value: '$' + (placements.reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0) / (placements.length || 1)).toFixed(2),
                     icon: <DollarSign className="text-orange-500" />,
                     color: 'orange'
                  }
               ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm dark:bg-gray-800">
                     <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                           {stat.icon}
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                           <h3 className="text-2xl font-black dark:text-white">{stat.value}</h3>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>

            {/* Main Table */}
            <Card className="border-none shadow-lg dark:bg-gray-800 overflow-hidden">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                     <Spinner size="xl" />
                     <p className="text-gray-500 font-bold animate-pulse">Synchronizing Placement Ledger...</p>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <Table hoverable className="dark:bg-gray-800">
                        <TableHead className="bg-gray-50 dark:bg-gray-700/50">
                           <TableHeadCell className="font-black text-[10px] uppercase tracking-widest">Candidate</TableHeadCell>
                           <TableHeadCell className="font-black text-[10px] uppercase tracking-widest">Enterprise Entity</TableHeadCell>
                           <TableHeadCell className="font-black text-[10px] uppercase tracking-widest">Commencement</TableHeadCell>
                           <TableHeadCell className="font-black text-[10px] uppercase tracking-widest">Compensatory</TableHeadCell>
                           <TableHeadCell className="font-black text-[10px] uppercase tracking-widest">Status</TableHeadCell>
                           <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                           {filteredPlacements.map((p, i) => (
                              <TableRow key={i} className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                 <TableCell className="font-bold dark:text-white">{p.clientName || `Client #${p.clientId}`}</TableCell>
                                 <TableCell>
                                    <div className="flex flex-col">
                                       <span className="font-black text-sm dark:text-gray-200">{p.companyName}</span>
                                       <span className="text-[10px] text-gray-400 uppercase tracking-wider">{p.placementType}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-xs flex items-center gap-2">
                                    <Calendar size={12} /> {p.placementDate ? format(new Date(p.placementDate), 'MMM dd, yyyy') : 'N/A'}
                                 </TableCell>
                                 <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.salary || 'N/A'}</TableCell>
                                 <TableCell>
                                    <Badge color={p.status === 'Active' ? 'success' : 'gray'} className="w-fit rounded-full px-3 py-1 font-bold">
                                       {p.status}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                       <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                                          <Edit size={16} />
                                       </button>
                                       <button onClick={() => handleDeleteClick(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all">
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               )}
            </Card>
         </div>

         <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
            <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
               <h3 className="text-xl font-black dark:text-white">
                  {isEditMode ? 'Modify Placement Record' : 'Initialize Placement'}
               </h3>
            </ModalHeader>
            <ModalBody className="p-8 bg-white dark:bg-gray-800">
               <form id="placement-form" onSubmit={handleSubmit} className="space-y-6 pb-96">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="col-span-2">
                        <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Company Name</Label>
                        <TextInput required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                     </div>
                     <div>
                        <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Monthly Salary</Label>
                        <TextInput value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="$0.00" />
                     </div>
                     <div>
                        <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Commencement Date</Label>
                        <Popover
                           content={
                              <div className="p-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
                                 <Datepicker
                                    inline={true}
                                    value={formData.placementDate ? new Date(formData.placementDate) : new Date()}
                                    onChange={handleDateChange}
                                 />
                              </div>
                           }
                           placement="top"
                           trigger="click"
                        >
                           <div className="group relative cursor-pointer">
                              <div className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-xl group-hover:border-blue-400 transition-all">
                                 <span className={`text-sm font-bold ${formData.placementDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {formData.placementDate ? format(new Date(formData.placementDate), 'MMM dd, yyyy') : 'Select Date...'}
                                 </span>
                                 <Calendar size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </div>
                           </div>
                        </Popover>
                     </div>
                     <div>
                        <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Placement Type</Label>
                        <Select value={formData.placementType} onChange={(e) => setFormData({ ...formData, placementType: e.target.value })}>
                           <option>Employment</option>
                           <option>Internship</option>
                           <option>Vocational</option>
                        </Select>
                     </div>
                     <div>
                        <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Status</Label>
                        <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                           <option>Active</option>
                           <option>Resigned</option>
                           <option>Terminated</option>
                        </Select>
                     </div>
                  </div>
               </form>
            </ModalBody>
            <ModalFooter className="border-t dark:border-gray-700 bg-white dark:bg-gray-800">
               <div className="flex gap-4 w-full">
                  <Button color="blue" type="submit" form="placement-form" className="flex-1 font-black uppercase text-[10px] tracking-widest h-12 shadow-xl shadow-blue-500/20">
                     {isEditMode ? 'Update Database' : 'Finalize Placement'}
                  </Button>
                  <Button color="gray" onClick={() => setIsModalOpen(false)} className="font-black uppercase text-[10px] tracking-widest">Discard</Button>
               </div>
            </ModalFooter>
         </Modal>

         <ConfirmModal
            show={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
            message="Are you sure you want to delete this placement record? This action is permanent."
         />
      </Layout>
   )
}

export default PlacementsPage;
