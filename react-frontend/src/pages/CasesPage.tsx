import { useState, useEffect } from 'react'
import {
  Button, Badge, Spinner, Modal,
  Label, TextInput, Select, Textarea,
  ModalHeader,
  ModalBody
} from 'flowbite-react'
import {
  Plus, Search, Clock,
  CheckCircle2, Trash2, Edit3
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

const CasesPage = ({ isDark, setIsDark }: any) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'close', id: number } | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    subject: '',
    description: '',
    priority: 'Normal',
    serviceType: 'Job Placement'
  });

  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCases();
    fetchClients();
  }, [statusFilter]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cases', { params: { status: statusFilter === 'All' ? '' : statusFilter } });
      const data = response.data;
      setCases(Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));
    } catch (err) {
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients', { params: { size: 100 } });
      const data = response.data;
      setClients(Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Failed to fetch clients");
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode && editingId) {
        await api.put(`/cases/${editingId}`, formData);
        toast.success("Case updated successfully");
      } else {
        await api.post('/cases', formData);
        toast.success("New case opened");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      fetchCases();
      setFormData({
        clientId: '',
        subject: '',
        description: '',
        priority: 'Normal',
        serviceType: 'Job Placement'
      });
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kase: any) => {
    setFormData({
      clientId: kase.client?.id?.toString() || '',
      subject: kase.subject,
      description: kase.description || '',
      priority: kase.priority,
      serviceType: kase.serviceType
    });
    setEditingId(kase.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (id: number) => {
    setConfirmAction({ type: 'delete', id });
    setIsConfirmOpen(true);
  };

  const handleCloseTrigger = (id: number) => {
    setConfirmAction({ type: 'close', id });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'delete') {
        await api.delete(`/cases/${confirmAction.id}`);
        toast.success("Case removed");
      } else {
        await api.patch(`/cases/${confirmAction.id}/status`, { status: 'Closed' });
        toast.success("Case closed successfully");
      }
      setIsConfirmOpen(false);
      fetchCases();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Case Management">
      <div className="animate-fade-in pb-10">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 py-4 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-700 -mx-4 px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white leading-tight">Social Work Cases</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Intervention Tracking</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="w-32">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg px-4 py-2 text-sm outline-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <Button size="sm" color="blue" onClick={() => { setIsEditMode(false); setIsModalOpen(true); }} className="rounded-lg px-4 shadow-lg shadow-blue-500/20">
              <Plus size={16} className="mr-1" /> New Case
            </Button>
          </div>
        </header>

        {/* Cases List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="xl" /></div>
          ) : cases.map((kase) => (
            <div key={kase.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold dark:text-white leading-tight">{kase.subject}</h3>
                      <Badge color={kase.priority === 'High' ? 'failure' : 'info'} size="xs">{kase.priority}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-gray-500">Client: {kase.client?.firstName} {kase.client?.lastName}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tight font-medium">Service: {kase.serviceType} • Status: {kase.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {kase.status !== 'Closed' && (
                    <Button size="xs" color="success" onClick={() => handleCloseTrigger(kase.id)} className="rounded-lg px-4">
                      <CheckCircle2 size={14} className="mr-1" /> Close Case
                    </Button>
                  )}
                  <button onClick={() => handleEdit(kase)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 size={18} /></button>
                  <button onClick={() => handleDeleteTrigger(kase.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
          {cases.length === 0 && !loading && (
            <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Search size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold dark:text-white">No Active Cases</h3>
              <p className="text-gray-500">All clients are currently settled or no cases have been opened yet.</p>
            </div>
          )}
        </div>

        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
          <ModalHeader className="border-b dark:border-gray-700">
            <span className="text-lg font-bold dark:text-white">{isEditMode ? 'Edit Case Detail' : 'Open New Case'}</span>
          </ModalHeader>
          <ModalBody className="p-6 bg-white dark:bg-gray-800">

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1 block">Client</Label>
                <Select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                </Select>
              </div>

              <div>
                <Label className="mb-1 block">Subject</Label>
                <TextInput
                  required
                  placeholder="Case subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Priority</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Low</option>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Service</Label>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option>Job Placement</option>
                    <option>Social Support</option>
                    <option>Education</option>
                    <option>Medical</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-1 block">Description</Label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button color="blue" type="submit" className="flex-1">
                  {isEditMode ? 'Update' : 'Open Case'}
                </Button>
                <Button color="gray" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmAction}
          title={confirmAction?.type === 'delete' ? 'Delete Case?' : 'Close Case?'}
          type={confirmAction?.type === 'delete' ? 'danger' : 'info'}
          message={confirmAction?.type === 'delete'
            ? "Are you sure you want to delete this case? All history will be lost."
            : "Marking this case as closed indicates that the intervention is complete."}
        />
      </div>
    </Layout>
  );
};

export default CasesPage;
