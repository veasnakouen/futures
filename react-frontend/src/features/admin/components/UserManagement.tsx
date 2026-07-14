import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from '@/services/api';
import {Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, TextInput, Checkbox} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import {
  X,
  Search,
  UserCog,
  Mail,
  Shield,
  User as UserIcon,
  RefreshCw,
  Key,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  Unlock,
  Camera,
  Edit,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";
import {Avatar, FileInput, Dropdown, DropdownItem, DropdownDivider, Accordion, AccordionPanel, AccordionTitle, AccordionContent} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import authService from '../../../services/authService';
import { toast } from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: any[];
  passwordText?: string;
  avatarUrl?: string;
  isActive: boolean;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = authService.getCurrentUser();
  // Strictly SUPERADMIN only — controls password visibility
  const isSuperAdmin =
    Array.isArray(currentUser?.roles) &&
    currentUser.roles.some((r: any) => {
      const roleName = (
        typeof r === "string" ? r : r?.name || ""
      ).toUpperCase();
      return roleName.includes("SUPERADMIN");
    });
  // ADMIN or SUPERADMIN — controls general admin panel access
  const isAdmin =
    Array.isArray(currentUser?.roles) &&
    currentUser.roles.some((r: any) => {
      const roleName = (
        typeof r === "string" ? r : r?.name || ""
      ).toUpperCase();
      return roleName.includes("ADMIN") || roleName.includes("SUPERADMIN");
    });

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [newUser, setNewUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    avatarUrl: "",
  });
  const [selectedNewUserRoles, setSelectedNewUserRoles] = useState<string[]>(
    [],
  );
  const [showRolesGrid, setShowRolesGrid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  // Password visibility for table
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  // Display columns selection
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("userManagement_visibleColumns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      profile: true,
      contact: true,
      credentials: true,
      roles: true,
      status: true,
      governance: true,
    };
  });

  useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem(
      "userManagement_visibleColumns",
      JSON.stringify(visibleColumns),
    );
  }, [visibleColumns]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns((prev: any) => ({ ...prev, [col]: !prev[col] }));
  };

  const getVisibleColumnsCount = () => {
    let count = 0;
    if (visibleColumns.profile) count++;
    if (visibleColumns.contact) count++;
    if (isSuperAdmin && visibleColumns.credentials) count++;
    if (visibleColumns.roles) count++;
    if (visibleColumns.status) count++;
    if (visibleColumns.governance) count++;
    return count;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData(currentPage - 1, itemsPerPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchData = async (page = 0, size = 10, search = "") => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        api.get(`/admin/users?page=${page}&size=${size}&search=${search}`),
        api.get("/admin/roles"),
      ]);
      setUsers(u.data.content || u.data);
      setTotalPages(u.data.totalPages || 1);
      setRoles(r.data);
    } catch (e) {
      console.error("FETCH ERROR:", e);
      toast.error(t("failedToLoadUserData"));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openRoleModal = (u: User) => {
    setSelectedUser(u);
    setSelectedRoles(
      u.roles?.map((r) => (typeof r === "string" ? r : r.name)) || [],
    );
    setShowRoleModal(true);
  };

  const openResetModal = (u: User) => {
    setSelectedUser(u);
    setResetPassword("");
    setShowResetModal(true);
  };

  const saveRoles = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser.id}/roles`, selectedRoles);
      toast.success(`${t("rolesUpdatedFor")} ${selectedUser.userName}`);
      setShowRoleModal(false);
      fetchData();
    } catch (e) {
      toast.error(t("failedToUpdateRoles"));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditMode) {
          setSelectedUser(
            selectedUser
              ? { ...selectedUser, avatarUrl: reader.result as string }
              : null,
          );
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
        toast.success(t("userUpdatedSuccessfully"));
      } else {
        const response = await api.post("/admin/users", newUser);
        if (selectedNewUserRoles.length > 0 && response.data?.id) {
          await api.put(
            `/admin/users/${response.data.id}/roles`,
            selectedNewUserRoles,
          );
        }
        toast.success(t("userCreatedSuccessfully"));
      }
      setShowCreateModal(false);
      setIsEditMode(false);
      setEditingId(null);
      setNewUser({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        passwordHash: "",
        avatarUrl: "",
      });
      setSelectedNewUserRoles([]);
      setShowRolesGrid(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || t("failedToProcessUser"));
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    try {
      await api.post(`/admin/users/${selectedUser.id}/reset-password`, {
        newPassword: resetPassword,
      });
      toast.success(`${t("passwordResetFor")} ${selectedUser.userName}`);
      setShowResetModal(false);
      fetchData();
    } catch (e) {
      toast.error(t("failedToResetPassword"));
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-status`);
      toast.success(t("userStatusUpdated"));
      fetchData();
    } catch (e) {
      toast.error(t("failedToUpdateStatus"));
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
    <div className="space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-black/40 p-6 border border-white/20 dark:border-gray-700/50 animate-fade-in">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
              <UserCog size={24} />
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("userManagement")}
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchInput
                        placeholder={t("search")}
                        value={searchTerm}
                        onChange={setSearchTerm}
                        containerClassName="w-full md:w-64"
                      />

            {/* Column Selector Dropdown */}
            <div className="relative">
              <Button
                color="gray"
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {t("columns")}
              </Button>
              {showColumnDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowColumnDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-gray-800 p-4 z-20 space-y-3 transform origin-top-right transition-all">
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      {t("displayColumns")}
                    </h3>

                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={visibleColumns.profile}
                        onChange={() => toggleColumn("profile")}
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {t("userProfile")}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={visibleColumns.contact}
                        onChange={() => toggleColumn("contact")}
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {t("contactInfo")}
                      </span>
                    </label>

                    {isSuperAdmin && (
                      <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                        <Checkbox
                          checked={visibleColumns.credentials}
                          onChange={() => toggleColumn("credentials")}
                        />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                          {t("credentials")}
                        </span>
                      </label>
                    )}

                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={visibleColumns.roles}
                        onChange={() => toggleColumn("roles")}
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {t("securityRoles")}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={visibleColumns.status}
                        onChange={() => toggleColumn("status")}
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {t("accountStatus")}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={visibleColumns.governance}
                        onChange={() => toggleColumn("governance")}
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {t("action")}
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            <Button
              color="blue"
              onClick={() => {
                setIsEditMode(false);
                setEditingId(null);
                setShowCreateModal(true);
              }}
              className="rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t("newUser")}
            </Button>
            <Button
              color="gray"
              onClick={() =>
                fetchData(currentPage - 1, itemsPerPage, searchTerm)
              }
              disabled={loading}
              className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ?"animate-spin":""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm bg-white dark:bg-gray-800">
          <Table hoverable className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <TableHead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {visibleColumns.profile && (
                <TableHeadCell>{t("userProfile")}</TableHeadCell>
              )}
              {visibleColumns.contact && <TableHeadCell>{t("contact")}</TableHeadCell>}
              {isSuperAdmin && visibleColumns.credentials && (
                <TableHeadCell>{t("credentials")}</TableHeadCell>
              )}
              {visibleColumns.roles && (
                <TableHeadCell>{t("securityRoles")}</TableHeadCell>
              )}
              {visibleColumns.status && (
                <TableHeadCell>{t("accountStatus")}</TableHeadCell>
              )}
              {visibleColumns.governance && (
                <TableHeadCell className="text-right">{t("action")}</TableHeadCell>
              )}
            </TableHead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={getVisibleColumnsCount()}
                    className="text-center py-8 text-gray-500"
                  >
                    {t("noPersonnelRecordsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-200 group"
                  >
                    {/* User Profile */}
                    {visibleColumns.profile && (
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-3 py-1">
                          <div className="relative h-8 w-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] shrink-0 aspect-square rounded-full overflow-hidden border-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-sm">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={`${u.firstName} ${u.lastName}`}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="font-extrabold text-[10px] text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {`${u.firstName?.[0] || "U"}${u.lastName?.[0] || "N"}`}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-black dark:text-white text-xs leading-none">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-[10px] text-blue-600 font-bold mt-1">
                              @{u.userName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {/* Contact */}
                    {visibleColumns.contact && (
                      <TableCell>
                        <span className="text-[10px] font-medium text-gray-500">
                          {u.email}
                        </span>
                      </TableCell>
                    )}

                    {/* Credentials */}
                    {isSuperAdmin && visibleColumns.credentials && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-gray-400">
                            {visiblePasswords[u.id]
                              ? u.passwordText || t("unrecorded")
                              : "********"}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {visiblePasswords[u.id] ? (
                              <EyeOff size={12} />
                            ) : (
                              <Eye size={12} />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    )}

                    {/* Security Roles */}
                    {visibleColumns.roles && (
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {u.roles?.map((r, i) => (
                            <Badge
                              key={i}
                              color="gray"
                              className="rounded-md px-3 py-0.5 text-[8px] font-black uppercase tracking-widest"
                            >
                              {typeof r === "string" ? r : r.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    )}

                    {/* Account Status */}
                    {visibleColumns.status && (
                      <TableCell>
                        <Badge
                          color={u.isActive ? "success" : "failure"}
                          className="rounded-md px-4 py-1 text-[8px] font-black uppercase tracking-widest inline-block"
                        >
                          {u.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                    )}

                    {/* Action */}
                    {visibleColumns.governance && (
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Dropdown
                            label={
                              <MoreVertical
                                size={16}
                                className="text-gray-500"
                              />
                            }
                            arrowIcon={false}
                            inline
                            placement="left-start"
                          >
                            <DropdownItem onClick={() => handleEditUser(u)}>
                              <Edit size={14} className="mr-2" /> {t("edit")}
                            </DropdownItem>
                            <DropdownItem onClick={() => openRoleModal(u)}>
                              <Shield size={14} className="mr-2" /> {t("roles")}
                            </DropdownItem>
                            <DropdownItem onClick={() => openResetModal(u)}>
                              <Key size={14} className="mr-2" /> {t("password")}
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem
                              onClick={() => toggleUserStatus(u.id)}
                              className={
                                u.isActive ? "text-red-500" : "text-green-500"
                              }
                            >
                              <RefreshCw size={14} className="mr-2" />{" "}
                              {u.isActive ? t("disableUser") : t("enableUser")}
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>

        {totalPages > 1 && (
          <div className="p-4 bg-gray-50/30 dark:bg-gray-800/30 border-t">
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={itemsPerPage}
              showInfo={false}
            />
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="xl"
      >
        <CustomModalHeader
          title={isEditMode ? t("updateUserAccount") : t("newUserAccount")}
          subtitle={t("securityManagement")}
          onClose={() => setShowCreateModal(false)}
        />
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("firstName")}</Label>
                <TextInput
                  placeholder={t("firstPlaceholder")}
                  value={
                    isEditMode ? selectedUser?.firstName : newUser.firstName
                  }
                  onChange={(e) =>
                    isEditMode
                      ? setSelectedUser(
                          selectedUser
                            ? { ...selectedUser, firstName: e.target.value }
                            : null,
                        )
                      : setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>{t("lastName")}</Label>
                <TextInput
                  placeholder={t("lastPlaceholder")}
                  value={isEditMode ? selectedUser?.lastName : newUser.lastName}
                  onChange={(e) =>
                    isEditMode
                      ? setSelectedUser(
                          selectedUser
                            ? { ...selectedUser, lastName: e.target.value }
                            : null,
                        )
                      : setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>{t("username")}</Label>
              <TextInput
                placeholder={t("username")}
                value={isEditMode ? selectedUser?.userName : newUser.userName}
                onChange={(e) =>
                  isEditMode
                    ? setSelectedUser(
                        selectedUser
                          ? { ...selectedUser, userName: e.target.value }
                          : null,
                      )
                    : setNewUser({ ...newUser, userName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("email")}</Label>
              <TextInput
                placeholder={t("email")}
                value={isEditMode ? selectedUser?.email : newUser.email}
                onChange={(e) =>
                  isEditMode
                    ? setSelectedUser(
                        selectedUser
                          ? { ...selectedUser, email: e.target.value }
                          : null,
                      )
                    : setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            {!isEditMode && (
              <div className="relative">
                <Label>{t("password")}</Label>
                <TextInput
                  type={showPassword ? "text" : "password"}
                  value={newUser.passwordHash}
                  onChange={(e) =>
                    setNewUser({ ...newUser, passwordHash: e.target.value })
                  }
                />
                <button
                  className="absolute right-3 top-9 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
            <div>
              <Label>{t("profilePicture")}</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 border-2 flex items-center justify-center overflow-hidden">
                  {(
                    isEditMode ? selectedUser?.avatarUrl : newUser.avatarUrl
                  ) ? (
                    <img
                      src={
                        isEditMode ? selectedUser?.avatarUrl : newUser.avatarUrl
                      }
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Camera className="text-gray-300" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <FileInput
                    id="user-avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="user-avatar"
                    className="inline-block px-4 py-2 bg-white dark:bg-gray-700 rounded-md text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {t("selectImage")}
                  </Label>
                </div>
              </div>
            </div>

            {!isEditMode && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowRolesGrid(!showRolesGrid)}
                  className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-md focus:outline-none"
                >
                  <span>{t("initialSecurityRoles")}</span>
                  <svg
                    data-accordion-icon
                    className={`w-4 h-4 shrink-0 transition-transform ${showRolesGrid ?"rotate-180":""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {showRolesGrid && (
                  <div className="p-3 mt-2 rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2">
                      {roles?.map((r) => (
                        <label
                          key={r.id}
                          className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <Checkbox
                            id={`newuser-role-${r.id}`}
                            checked={selectedNewUserRoles.includes(r.name)}
                            onChange={() =>
                              setSelectedNewUserRoles((prev) =>
                                prev.includes(r.name)
                                  ? prev.filter((x) => x !== r.name)
                                  : [...prev, r.name],
                              )
                            }
                          />
                          <span className="flex-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                            {r.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t">
          <CustomModalFooter
            onClose={() => setShowCreateModal(false)}
            isEditMode={isEditMode}
            submitText={isEditMode ? t("updateUser") : t("createUser")}
            onSubmit={handleCreateUser}
            cancelText={t("cancel")}
            hideBorder
          />
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        show={showResetModal}
        onClose={() => setShowResetModal(false)}
        size="md"
      >
        <CustomModalHeader
          title={t("resetPassword")}
          subtitle={t("securityManagement")}
          onClose={() => setShowResetModal(false)}
        />
        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
              {t("userLabel")}{" "}
              <span className="font-bold text-blue-600">
                {selectedUser?.userName}
              </span>
            </div>
            <div>
              <Label>{t("newSecurePassword")}</Label>
              <TextInput
                type={showPassword ? "text" : "password"}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t">
          <CustomModalFooter
            onClose={() => setShowResetModal(false)}
            isEditMode={false}
            submitText={t("saveChanges")}
            onSubmit={handleResetPassword}
            cancelText={t("cancel")}
            hideBorder
          />
        </div>
      </Modal>

      {/* Roles Modal */}
      <Modal
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        size="md"
      >
        <CustomModalHeader
          title={t("assignSecurityRoles")}
          subtitle={t("securityManagement")}
          onClose={() => setShowRoleModal(false)}
        />
        <ModalBody>
          <div className="grid grid-cols-2 gap-3">
            {roles?.map((r) => (
              <label
                key={r.id}
                className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Checkbox
                  id={`role-${r.id}`}
                  checked={selectedRoles.includes(r.name)}
                  onChange={() =>
                    setSelectedRoles((prev) =>
                      prev.includes(r.name)
                        ? prev.filter((x) => x !== r.name)
                        : [...prev, r.name],
                    )
                  }
                />
                <span className="flex-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                  {r.name}
                </span>
              </label>
            ))}
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t">
          <CustomModalFooter
            onClose={() => setShowRoleModal(false)}
            isEditMode={false}
            submitText={t("updateRoles")}
            onSubmit={saveRoles}
            cancelText={t("cancel")}
            hideBorder
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
