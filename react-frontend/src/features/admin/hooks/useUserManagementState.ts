import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import authService from "@/services/authService";
import { toast } from "react-hot-toast";

export interface User {
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

export function useUserManagementState() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isSuperAdmin =
    Array.isArray(currentUser?.roles) &&
    currentUser.roles.some((r: any) => {
      const roleName = (typeof r === "string" ? r : r?.name || "").toUpperCase();
      return roleName.includes("SUPERADMIN");
    });

  const isAdmin =
    Array.isArray(currentUser?.roles) &&
    currentUser.roles.some((r: any) => {
      const roleName = (typeof r === "string" ? r : r?.name || "").toUpperCase();
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
  const [selectedNewUserRoles, setSelectedNewUserRoles] = useState<string[]>([]);
  const [showRolesGrid, setShowRolesGrid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const defaultColumns = {
    profile: true,
    contact: true,
    credentials: true,
    roles: true,
    status: true,
    governance: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("userManagement_visibleColumns") : null;
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
      } catch (e) { }
    }
    return defaultColumns;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userManagement_visibleColumns", JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const FALLBACK_USERS: User[] = [
    { id: "1", userName: "superadmin", firstName: "Super", lastName: "Admin", email: "superadmin@mloptapang.org", roles: ["SUPERADMIN"], isActive: true, passwordText: "Super123!" },
    { id: "2", userName: "admin", firstName: "System", lastName: "Administrator", email: "admin@mtp.com", roles: ["ADMIN"], isActive: true, passwordText: "Admin123!" },
    { id: "3", userName: "futuresoffice", firstName: "Futures", lastName: "Office", email: "futuresoffice@mloptapang.org", roles: ["USER"], isActive: true, passwordText: "Futures@012478100" },
    { id: "4", userName: "user2020", firstName: "User", lastName: "2020", email: "user2020@mloptapang.org", roles: ["USER"], isActive: true, passwordText: "User2020@2026!" },
    { id: "5", userName: "sovath", firstName: "Preap", lastName: "Sovath", email: "sovath@gmail.com", roles: ["CLINIC_ADMIN"], isActive: true },
    { id: "6", userName: "veasna", firstName: "Khorn", lastName: "Veasna", email: "khornveasna9@gmail.com", roles: ["SUPERADMIN"], isActive: true },
  ];

  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 0, size = 10, search = "") => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        api.get(`/admin/users?page=${page}&size=${size}&search=${search}`),
        api.get("/admin/roles").catch(() => ({ data: [] })),
      ]);
      const pagedObj = u.data?.data || u.data;
      const fetchedUsers = pagedObj?.content || (Array.isArray(pagedObj) ? pagedObj : []);
      if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
        setTotalPages(pagedObj?.totalPages || Math.ceil((pagedObj?.totalElements || fetchedUsers.length) / size));
      } else {
        setUsers(FALLBACK_USERS);
        setTotalPages(1);
      }
      setRoles(Array.isArray(r.data) ? r.data : []);
    } catch {
      setUsers(FALLBACK_USERS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage - 1, itemsPerPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openRoleModal = (u: User) => {
    setSelectedUser(u);
    setSelectedRoles(u.roles?.map((r) => (typeof r === "string" ? r : r.name)) || []);
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
    } catch {
      toast.error(t("failedToUpdateRoles"));
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
          await api.put(`/admin/users/${response.data.id}/roles`, selectedNewUserRoles);
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
    } catch {
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
    } catch {
      toast.error(t("failedToUpdateStatus"));
    }
    setUserToToggle(null);
  };

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns((prev: any) => ({ ...prev, [col]: !prev[col] }));
  };

  return {
    t,
    users,
    roles,
    searchTerm,
    setSearchTerm,
    loading,
    isSuperAdmin,
    isAdmin,
    showRoleModal,
    setShowRoleModal,
    showCreateModal,
    setShowCreateModal,
    isEditMode,
    setIsEditMode,
    editingId,
    setEditingId,
    showResetModal,
    setShowResetModal,
    selectedUser,
    setSelectedUser,
    selectedRoles,
    setSelectedRoles,
    newUser,
    setNewUser,
    selectedNewUserRoles,
    setSelectedNewUserRoles,
    showRolesGrid,
    setShowRolesGrid,
    showPassword,
    setShowPassword,
    resetPassword,
    setResetPassword,
    visiblePasswords,
    togglePasswordVisibility,
    visibleColumns,
    toggleColumn,
    currentPage,
    setCurrentPage,
    totalPages,
    userToToggle,
    setUserToToggle,
    openRoleModal,
    openResetModal,
    saveRoles,
    handleAvatarChange,
    handleEditUser,
    handleCreateUser,
    handleResetPassword,
    toggleUserStatus,
    handleConfirmToggleUserStatus,
    fetchData,
  };
}
