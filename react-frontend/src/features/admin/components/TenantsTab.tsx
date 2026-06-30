import { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Badge } from '@/lib/flowbite-compat';
import { TenantDto, tenantService } from '@/services/tenantService';
import TenantFormModal from './TenantFormModal';
import { Building2, Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const TenantsTab = () => {
    const [tenants, setTenants] = useState<TenantDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tenantToEdit, setTenantToEdit] = useState<TenantDto | null>(null);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const data = await tenantService.getAllTenants();
            setTenants(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleAdd = () => {
        setTenantToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tenant: TenantDto) => {
        setTenantToEdit(tenant);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this organization? This action is irreversible.')) {
            try {
                await tenantService.deleteTenant(id);
                fetchTenants();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete organization');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-md">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">
                            Organization Management
                        </h2>
                        <p className="text-xs text-gray-500">Manage tenants and platform usage limits</p>
                    </div>
                </div>
                <Button color="blue" onClick={handleAdd}>
                    <Plus size={16} className="mr-2" />
                    New Organization
                </Button>
            </div>

            {error && (
                <Alert color="failure" icon={ShieldAlert} className="mb-4">
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="flex justify-center p-10">
                    <Spinner size="xl" />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300 font-bold">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Manager</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Subscription</th>
                                <th className="px-4 py-3">Max Devices</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {tenants.map(tenant => (
                                <tr key={tenant.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-mono text-xs">{tenant.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {tenant.name}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {tenant.allowedModules?.map(mod => (
                                                <span key={mod} className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded uppercase tracking-wider">
                                                    {mod}
                                                </span>
                                            ))}
                                            {(!tenant.allowedModules || tenant.allowedModules.length === 0) && (
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wider">No modules</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{tenant.managerEmail || '—'}</td>
                                    <td className="px-4 py-3">
                                        {tenant.isActive ? (
                                            <Badge color="success">Active</Badge>
                                        ) : (
                                            <Badge color="failure">Suspended</Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {tenant.subscriptionEndDate
                                            ? format(new Date(tenant.subscriptionEndDate), 'MMM d, yyyy')
                                            : 'Lifetime'}
                                    </td>
                                    <td className="px-4 py-3">{tenant.maxDevices}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(tenant)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tenant.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        No organizations found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <TenantFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tenantToEdit={tenantToEdit}
                onSuccess={fetchTenants}
            />
        </div>
    );
};

export default TenantsTab;
