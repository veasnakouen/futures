import { useState, useEffect } from 'react'
import { 
  Card, Button, Badge, Spinner, Modal,
  Label, TextInput, Checkbox, Textarea, Select,
  ModalHeader, ModalBody, Pagination
} from 'flowbite-react'
import { 
  Plus, History, Monitor, Library, 
  Briefcase, Trash2, Edit3,
  Calendar, User, Search
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const LogbookPage = ({ isDark, setIsDark }: any) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    gender: 'Male',
    phone: '',
    note: '',
    jobinformation: false,
    library: false,
    usingComputer: false,
    futureService: false,
    interviewTechic: false,
    shortTraining: false,
    user: 'Super Admin'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logbooks', { params: { page, size: 10, search } });
      setLogs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load logbook entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/logbooks', formData);
      setIsModalOpen(false);
      fetchLogs();
      setFormData({
        gender: 'Male', phone: '', note: '',
        jobinformation: false, library: false, usingComputer: false,
        futureService: false, interviewTechic: false, shortTraining: false,
        user: 'Super Admin'
      });
      toast.success("Logbook entry saved");
    } catch (err) {
      toast.error("Failed to save log entry");
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/logbooks/${itemToDelete}`);
      toast.success("Log entry removed");
      fetchLogs();
    } catch (err) {
      toast.error("Failed to delete log entry");
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Daily Logbook">
      <div className="space-y-6 animate-fade-in">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Attendance & Activity Log</h2>
            <p className="text-sm text-gray-500">Track daily walk-in services and facility usage</p>
          </div>
          <Button color="blue" onClick={() => setIsModalOpen(true)} className="rounded-lg shadow-lg shadow-blue-500/20">
            <Plus size={18} className="mr-2" /> Quick Entry
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: 'Today Entries', count: logs.length, icon: <History className="text-blue-500"/> },
             { label: 'Computer Lab', count: logs.filter(l => l.usingComputer).length, icon: <Monitor className="text-emerald-500"/> },
             { label: 'Library Use', count: logs.filter(l => l.library).length, icon: <Library className="text-orange-500"/> },
             { label: 'Job Guidance', count: logs.filter(l => l.jobinformation).length, icon: <Briefcase className="text-indigo-500"/> }
           ].map((stat, i) => (
             <Card key={i} className="border-none shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">{stat.icon}</div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black dark:text-white">{stat.count}</p>
                   </div>
                </div>
             </Card>
           ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by note or phone..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all shadow-sm" 
            />
          </div>
        </div>

        <Card className="border-none shadow-sm dark:bg-gray-800 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
                    <tr>
                       <th className="px-6 py-4">Timestamp</th>
                       <th className="px-6 py-4">Gender</th>
                       <th className="px-6 py-4">Services Used</th>
                       <th className="px-6 py-4">Note</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-gray-700">
                    {loading ? (
                       <tr><td colSpan={5} className="py-10 text-center"><Spinner/></td></tr>
                    ) : logs.map((log) => (
                       <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 dark:text-white font-medium">
                             {log.createdAt ? format(new Date(log.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                             <Badge color="gray">{log.gender}</Badge>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-wrap gap-1">
                                {log.usingComputer && <Badge color="indigo">IT Lab</Badge>}
                                {log.library && <Badge color="orange">Library</Badge>}
                                {log.jobinformation && <Badge color="success">Job Info</Badge>}
                                {log.futureService && <Badge color="warning">Future</Badge>}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                             {log.note}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button onClick={() => handleDelete(log.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 size={16}/>
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>

        <div className="px-10 py-8 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-b-lg shadow-sm">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Page <span className="text-blue-600 dark:text-blue-400">{page + 1}</span> of {totalPages}
            </p>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jump to</span>
              <input 
                type="number" 
                min="1" 
                max={totalPages}
                value={goToPageInput}
                placeholder={String(page + 1)}
                onChange={(e) => setGoToPageInput(e.target.value)}
                onBlur={() => {
                  const val = parseInt(goToPageInput);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) setPage(val - 1);
                  setGoToPageInput('');
                }}
                className="w-14 h-9 px-2 text-center text-xs font-black bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all shadow-inner"
              />
            </div>
          </div>
          
          {totalPages > 0 && (
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p - 1)}
              showIcons
            />
          )}
        </div>

        {/* Entry Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
           <ModalHeader className="border-none p-0" />
           <ModalBody className="p-0 dark:bg-gray-800">
              <div className="p-6">
                 <h3 className="text-xl font-bold mb-6 dark:text-white">Quick Log Entry</h3>
                 
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <Label className="mb-1 block">Gender</Label>
                          <Select 
                             value={formData.gender}
                             onChange={(e: any) => setFormData({...formData, gender: e.target.value})}
                          >
                             <option>Male</option>
                             <option>Female</option>
                             <option>Other</option>
                          </Select>
                       </div>
                       <div>
                          <Label className="mb-1 block">Phone (Optional)</Label>
                          <TextInput 
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="block font-bold text-gray-400 uppercase text-[10px]">Services Accessed</Label>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2"><Checkbox id="c1" checked={formData.usingComputer} onChange={e => setFormData({...formData, usingComputer: e.target.checked})} /> <Label htmlFor="c1" className="text-sm">Using Computer</Label></div>
                          <div className="flex items-center gap-2"><Checkbox id="c2" checked={formData.library} onChange={e => setFormData({...formData, library: e.target.checked})} /> <Label htmlFor="c2" className="text-sm">Library Use</Label></div>
                          <div className="flex items-center gap-2"><Checkbox id="c3" checked={formData.jobinformation} onChange={e => setFormData({...formData, jobinformation: e.target.checked})} /> <Label htmlFor="c3" className="text-sm">Job Information</Label></div>
                          <div className="flex items-center gap-2"><Checkbox id="c4" checked={formData.futureService} onChange={e => setFormData({...formData, futureService: e.target.checked})} /> <Label htmlFor="c4" className="text-sm">Future Service</Label></div>
                       </div>
                    </div>

                    <div>
                        <Label className="mb-1 block">Note</Label>
                       <Textarea 
                          rows={3}
                          placeholder="Additional details..."
                          value={formData.note}
                          onChange={(e) => setFormData({...formData, note: e.target.value})}
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <Button color="blue" type="submit" className="flex-1 font-bold">Save Log Entry</Button>
                       <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    </div>
                 </form>
              </div>
           </ModalBody>
        </Modal>

        <ConfirmModal 
          show={isConfirmOpen} 
          onClose={() => setIsConfirmOpen(false)} 
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this log entry? This record is used for reporting statistics."
        />
      </div>
    </Layout>
  );
};

export default LogbookPage;
