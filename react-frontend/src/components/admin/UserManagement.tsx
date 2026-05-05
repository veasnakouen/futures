import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, TextInput, Checkbox, Pagination, Card } from 'flowbite-react';
import { Search, UserCog, Mail, Shield, User as UserIcon, RefreshCw, Key, UserPlus, Eye, EyeOff, AlertCircle, Unlock, Camera, Edit } from 'lucide-react';
import { Avatar, FileInput } from 'flowbite-react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: any[];
  passwordText?: string;
  avatarUrl?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [newUser, setNewUser] = useState({ userName: '', firstName: '', lastName: '', email: '', passwordHash: '', avatarUrl: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  // Password visibility for table
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData(currentPage - 1, itemsPerPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchData = async (page = 0, size = 10, search = '') => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        api.get(`/admin/users?page=${page}&size=${size}&search=${search}`),
        api.get('/admin/roles')
      ]);
      setUsers(u.data.content || u.data);
      setTotalPages(u.data.totalPages || 1);
      setRoles(r.data);
    } catch (e) {
      console.error('FETCH ERROR:', e);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openRoleModal = (u: User) => {
    setSelectedUser(u);
    setSelectedRoles(u.roles?.map(r => typeof r === 'string' ? r : r.name) || []);
    setShowRoleModal(true);
  };

  const openResetModal = (u: User) => {
    setSelectedUser(u);
    setResetPassword('');
    setShowResetModal(true);
  };

  const saveRoles = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser.id}/roles`, selectedRoles);
      toast.success(`Roles updated for ${selectedUser.userName}`);
      setShowRoleModal(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to update roles');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditMode) {
          setSelectedUser(selectedUser ? { ...selectedUser, avatarUrl: reader.result as string } : null);
        } else {
          setNewUser({ ...newUser, avatarUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditUser = (u: User) => {
    setSelectedUser(u);
    setEditingId(u.id);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleCreateUser = async () => {
    try {
      if (isEditMode && editingId) {
        await api.put(`/admin/users/${editingId}`, selectedUser);
        toast.success('User updated successfully');
      } else {
        await api.post('/admin/users', newUser);
        toast.success('User created successfully');
      }
      setShowCreateModal(false);
      setIsEditMode(false);
      setEditingId(null);
      setNewUser({ userName: '', firstName: '', lastName: '', email: '', passwordHash: '', avatarUrl: '' });
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || 'Failed to process user');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    try {
      await api.post(`/admin/users/${selectedUser.id}/reset-password`, resetPassword);
      toast.success(`Password reset for ${selectedUser.userName}`);
      setShowResetModal(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to reset password');
    }
  };

  const [totalPages, setTotalPages] = useState(1);

  // Client side filtering is still useful for immediate UI response if we have the full data,
  // but with server-side pagination we should probably rely on the backend for search.
  // For now, I'll keep the server-side fetch on search change.

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-blue-600" />
            User Management
          </h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <TextInput
              id="user-search"
              type="text"
              icon={Search}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button color="blue" onClick={() => { setIsEditMode(false); setEditingId(null); setShowCreateModal(true); }}>
              <UserPlus className="w-4 h-4 mr-2" />
              New User
            </Button>
            <Button color="gray" onClick={() => fetchData(currentPage - 1, itemsPerPage, searchTerm)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <Table hoverable>
          <TableHead>
            <TableHeadCell>User</TableHeadCell>
            <TableHeadCell>Contact</TableHeadCell>
            <TableHeadCell>Credential</TableHeadCell>
            <TableHeadCell>Roles</TableHeadCell>
            <TableHeadCell className="text-right">Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {users?.map(u => (
              <TableRow key={u.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <Avatar
                      img={u.avatarUrl || ''}
                      rounded
                      size="sm"
                      placeholderInitials={`${u.firstName[0]}${u.lastName[0]}`}
                    />
                    <div>
                      {u.firstName} {u.lastName}
                      <div className="text-xs text-gray-400">@{u.userName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{u.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {visiblePasswords[u.id] ? (u.passwordText || '********') : '********'}
                    </span>
                    <button onClick={() => togglePasswordVisibility(u.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                      {visiblePasswords[u.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {u.roles?.map((r, i) => (
                      <Badge key={i} color="gray" size="sm">
                        {typeof r === 'string' ? r : r.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="xs" color="gray" onClick={() => handleEditUser(u)} title="Edit Details"><Edit size={14} /></Button>
                    <Button size="xs" color="gray" onClick={() => openRoleModal(u)} title="Manage Roles"><Shield className="w-3.5 h-3.5" /></Button>
                    <Button size="xs" color="gray" onClick={() => openResetModal(u)} title="Reset Password"><Key className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center p-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons />
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} size="md">
        <ModalHeader>{isEditMode ? 'Update User Account' : 'New User Account'}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <TextInput
                  placeholder="First"
                  value={isEditMode ? selectedUser?.firstName : newUser.firstName}
                  onChange={e => isEditMode ? setSelectedUser(selectedUser ? { ...selectedUser, firstName: e.target.value } : null) : setNewUser({ ...newUser, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <TextInput
                  placeholder="Last"
                  value={isEditMode ? selectedUser?.lastName : newUser.lastName}
                  onChange={e => isEditMode ? setSelectedUser(selectedUser ? { ...selectedUser, lastName: e.target.value } : null) : setNewUser({ ...newUser, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Username</Label>
              <TextInput
                placeholder="Username"
                value={isEditMode ? selectedUser?.userName : newUser.userName}
                onChange={e => isEditMode ? setSelectedUser(selectedUser ? { ...selectedUser, userName: e.target.value } : null) : setNewUser({ ...newUser, userName: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <TextInput
                placeholder="Email"
                value={isEditMode ? selectedUser?.email : newUser.email}
                onChange={e => isEditMode ? setSelectedUser(selectedUser ? { ...selectedUser, email: e.target.value } : null) : setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            {!isEditMode && (
              <div className="relative">
                <Label>Password</Label>
                <TextInput type={showPassword ? "text" : "password"} value={newUser.passwordHash} onChange={e => setNewUser({ ...newUser, passwordHash: e.target.value })} />
                <button className="absolute right-3 top-9 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  {(isEditMode ? selectedUser?.avatarUrl : newUser.avatarUrl) ? (
                    <img src={isEditMode ? selectedUser?.avatarUrl : newUser.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-300" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <FileInput id="user-avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <Label htmlFor="user-avatar" className="inline-block px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                    Select Image
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleCreateUser}>{isEditMode ? 'Update User' : 'Create User'}</Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onClose={() => setShowResetModal(false)} size="md">
        <ModalHeader>Reset Password</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              User: <span className="font-bold text-blue-600">{selectedUser?.userName}</span>
            </div>
            <div>
              <Label>New Secure Password</Label>
              <TextInput type={showPassword ? "text" : "password"} value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleResetPassword}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowResetModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Roles Modal */}
      <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} size="md">
        <ModalHeader>Assign Security Roles</ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {roles?.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                <Checkbox
                  id={`role-${r.id}`}
                  checked={selectedRoles.includes(r.name)}
                  onChange={() => setSelectedRoles(prev => prev.includes(r.name) ? prev.filter(x => x !== r.name) : [...prev, r.name])}
                />
                <Label htmlFor={`role-${r.id}`} className="flex-1 cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                  {r.name}
                </Label>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={saveRoles}>Update Roles</Button>
          <Button color="gray" onClick={() => setShowRoleModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserManagement;
