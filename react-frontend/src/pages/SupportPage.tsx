import { useState, useEffect } from 'react'
import { 
  Card, Button, Badge, Spinner, 
  TextInput, Select, Modal, Label, Textarea
} from 'flowbite-react'
import { 
  LifeBuoy, Plus, Search, 
  MessageSquare, Clock, CheckCircle2,
  FileText, Trash2
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const SupportPage = ({ isDark, setIsDark }: any) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'IT'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data || []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/tickets', formData);
      setIsModalOpen(false);
      fetchTickets();
      setFormData({ title: '', description: '', priority: 'Medium', category: 'IT' });
      toast.success("Support ticket created");
    } catch (err) {
      toast.error("Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/tickets/${itemToDelete}`);
      toast.success("Ticket removed");
      fetchTickets();
    } catch (err) {
      toast.error("Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
                          ticket.id?.toString().includes(search);
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'failure';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'info';
      case 'in progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'gray';
      default: return 'info';
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Support Center">
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">Support Tickets</h2>
            <p className="text-sm text-gray-500 font-medium">Internal helpdesk and issue tracking</p>
          </div>
          <Button color="blue" onClick={() => setIsModalOpen(true)} className="rounded-lg shadow-xl shadow-blue-500/20 px-4">
            <Plus size={20} className="mr-2" /> New Ticket
          </Button>
        </header>

        {/* Filters */}
        <Card className="border-none shadow-sm dark:bg-gray-800">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search by title or ticket ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all text-sm" 
                 />
              </div>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Select>
           </div>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="xl" /></div>
          ) : filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="border-none shadow-sm hover:shadow-md transition-all dark:bg-gray-800 p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="p-6 flex-1 flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0`}>
                    <MessageSquare size={24} className="text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{ticket.id}</span>
                      <h3 className="text-lg font-black dark:text-white">{ticket.title}</h3>
                      <Badge color={getPriorityColor(ticket.priority)} className="rounded-full px-3">{ticket.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Created: {ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}</span>
                      <span className="flex items-center gap-1.5"><Badge color={getStatusColor(ticket.status)}>{ticket.status}</Badge></span>
                      <span className="flex items-center gap-1.5"><FileText size={14} /> {ticket.category}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 md:w-56 flex md:flex-col justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                      <Button size="xs" color="success" onClick={() => handleUpdateStatus(ticket.id, 'Resolved')} className="rounded-lg flex-1">
                        Resolve
                      </Button>
                    )}
                    <button onClick={() => handleDelete(ticket.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredTickets.length === 0 && !loading && (
            <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <LifeBuoy size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold dark:text-white">No Tickets Found</h3>
              <p className="text-gray-500">All caught up! No active support requests match your criteria.</p>
            </div>
          )}
        </div>

        {/* Create Ticket Modal */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6 bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-6 dark:text-white">New Support Ticket</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1 block">Issue Title</Label>
                <TextInput 
                  required 
                  placeholder="e.g. Cannot access email"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Category</Label>
                  <Select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>IT</option>
                    <option>Facilities</option>
                    <option>Human Resources</option>
                    <option>General</option>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Priority</Label>
                  <Select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Description</Label>
                <Textarea 
                  required 
                  rows={4}
                  placeholder="Provide more details..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button color="blue" type="submit" className="flex-1 font-bold">
                  Create Ticket
                </Button>
                <Button color="gray" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <ConfirmModal 
          show={isConfirmOpen} 
          onClose={() => setIsConfirmOpen(false)} 
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this support ticket? This action cannot be undone."
        />
      </div>
    </Layout>
  );
};

export default SupportPage;
