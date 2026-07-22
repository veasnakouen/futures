import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import apiCache from "@/services/apiCache";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Checkbox,
  ModalBody,
  Select,
} from "@/lib/flowbite-compat";
import ModernPagination from "@/components/common/ModernPagination";
import {
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  BookmarkPlus,
  Users,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import SearchInput from "@/components/common/SearchInput";

import RoleTable from "./RoleTable";
import PermissionMatrixGrid from "./PermissionMatrixGrid";

const RoleManagement = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showPermAssignModal, setShowPermAssignModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreatePermModal, setShowCreatePermModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // New Role/Perm state
  const [newRole, setNewRole] = useState({ name: "" });
  const [selectedNewRolePerms, setSelectedNewRolePerms] = useState<string[]>([]);
  const [showPermissionsGrid, setShowPermissionsGrid] = useState(false);
  const [newPerm, setNewPerm] = useState({
    name: "",
    description: "",
    resource: "",
  });
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const RESOURCES = [
    "Dashboard",
    "Users",
    "Clients",
    "Inventory",
    "Reports",
    "Support",
    "Finance",
    "System",
  ];
  const ACTIONS = ["READ", "CREATE", "UPDATE", "DELETE", "EXPORT", "ADMIN"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        apiCache.get("/admin/roles", undefined, { forceRefresh }),
        apiCache.get("/admin/permissions", undefined, { forceRefresh }),
      ]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setPermissions(Array.isArray(permsData) ? permsData : []);
    } catch (e: any) {
      console.warn("Failed to fetch roles/permissions from backend, using fallback layer", e);
      if (roles.length === 0) {
        setRoles([
          { id: "1", name: "SUPER_ADMIN", description: "Full system control", permissions: ["READ", "WRITE", "DELETE", "ADMIN"] },
          { id: "2", name: "ADMIN", description: "Administrative access", permissions: ["READ", "WRITE"] },
          { id: "3", name: "MANAGER", description: "Operational manager access", permissions: ["READ", "UPDATE"] },
          { id: "4", name: "USER", description: "Standard user access", permissions: ["READ"] },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (role: any) => {
    setSelectedRole(role);
    const existingPerms = role.permissions?.map((p: any) => p.name || p) || [];
    setSelectedPerms(existingPerms);
    setShowPermAssignModal(true);
  };

  const handleSaveAssignedPerms = async () => {
    if (!selectedRole) return;
    try {
      await api.put(`/admin/roles/${selectedRole.id}/permissions`, {
        permissions: selectedPerms,
      });
      toast.success(t("permissionsUpdated") || "Permissions updated successfully");
      setShowPermAssignModal(false);
      fetchData();
    } catch (e: any) {
      toast.error(t("failedToUpdatePermissions") || "Failed to update permissions");
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) return toast.error("Role name is required");
    try {
      await api.post("/admin/roles", {
        name: newRole.name.trim().toUpperCase(),
        permissions: selectedNewRolePerms,
      });
      toast.success(t("roleCreated") || "Role created successfully");
      setShowCreateRoleModal(false);
      setNewRole({ name: "" });
      setSelectedNewRolePerms([]);
      fetchData();
    } catch (e: any) {
      toast.error("Failed to create role");
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-600 dark:text-blue-400" size={28} />
            <span>{t("roleManagement")}</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            {t("roleManagementSubtitle") || "Define security roles and assign granular RBAC module permissions."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={(val: any) => setSearchTerm(typeof val === "string" ? val : val?.target?.value || "")}
            placeholder={t("searchRoles") || "Search roles..."}
          />
          <Button color="blue" onClick={() => setShowCreateRoleModal(true)} className="rounded-xl font-bold">
            <PlusCircle size={18} className="mr-2" />
            <span>{t("createRole")}</span>
          </Button>
          <Button color="gray" onClick={fetchData} className="rounded-xl">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* Role Grid */}
      <RoleTable
        roles={paginatedRoles}
        t={t}
        onAssignPermissions={handleOpenAssignModal}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <ModernPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {/* Assign Permissions Modal */}
      <Modal
        show={showPermAssignModal}
        onClose={() => setShowPermAssignModal(false)}
        size="lg"
      >
        <CustomModalHeader
          title={t("assignRolePermissions") || `Assign Permissions: ${selectedRole?.name}`}
          onClose={() => setShowPermAssignModal(false)}
        />
        <ModalBody>
          <PermissionMatrixGrid
            permissions={permissions}
            selectedPerms={selectedPerms}
            onTogglePerm={(permName) => {
              if (selectedPerms.includes(permName)) {
                setSelectedPerms(selectedPerms.filter((p) => p !== permName));
              } else {
                setSelectedPerms([...selectedPerms, permName]);
              }
            }}
            onToggleAll={(checked) => {
              if (checked) {
                setSelectedPerms(permissions.map((p) => p.name || p));
              } else {
                setSelectedPerms([]);
              }
            }}
          />
        </ModalBody>
        <CustomModalFooter
          onSubmit={handleSaveAssignedPerms}
          onClose={() => setShowPermAssignModal(false)}
          submitText={t("savePermissions") || "Save Permissions"}
        />
      </Modal>

      {/* Create Role Modal */}
      <Modal
        show={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        size="md"
      >
        <CustomModalHeader
          title={t("createNewRole") || "Create Security Role"}
          onClose={() => setShowCreateRoleModal(false)}
        />
        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="roleName" value={t("roleName") || "Role Identifier"} />
            <TextInput
              id="roleName"
              value={newRole.name}
              onChange={(e) => setNewRole({ name: e.target.value })}
              placeholder="e.g. AUDITOR_ROLE"
              required
              className="mt-1"
            />
          </div>
        </ModalBody>
        <CustomModalFooter
          onSubmit={handleCreateRole}
          onClose={() => setShowCreateRoleModal(false)}
          submitText={t("createRole") || "Create Role"}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;
