import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {Button, Spinner, Alert, Badge} from '@/lib/flowbite-compat';
import { TenantDto, tenantService } from '@/services/tenantService';
import TenantFormModal from './TenantFormModal';
import { Building2, Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const TenantsTab = () => {
    const { t } = useTranslation();
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
            setError(err.response?.data?.message || t("failedToLoadOrganizations"));
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
        if (window.confirm(t("confirmDeleteOrganization"))) {
            try {
                await tenantService.deleteTenant(id);
                fetchTenants();
            } catch (err: any) {
                setError(err.response?.data?.message || t("failedToDeleteOrganization"));
            }
        }
    };

    return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-black/40 p-6 animate-fade-in border border-white/20 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {t("organizationManagement")}
                        </h2>
                        <p className="text-xs text-gray-500">{t("manageTenantsUsageLimits")}</p>
                    </div>
                </div>
                <Button color="blue" onClick={handleAdd} className="rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
                    <Plus size={16} className="mr-2" />
                    {t("newOrganization")}
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
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm bg-white dark:bg-gray-800">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">{t("id")}</th>
                                <th className="px-4 py-3">{t("name")}</th>
                                <th className="px-4 py-3">{t("manager")}</th>
                                <th className="px-4 py-3">{t("status")}</th>
                                <th className="px-4 py-3">{t("subscription")}</th>
                                <th className="px-4 py-3">{t("maxDevices")}</th>
                                <th className="px-4 py-3 text-right">{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {tenants.map(tenant => (
                                <tr key={tenant.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-200 group">
                                    <td className="px-4 py-4 font-mono text-xs text-gray-400">{tenant.id}</td>
                                    <td className="px-4 py-4">
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
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wider">{t("noModules")}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{tenant.managerEmail || '—'}</td>
                                    <td className="px-4 py-3">
                                        {tenant.isActive ? (
                                            <Badge color="success">{t("activeStatus")}</Badge>
                                        ) : (
                                            <Badge color="failure">{t("suspended")}</Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {tenant.subscriptionEndDate
                                            ? format(new Date(tenant.subscriptionEndDate), 'MMM d, yyyy')
                                            : t("lifetime")}
                                    </td>
                                    <td className="px-4 py-3">{tenant.maxDevices}</td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => handleEdit(tenant)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tenant.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-105 active:scale-95"
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
                                        {t("noOrganizationsFound")}
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
