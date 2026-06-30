import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Select, ToggleSwitch, Alert, Spinner } from '@/lib/flowbite-compat';
import { CreateTenantCommand, TenantDto, tenantService } from '@/services/tenantService';
import { X } from 'lucide-react';

interface TenantFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantToEdit: TenantDto | null;
    onSuccess: () => void;
}

const TenantFormModal = ({ isOpen, onClose, tenantToEdit, onSuccess }: TenantFormModalProps) => {
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
            setError(err.response?.data?.message || 'Failed to save tenant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        {tenantToEdit ? 'Edit Organization' : 'Create Organization'}
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
                            <Label htmlFor="id">Tenant ID (Unique Key)</Label>
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
                            <Label htmlFor="name">Organization Name</Label>
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
                            <Label htmlFor="managerEmail">Manager Email</Label>
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
                                <Label className="text-gray-900 dark:text-white font-bold">Status</Label>
                                <p className="text-xs text-gray-500">Enable or suspend tenant access</p>
                            </div>
                            <ToggleSwitch
                                checked={formData.isActive}
                                onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="subscriptionEndDate">Subscription End Date</Label>
                            <TextInput
                                id="subscriptionEndDate"
                                name="subscriptionEndDate"
                                type="date"
                                value={formData.subscriptionEndDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxDevices">Max Allowed Devices</Label>
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
                            <Label className="text-gray-900 dark:text-white font-bold mb-2 block">Module Permissions</Label>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                {[
                                    { id: 'CLINIC', label: 'Clinic Management' },
                                    { id: 'SCHOOL', label: 'School Management' },
                                    { id: 'HOTEL', label: 'Hotel & Hospitality' },
                                    { id: 'BILLING', label: 'Billing & Finance' },
                                    { id: 'HR', label: 'Human Resources' },
                                    { id: 'STOCK', label: 'Stock & Inventory' },
                                    { id: 'POS', label: 'POS System' }
                                ].map(mod => (
                                    <div key={mod.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`mod-${mod.id}`}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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

                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                            <Button
                                type="button"
                                color="light"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="blue"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" className="mr-2" /> : null}
                                {tenantToEdit ? 'Save Changes' : 'Create Tenant'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default TenantFormModal;
