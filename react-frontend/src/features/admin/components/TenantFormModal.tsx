import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {Modal, Button, Label, TextInput, Select, ToggleSwitch, Alert, Spinner, Datepicker} from '@/lib/flowbite-compat';
import { CreateTenantCommand, TenantDto, tenantService } from '@/services/tenantService';
import { X } from 'lucide-react';

interface TenantFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantToEdit: TenantDto | null;
    onSuccess: () => void;
}

const TenantFormModal = ({ isOpen, onClose, tenantToEdit, onSuccess }: TenantFormModalProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateTenantCommand>({
        id: '',
        name: '',
        managerEmail: '',
        isActive: true,
        subscriptionEndDate: '',
        maxDevices: 10,
        allowedModules: []
    });

    useEffect(() => {
        if (tenantToEdit) {
            setFormData({
                id: tenantToEdit.id,
                name: tenantToEdit.name,
                managerEmail: tenantToEdit.managerEmail || '',
                isActive: tenantToEdit.isActive,
                subscriptionEndDate: tenantToEdit.subscriptionEndDate || '',
                maxDevices: tenantToEdit.maxDevices,
                allowedModules: tenantToEdit.allowedModules || []
            });
        } else {
            setFormData({
                id: '',
                name: '',
                managerEmail: '',
                isActive: true,
                subscriptionEndDate: '',
                maxDevices: 10,
                allowedModules: []
            });
        }
        setError(null);
    }, [tenantToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const command: CreateTenantCommand = {
                ...formData,
                managerEmail: formData.managerEmail || null,
                subscriptionEndDate: formData.subscriptionEndDate || null
            };

            if (tenantToEdit) {
                await tenantService.updateTenant(tenantToEdit.id, command);
            } else {
                await tenantService.createTenant(command);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || t("failedToSaveTenant"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        {tenantToEdit ? t("editOrganization") : t("createOrganization")}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {error && (
                        <Alert color="failure" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="id">{t("tenantIdUniqueKey")}</Label>
                            <TextInput
                                id="id"
                                name="id"
                                placeholder="e.g. clinic-a"
                                value={formData.id}
                                onChange={handleChange}
                                disabled={!!tenantToEdit}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">{t("organizationName")}</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="e.g. Main Street Clinic"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="managerEmail">{t("managerEmail")}</Label>
                            <TextInput
                                id="managerEmail"
                                name="managerEmail"
                                type="email"
                                placeholder="manager@clinic.com"
                                value={formData.managerEmail || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div>
                                <Label className="text-gray-900 dark:text-white font-bold">{t("status")}</Label>
                                <p className="text-xs text-gray-500">{t("enableSuspendTenantAccess")}</p>
                            </div>
                            <ToggleSwitch
                                checked={formData.isActive}
                                onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="subscriptionEndDate">{t("subscriptionEndDate")}</Label>
                            <Datepicker
                                id="subscriptionEndDate"
                                name="subscriptionEndDate"
                                value={formData.subscriptionEndDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxDevices">{t("maxAllowedDevices")}</Label>
                            <TextInput
                                id="maxDevices"
                                name="maxDevices"
                                type="number"
                                min="1"
                                value={formData.maxDevices}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <Label className="text-gray-900 dark:text-white font-bold mb-2 block">{t("modulePermissions")}</Label>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                {[
                                    { id: 'CLINIC', label: t("clinicManagement") },
                                    { id: 'SCHOOL', label: t("schoolManagement") },
                                    { id: 'HOTEL', label: t("hotelHospitality") },
                                    { id: 'BILLING', label: t("billingFinance") },
                                    { id: 'HR', label: t("humanResources") },
                                    { id: 'STOCK', label: t("stockInventory") },
                                    { id: 'POS', label: t("posSystem") }
                                ].map(mod => (
                                    <div key={mod.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`mod-${mod.id}`}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700"
                                            checked={formData.allowedModules.includes(mod.id)}
                                            onChange={(e) => {
                                                const newModules = e.target.checked
                                                    ? [...formData.allowedModules, mod.id]
                                                    : formData.allowedModules.filter(m => m !== mod.id);
                                                setFormData({ ...formData, allowedModules: newModules });
                                            }}
                                        />
                                        <label htmlFor={`mod-${mod.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
                                            {mod.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t mt-6">
                            <Button
                                type="button"
                                color="light"
                                className="flex-1"
                                onClick={onClose}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                color="blue"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" className="mr-2" /> : null}
                                {tenantToEdit ? t("saveChanges") : t("createTenant")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default TenantFormModal;
