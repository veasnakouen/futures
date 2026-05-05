import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Table, Button, Modal, Label, Badge, TextInput, Checkbox, Pagination, Card, ModalFooter, ModalHeader, ModalBody, Select, FloatingLabel } from 'flowbite-react';
import { ShieldCheck, Lock, Search, RefreshCw, ChevronRight, ShieldAlert, PlusCircle, BookmarkPlus, Database, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RoleManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [showPermAssignModal, setShowPermAssignModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreatePermModal, setShowCreatePermModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // New Role/Perm state
  const [newRole, setNewRole] = useState({ name: '' });
  const [newPerm, setNewPerm] = useState({ name: '', description: '', resource: '', action: 'READ' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Resource list
  const RESOURCES = ["Dashboard", "Users", "Clients", "Inventory", "Reports", "Support", "Finance", "System"];
  const ACTIONS = ["READ", "CREATE", "UPDATE", "DELETE", "EXPORT", "ADMIN"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions')
      ]);
      setRoles(r.data);
      setPermissions(p.data);
    } catch (e) {
      console.error('ROLE FETCH ERROR:', e);
      toast.error('Failed to load role definitions');
    } finally {
      setLoading(false);
    }
  };

  const openPermAssignModal = (role: any) => {
    setSelectedRole(role);
    setSelectedPerms(role.permissions?.map((p: any) => p.name) || []);
    setShowPermAssignModal(true);
  };

  const handleCreateRole = async () => {
    if (!newRole.name) return;
    try {
      await api.post('/admin/roles', newRole);
      toast.success('Security role created');
      setShowCreateRoleModal(false);
      setNewRole({ name: '' });
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || 'Failed to create role');
    }
  };

  const handleCreatePerm = async () => {
    if (!newPerm.resource) {
      toast.error('Please select a resource');
      return;
    }
    try {
      await api.post('/admin/permissions', newPerm);
      toast.success('Advanced permission defined');
      setShowCreatePermModal(false);
      setNewPerm({ name: '', description: '', resource: '', action: 'READ' });
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || 'Failed to create permission');
    }
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    try {
      await api.put(`/admin/roles/${selectedRole.id}/permissions`, selectedPerms);
      toast.success(`Permissions updated for ${selectedRole.name}`);
      setShowPermAssignModal(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to apply permissions');
    }
  };

  const filteredRoles = roles?.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredRoles?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Advanced Access Control
          </h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <TextInput
              id="role-search"
              type="text"
              icon={Search}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button color="success" onClick={() => setShowCreateRoleModal(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Role
            </Button>
            <Button color="blue" onClick={() => setShowCreatePermModal(true)}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Permission
            </Button>
            <Button color="gray" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRoles?.map(r => (
          <Card key={r.id}>
            <div className="flex justify-between items-start">
              <ShieldAlert className="w-6 h-6 text-gray-400" />
              <Badge color={r.name.includes('ADMIN') ? 'failure' : 'info'}>
                {r.name.includes('ADMIN') ? 'High Authority' : 'Standard Role'}
              </Badge>
            </div>
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              {r.name}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {r.permissions?.length || 0} Managed Rights
            </p>
            <Button color="blue" onClick={() => openPermAssignModal(r)}>
              Configure Access
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons />
        </div>
      )}

      {/* Create Role Modal */}
      <Modal show={showCreateRoleModal} onClose={() => setShowCreateRoleModal(false)} size="md">
        <ModalHeader>Define Security Role</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Role Identifier (e.g. SUPERVISOR)</Label>
              <TextInput placeholder="REPORTS_ADMIN" value={newRole.name} onChange={e => setNewRole({ name: e.target.value })} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleCreateRole}>Save Role</Button>
          <Button color="gray" onClick={() => setShowCreateRoleModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Create Permission Modal */}
      <Modal show={showCreatePermModal} onClose={() => setShowCreatePermModal(false)} size="md">
        <ModalHeader>New Resource-Based Permission</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Target Resource</Label>
              <Select value={newPerm.resource} onChange={e => setNewPerm({ ...newPerm, resource: e.target.value })}>
                <option value="">Select a resource...</option>
                {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </div>
            <div>
              <Label>Action Right</Label>
              <Select value={newPerm.action} onChange={e => setNewPerm({ ...newPerm, action: e.target.value })}>
                {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </Select>

            </div>
            <div>
              <Label>Description</Label>
              <TextInput placeholder="Brief explanation of this right" value={newPerm.description} onChange={e => setNewPerm({ ...newPerm, description: e.target.value })} />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] text-gray-500 font-mono">
              Generated Name: {newPerm.resource ? `${newPerm.resource.toUpperCase()}_${newPerm.action.toUpperCase()}` : "SELECT RESOURCE"}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleCreatePerm}>Create Permission</Button>
          <Button color="gray" onClick={() => setShowCreatePermModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Permission Assignment Modal */}
      <Modal show={showPermAssignModal} onClose={() => setShowPermAssignModal(false)} size="xl">
        <ModalHeader>Configure Access Rights: {selectedRole?.name}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions?.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                <Checkbox
                  id={`perm-${p.id}`}
                  checked={selectedPerms.includes(p.name)}
                  onChange={() => setSelectedPerms(prev => prev.includes(p.name) ? prev.filter(x => x !== p.name) : [...prev, p.name])}
                />
                <Label htmlFor={`perm-${p.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 dark:text-gray-200">{p.name}</span>
                    {p.action && (
                      <Badge color={p.action === 'DELETE' || p.action === 'ADMIN' ? 'failure' : 'info'} size="xs" className="px-1 py-0">
                        {p.action}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-normal mt-0.5">{p.description || `Grant ${p.action} access to ${p.resource}`}</div>
                </Label>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={savePermissions}>Save Configuration</Button>
          <Button color="gray" onClick={() => setShowPermAssignModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RoleManagement;
