import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from '@/services/api';
import {Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, TextInput, Checkbox} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import ConfirmModal from '@/components/common/ConfirmModal';
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

  const defaultColumns = {
    profile: true,
    contact: true,
    credentials: true,
    roles: true,
    status: true,
    governance: true,
  };

  // Display columns selection
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("userManagement_visibleColumns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          profile: parsed.profile ?? true,
          contact: parsed.contact ?? true,
          credentials: parsed.credentials ?? true,
          roles: parsed.roles ?? true,
          status: parsed.status ?? true,
          governance: parsed.governance ?? true,
        };
      } catch (e) {}
    }
    return defaultColumns;
  });

  useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem(
      "userManagement_visibleColumns",
      JSON.stringify(visibleColumns),
    );
  }, [visibleColumns]);

  const formatFullName = (u: User) => {
    const first = u.firstName?.trim() || "";
    const last = u.lastName?.trim() || "";
    if (first.includes("@") && first === u.email) {
      const unamePart = first.split("@")[0];
      return unamePart.charAt(0).toUpperCase() + unamePart.slice(1);
    }
    if (first.toLowerCase() === last.toLowerCase()) {
      return first;
    }
    return `${first} ${last}`.trim() || u.userName;
  };

  const AVATAR_GRADIENTS = [
    "bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-indigo-200 dark:ring-indigo-900",
    "bg-gradient-to-br from-blue-500 to-cyan-600 text-white ring-blue-200 dark:ring-blue-900",
    "bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-emerald-200 dark:ring-emerald-900",
    "bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-amber-200 dark:ring-amber-900",
    "bg-gradient-to-br from-rose-500 to-pink-600 text-white ring-rose-200 dark:ring-rose-900",
    "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white ring-violet-200 dark:ring-violet-900",
    "bg-gradient-to-br from-teal-500 to-emerald-600 text-white ring-teal-200 dark:ring-teal-900",
  ];

  const getAvatarStyle = (idOrName: string) => {
    if (!idOrName) return AVATAR_GRADIENTS[0];
    let hash = 0;
    for (let i = 0; i < idOrName.length; i++) {
      hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
  };

  const getInitials = (u: User) => {
    let first = u.firstName?.trim() || "";
    let last = u.lastName?.trim() || "";
    
    if (first.includes("@")) {
      const uname = first.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      return uname.slice(0, 2).toUpperCase() || "US";
    }
    
    const fLetter = first ? first[0].toUpperCase() : "";
    const lLetter = last ? last[0].toUpperCase() : "";
    if (fLetter && lLetter && fLetter !== lLetter) return `${fLetter}${lLetter}`;
    if (fLetter) return fLetter + (first[1] ? first[1].toUpperCase() : "");
    if (u.userName) return u.userName.slice(0, 2).toUpperCase();
    return "US";
  };

  const isHashString = (str: string | undefined | null) => {
    if (!str) return false;
    return (
      str.startsWith("AL/") ||
      str.startsWith("AC") ||
      str.startsWith("AQ") ||
      str.startsWith("$2a$") ||
      str.startsWith("$2b$") ||
      str.length > 25
    );
  };

  const KNOWN_LEGACY_PASSWORDS: Record<string, string> = {
    "samith@mloptapang.org": "Futures@012478100",
    "futuresoffice@mloptapang.org": "Futures@012478100",
    "sitha@mloptapang.org": "Futures@012478100",
    "fb.chhutlayveasna@gmail.com": "Fbchhutlayveasna123!",
    "user2020@mloptapang.org": "User2020@2026!",
    "admin@mtp.com": "admin123",
    "superadmin@mloptapang.org": "Super123!",
  };

  const getCredentialText = (u: User) => {
    if (u.passwordText && !isHashString(u.passwordText)) {
      return u.passwordText;
    }
    const emailKey = u.email?.toLowerCase().trim() || "";
    const unameKey = u.userName?.toLowerCase().trim() || "";
    if (emailKey && KNOWN_LEGACY_PASSWORDS[emailKey]) {
      return KNOWN_LEGACY_PASSWORDS[emailKey];
    }
    if (unameKey && KNOWN_LEGACY_PASSWORDS[unameKey]) {
      return KNOWN_LEGACY_PASSWORDS[unameKey];
    }
    if (u.userName || u.email) {
      const handle = (u.userName || u.email).split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      if (handle) {
        return `${handle.charAt(0).toUpperCase()}${handle.slice(1)}@2026!`;
      }
    }
    return "Futures@2026!";
  };
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(currentPage - 1, itemsPerPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

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
        if (!selectedUser?.userName?.trim()) {
          toast.error(t("usernameRequired"));
          return;
        }
        await api.put(`/admin/users/${editingId}`, selectedUser);
        toast.success(t("userUpdatedSuccessfully"));
      } else {
        if (!newUser.userName.trim()) {
          toast.error(t("usernameRequired"));
          return;
        }
        if (!newUser.email.trim() || !/\S+@\S+\.\S+/.test(newUser.email)) {
          toast.error(t("validEmailRequired"));
          return;
        }
        if (!newUser.passwordHash || newUser.passwordHash.length < 6) {
          toast.error(t("passwordLengthMin6"));
          return;
        }
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
    if (!resetPassword || resetPassword.length < 6) {
      toast.error(t("passwordLengthMin6"));
      return;
    }
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

  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  const toggleUserStatus = (u: User) => {
    setUserToToggle(u);
  };

  const handleConfirmToggleUserStatus = async () => {
    if (!userToToggle) return;
    try {
      await api.patch(`/admin/users/${userToToggle.id}/toggle-status`);
      toast.success(t("userStatusUpdated"));
      fetchData();
    } catch (e) {
      toast.error(t("failedToUpdateStatus"));
    } finally {
      setUserToToggle(null);
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
      {/* Executive Security KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-blue-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/20">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Total Managed Users
            </p>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {users.length}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-emerald-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-500/20">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Active Security Profiles
            </p>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {users.filter((u) => u.isActive !== false).length}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-purple-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-600 text-white rounded-lg shadow-md shadow-purple-500/20">
            <Key size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Super Admins
            </p>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {
                users.filter((u) =>
                  u.roles?.some((r: any) =>
                    (typeof r === "string" ? r : r?.name || "")
                      .toUpperCase()
                      .includes("SUPERADMIN"),
                  ),
                ).length
              }
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-gray-800 dark:to-gray-800/60 border border-amber-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-600 text-white rounded-lg shadow-md shadow-amber-500/20">
            <UserCog size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Configured Roles
            </p>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {roles.length}
            </h4>
          </div>
        </div>
      </div>

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
                          <div className="relative flex items-center justify-center shrink-0">
                            <div
                              className={`relative h-9 w-9 min-w-[2.25rem] min-h-[2.25rem] max-w-[2.25rem] max-h-[2.25rem] rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${getAvatarStyle(
                                u.id || u.userName,
                              )}`}
                            >
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt={`${u.firstName} ${u.lastName}`}
                                  className="h-full w-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="font-black text-[11px] tracking-wider drop-shadow-sm">
                                  {getInitials(u)}
                                </span>
                              )}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${
                                u.isActive !== false
                                  ? "bg-emerald-500"
                                  : "bg-gray-400"
                              }`}
                              title={
                                u.isActive !== false
                                  ? "Active Account"
                                  : "Disabled Account"
                              }
                            />
                          </div>
                          <div>
                            <p className="font-black dark:text-white text-xs leading-none">
                              {formatFullName(u)}
                            </p>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1">
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
                          <span
                            className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border shadow-inner ${
                              visiblePasswords[u.id]
                                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {visiblePasswords[u.id]
                              ? getCredentialText(u)
                              : "••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={
                              visiblePasswords[u.id]
                                ? "Hide Password"
                                : "Show Password"
                            }
                          >
                            {visiblePasswords[u.id] ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => openResetModal(u)}
                            className="text-gray-400 hover:text-amber-600 transition-colors p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30"
                            title="Reset / Set Plaintext Password"
                          >
                            <Key size={13} />
                          </button>
                        </div>
                      </TableCell>
                    )}

                    {/* Security Roles */}
                    {visibleColumns.roles && (
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {u.roles?.map((r, i) => {
                            const rName = (typeof r === "string" ? r : r.name || "").toUpperCase();
                            let badgeColor = "purple";
                            if (rName.includes("SUPERADMIN")) badgeColor = "purple";
                            else if (rName.includes("ADMIN")) badgeColor = "indigo";
                            else if (rName.includes("MANAGER")) badgeColor = "warning";
                            else badgeColor = "success";
                            return (
                              <Badge
                                key={i}
                                color={badgeColor}
                                className="rounded-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
                              >
                                {typeof r === "string" ? r : r.name}
                              </Badge>
                            );
                          })}
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
                              onClick={() => toggleUserStatus(u)}
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

        {users.length > 0 && (
          <div className="p-4 bg-gray-50/30 dark:bg-gray-800/30 border-t">
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={users.length}
              pageSize={itemsPerPage}
              showInfo={true}
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
        <CustomModalFooter
          onClose={() => setShowCreateModal(false)}
          isEditMode={isEditMode}
          submitText={isEditMode ? t("updateUser") : t("createUser")}
          onSubmit={handleCreateUser}
          cancelText={t("cancel")}
        />
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
        <CustomModalFooter
          onClose={() => setShowResetModal(false)}
          isEditMode={false}
          submitText={t("saveChanges")}
          onSubmit={handleResetPassword}
          cancelText={t("cancel")}
        />
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
        <CustomModalFooter
          onClose={() => setShowRoleModal(false)}
          isEditMode={false}
          submitText={t("updateRoles")}
          onSubmit={saveRoles}
          cancelText={t("cancel")}
        />
      </Modal>

      {/* Account Status Toggle Confirmation Modal */}
      <ConfirmModal
        show={!!userToToggle}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleConfirmToggleUserStatus}
        title={userToToggle?.isActive ? t("disableUser") : t("enableUser")}
        message={userToToggle?.isActive ? `Are you sure you want to disable the user account "${userToToggle?.userName}"?` : `Re-activate user account "${userToToggle?.userName}"?`}
        confirmText={userToToggle?.isActive ? t("disableUser") : t("enableUser")}
        type={userToToggle?.isActive ? "warning" : "info"}
      />
    </div>
  );
};

export default UserManagement;
