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
    "Users",
    "Roles",
    "Cases",
    "Inventory",
    "HR",
    "School",
    "Clinic",
    "Billing",
    "Hotel",
    "POS",
    "Reports",
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
          { id: "1", name: "SUPERADMIN", description: "Platform-wide root access across all services & tenants", permissions: ["SYSTEM_CONFIG", "USER_WRITE", "ROLE_MANAGE", "CASES_WRITE", "INVENTORY_WRITE", "CLINIC_WRITE", "BILLING_WRITE"] },
          { id: "2", name: "ADMIN", description: "Administrative governance, user, and role management access", permissions: ["USER_READ", "USER_WRITE", "ROLE_MANAGE", "CASES_READ", "REPORTS_EXPORT"] },
          { id: "3", name: "HR_ADMIN", description: "Workforce management, employee profiles, and leave approvals", permissions: ["HR_READ", "HR_WRITE", "USER_READ", "REPORTS_EXPORT"] },
          { id: "4", name: "SCHOOL_ADMIN", description: "Academic administration, courses, departments, and students", permissions: ["SCHOOL_READ", "SCHOOL_WRITE", "REPORTS_EXPORT"] },
          { id: "5", name: "CLINIC_ADMIN", description: "Clinical operations, medical records, doctors, and IPD wards", permissions: ["CLINIC_READ", "CLINIC_WRITE", "REPORTS_EXPORT"] },
          { id: "6", name: "FINANCE_MANAGER", description: "Financial ledgers, invoices, and payment processing", permissions: ["BILLING_READ", "BILLING_WRITE", "REPORTS_EXPORT"] },
          { id: "7", name: "USER", description: "Standard operational user role with assigned module access", permissions: ["USER_READ", "CASES_READ"] },
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
      fetchData(true);
    } catch (e: any) {
      toast.error("Failed to create role");
    }
  };

  const handleCreatePermission = async () => {
    if (!newPerm.name.trim()) return toast.error("Permission identifier is required");
    try {
      await api.post("/admin/permissions", {
        name: newPerm.name.trim().toUpperCase(),
        description: newPerm.description.trim(),
        resource: newPerm.resource || "System",
      });
      toast.success("Permission created successfully");
      setShowCreatePermModal(false);
      setNewPerm({ name: "", description: "", resource: "" });
      fetchData(true);
    } catch (e: any) {
      toast.error(e?.response?.data || "Failed to create permission");
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
          <Button color="light" onClick={() => setShowCreatePermModal(true)} className="rounded-xl font-bold border-gray-200 dark:border-gray-700">
            <BookmarkPlus size={18} className="mr-2 text-indigo-600 dark:text-indigo-400" />
            <span>Add Permission</span>
          </Button>
          <Button color="blue" onClick={() => setShowCreateRoleModal(true)} className="rounded-xl font-bold">
            <PlusCircle size={18} className="mr-2" />
            <span>{t("createRole")}</span>
          </Button>
          <Button color="gray" onClick={() => fetchData(true)} className="rounded-xl">
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

      {/* Create Permission Modal */}
      <Modal
        show={showCreatePermModal}
        onClose={() => setShowCreatePermModal(false)}
        size="md"
      >
        <CustomModalHeader
          title="Create Custom Permission"
          onClose={() => setShowCreatePermModal(false)}
        />
        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="permName" value="Permission Identifier" />
            <TextInput
              id="permName"
              value={newPerm.name}
              onChange={(e) => setNewPerm({ ...newPerm, name: e.target.value })}
              placeholder="e.g. INVENTORY_AUDIT_EXPORT"
              required
              className="mt-1 font-mono uppercase"
            />
          </div>
          <div>
            <Label htmlFor="permResource" value="Target Resource / Domain" />
            <Select
              id="permResource"
              value={newPerm.resource}
              onChange={(e) => setNewPerm({ ...newPerm, resource: e.target.value })}
              className="mt-1"
            >
              <option value="">Select Domain Resource...</option>
              {RESOURCES.map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="permDesc" value="Description" />
            <TextInput
              id="permDesc"
              value={newPerm.description}
              onChange={(e) => setNewPerm({ ...newPerm, description: e.target.value })}
              placeholder="e.g. Allows auditing and exporting stock inventory records"
              className="mt-1"
            />
          </div>
        </ModalBody>
        <CustomModalFooter
          onSubmit={handleCreatePermission}
          onClose={() => setShowCreatePermModal(false)}
          submitText="Create Permission"
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;
