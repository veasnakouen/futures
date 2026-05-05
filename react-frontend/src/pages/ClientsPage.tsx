import { useState, useEffect } from 'react'
import { Spinner, Button, Alert } from 'flowbite-react'
import { Plus, AlertCircle, Activity } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

// Modular Components
import ClientFilters from '../components/clients/ClientFilters'
import ClientTable from '../components/clients/ClientTable'
import ClientRegistrationModal from '../components/clients/ClientRegistrationModal'

interface Client {
  id: number;
  clientCode: string;
  firstName: string;
  lastName: string;
  branch: string;
  gender: string;
  status: string;
  photo?: string;
  email?: string;
  contactPhone?: string;
}

const ClientsPage = ({ isDark, setIsDark }: any) => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ search: '', branch: '', status: '' });
  const [goToPageInput, setGoToPageInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, filters.search, filters.branch, filters.status]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        name: filters.search,
        branch: filters.branch,
        status: filters.status
      };
      const response = await api.get('/clients', { params });
      setClients(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      toast.error('Failed to fetch clients from server.');
    } finally {
      setLoading(false);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    clientCode: '',
    branch: 'Phnom Penh',
    gender: 'Male',
    status: 'Active',
    email: '',
    contactPhone: '',
    photo: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (client: Client) => {
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      clientCode: client.clientCode,
      branch: client.branch,
      gender: client.gender,
      status: client.status,
      email: client.email || '',
      contactPhone: client.contactPhone || '',
      photo: client.photo || ''
    });
    setEditingId(client.id);
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
      await api.delete(`/clients/${itemToDelete}`);
      toast.success('Client removed successfully');
      fetchClients();
    } catch (err) {
      toast.error('Failed to delete client.');
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode && editingId) {
        await api.put(`/clients/${editingId}`, formData);
        toast.success('Client profile updated');
      } else {
        await api.post('/clients', formData);
        toast.success('New client registered');
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      fetchClients();
      resetForm();
    } catch (err) {
      setError('Operation failed. Please check your data and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      clientCode: '',
      branch: 'Phnom Penh',
      gender: 'Male',
      status: 'Active',
      email: '',
      contactPhone: '',
      photo: ''
    });
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title={t('clients')}>
      <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
        <header className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-xl shadow-indigo-500/20">
                 <Activity size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-black dark:text-white tracking-tight">Client Registry</h2>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Syncing with Central Database
                 </p>
              </div>
           </div>
           <Button onClick={() => { setIsEditMode(false); setEditingId(null); resetForm(); setIsModalOpen(true); }} className="rounded-lg px-8 h-14 bg-indigo-600 hover:bg-indigo-700 border-none shadow-xl shadow-indigo-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]">
             <Plus size={20} className="mr-2" /> New Registration
           </Button>
        </header>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-hidden">
            <ClientFilters filters={filters} setFilters={setFilters} setPage={setPage} />

            {loading && clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
                <Spinner size="xl" />
                <span className="mt-6 animate-pulse font-black uppercase text-[10px] tracking-[0.2em]">Synchronizing Nodes...</span>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <Alert color="failure" icon={AlertCircle} className="max-w-md mx-auto mb-8 rounded-lg">{error}</Alert>
                <Button color="light" onClick={fetchClients} className="mx-auto rounded-lg px-8">Retry Connection</Button>
              </div>
            ) : (
              <ClientTable 
                clients={clients} 
                page={page} 
                setPage={setPage} 
                totalPages={totalPages} 
                handleEdit={handleEdit} 
                handleDelete={handleDelete}
                goToPageInput={goToPageInput}
                setGoToPageInput={setGoToPageInput}
              />
            )}
          </div>
        </div>

        <ClientRegistrationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          isEditMode={isEditMode}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handlePhotoChange={handlePhotoChange}
        />

        <ConfirmModal
          show={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this client? This action is immutable and will remove all associated case data."
        />
      </div>
    </Layout>
  );
};

export default ClientsPage;
