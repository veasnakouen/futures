import React, { useEffect, useState } from "react";
import api from '@/services/api';
import {
  Table,
  Button,
  Modal,
  Label,
  Badge,
  TextInput,
  Checkbox,
  Card,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Select,
  FloatingLabel,
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import {
  X,
  ShieldCheck,
  Lock,
  Search,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  PlusCircle,
  BookmarkPlus,
  Database,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

const RoleManagement = () => {
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
  const [selectedNewRolePerms, setSelectedNewRolePerms] = useState<string[]>(
    [],
  );
  const [showPermissionsGrid, setShowPermissionsGrid] = useState(false);
  const [newPerm, setNewPerm] = useState({
    name: "",
    description: "",
    resource: "",
  });
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Resource list
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([
        api.get("/admin/roles"),
        api.get("/admin/permissions"),
      ]);
      setRoles(r.data);
      setPermissions(p.data);
    } catch (e) {
      console.error("ROLE FETCH ERROR:", e);
      toast.error("Failed to load role definitions");
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
      const response = await api.post("/admin/roles", newRole);

      if (selectedNewRolePerms.length > 0 && response.data?.id) {
        await api.put(
          `/admin/roles/${response.data.id}/permissions`,
          selectedNewRolePerms,
        );
      }

      toast.success("Security role created");
      setShowCreateRoleModal(false);
      setNewRole({ name: "" });
      setSelectedNewRolePerms([]);
      setShowPermissionsGrid(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || "Failed to create role");
    }
  };

  const handleCreatePerm = async () => {
    if (!newPerm.resource) {
      toast.error("Please select a resource");
      return;
    }
    if (selectedActions.length === 0) {
      toast.error("Please select at least one action right");
      return;
    }

    setLoading(true);
    let successCount = 0;
    let existCount = 0;
    let failCount = 0;

    try {
      await Promise.all(
        selectedActions.map(async (action) => {
          try {
            const generatedName = `${newPerm.resource.toUpperCase()}_${action.toUpperCase()}`;
            await api.post("/admin/permissions", {
              name: generatedName,
              description:
                newPerm.description ||
                `Grant ${action} access to ${newPerm.resource}`,
              resource: newPerm.resource,
              action: action,
            });
            successCount++;
          } catch (e: any) {
            if (
              e.response?.status === 400 &&
              (e.response?.data === "Permission already exists" ||
                e.response?.data?.message?.includes("exists"))
            ) {
              existCount++;
            } else {
              failCount++;
              console.error(
                `Failed to create permission for action ${action}:`,
                e,
              );
            }
          }
        }),
      );

      if (successCount > 0) {
        toast.success(`Defined ${successCount} new permission(s)`);
      }
      if (existCount > 0 && successCount === 0) {
        toast.error("Selected permission(s) already exist");
      } else if (existCount > 0) {
        toast.success(`${existCount} permission(s) already existed`);
      }
      if (failCount > 0) {
        toast.error(`Failed to define ${failCount} permission(s)`);
      }

      if (successCount > 0 || existCount > 0) {
        setShowCreatePermModal(false);
        setNewPerm({ name: "", description: "", resource: "" });
        setSelectedActions([]);
        fetchData();
      }
    } catch (e) {
      toast.error("An error occurred while defining permissions");
    } finally {
      setLoading(false);
    }
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    try {
      await api.put(
        `/admin/roles/${selectedRole.id}/permissions`,
        selectedPerms,
      );
      toast.success(`Permissions updated for ${selectedRole.name}`);
      setShowPermAssignModal(false);
      fetchData();
    } catch (e) {
      toast.error("Failed to apply permissions");
    }
  };

  const filteredRoles = roles?.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil((filteredRoles?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
            <Button color="blue" onClick={() => setShowCreateRoleModal(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Role
            </Button>
            <Button color="blue" onClick={() => setShowCreatePermModal(true)}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Permission
            </Button>
            <Button color="gray" onClick={fetchData} disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRoles?.map((r) => (
          <Card key={r.id}>
            <div className="flex justify-between items-start">
              <ShieldAlert className="w-6 h-6 text-gray-400" />
              <Badge color={r.name.includes("ADMIN") ? "failure" : "info"}>
                {r.name.includes("ADMIN") ? "High Authority" : "Standard Role"}
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
        <div className="mt-6">
          <ModernPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRoles?.length || 0}
            pageSize={itemsPerPage}
          />
        </div>
      )}

      {/* Create Role Modal */}
      <Modal
        show={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        size="xl"
      >
        <CustomModalHeader
          title="Define Security Role"
          subtitle="Security Management"
          onClose={() => setShowCreateRoleModal(false)}
        />
        <ModalBody>
          <div className="space-y-6">
            <div>
              <Label>Role Identifier (e.g. SUPERVISOR)</Label>
              <TextInput
                placeholder="REPORTS_ADMIN"
                value={newRole.name}
                onChange={(e) => setNewRole({ name: e.target.value })}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowPermissionsGrid(!showPermissionsGrid)}
                className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-md border border-gray-200 dark:border-gray-600 focus:outline-none"
              >
                <span>Assign Permissions</span>
                <svg
                  data-accordion-icon
                  className={`w-4 h-4 shrink-0 transition-transform ${showPermissionsGrid ? "rotate-180" : ""}`}
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
              {showPermissionsGrid && (
                <div className="p-3 mt-2 border border-gray-100 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-end mb-3">
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => {
                        if (selectedNewRolePerms.length === permissions.length && permissions.length > 0) {
                          setSelectedNewRolePerms([]);
                        } else {
                          setSelectedNewRolePerms(permissions.map(p => p.name));
                        }
                      }}
                    >
                      {selectedNewRolePerms.length === permissions.length && permissions.length > 0 ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2">
                    {permissions?.map((p) => (
                      <label
                        key={p.id}
                        className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <Checkbox
                          id={`newrole-perm-${p.id}`}
                          checked={selectedNewRolePerms.includes(p.name)}
                          onChange={() =>
                            setSelectedNewRolePerms((prev) =>
                              prev.includes(p.name)
                                ? prev.filter((x) => x !== p.name)
                                : [...prev, p.name],
                            )
                          }
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700 dark:text-gray-200">
                              {p.name}
                            </span>
                            {p.action && (
                              <Badge
                                color={
                                  p.action === "DELETE" || p.action === "ADMIN"
                                    ? "failure"
                                    : "info"
                                }
                                size="xs"
                                className="px-1 py-0"
                              >
                                {p.action}
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                            {p.description ||
                              `Grant ${p.action} access to ${p.resource}`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <CustomModalFooter
            onClose={() => setShowCreateRoleModal(false)}
            isEditMode={false}
            submitText="Save Role"
            onSubmit={handleCreateRole}
            cancelText="Cancel"
          />
        </div>
      </Modal>

      {/* Create Permission Modal */}
      <Modal
        show={showCreatePermModal}
        onClose={() => setShowCreatePermModal(false)}
        size="md"
      >
        <CustomModalHeader
          title="New Resource-Based Permission"
          subtitle="Security Management"
          onClose={() => setShowCreatePermModal(false)}
        />
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Target Resource</Label>
              <Select
                value={newPerm.resource}
                onChange={(e) =>
                  setNewPerm({ ...newPerm, resource: e.target.value })
                }
              >
                <option value="">Select a resource...</option>
                {RESOURCES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Action Rights (Multi-Select)</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {ACTIONS.map((a) => {
                  const isChecked = selectedActions.includes(a);
                  return (
                    <label
                      key={a}
                      className={`flex items-center gap-2 p-2.5 rounded-md cursor-pointer border transition-all duration-150 ${
                        isChecked
                          ? "bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-sm"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onChange={() =>
                          setSelectedActions((prev) =>
                            prev.includes(a)
                              ? prev.filter((x) => x !== a)
                              : [...prev, a],
                          )
                        }
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {a}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                placeholder="Brief explanation of this right"
                value={newPerm.description}
                onChange={(e) =>
                  setNewPerm({ ...newPerm, description: e.target.value })
                }
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-[10px] text-gray-500 font-mono space-y-1">
              <span className="font-bold block text-gray-400 uppercase text-[9px] mb-1">
                Generated Names:
              </span>
              {newPerm.resource && selectedActions.length > 0 ? (
                selectedActions.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{`${newPerm.resource.toUpperCase()}_${a.toUpperCase()}`}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">
                  Select resource and at least one action right...
                </span>
              )}
            </div>
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <CustomModalFooter
            onClose={() => setShowCreatePermModal(false)}
            isEditMode={false}
            submitText="Create Permission"
            onSubmit={handleCreatePerm}
            cancelText="Cancel"
          />
        </div>
      </Modal>

      {/* Permission Assignment Modal */}
      <Modal
        show={showPermAssignModal}
        onClose={() => setShowPermAssignModal(false)}
        size="xl"
      >
        <CustomModalHeader
          title={`Configure Access Rights: ${selectedRole?.name}`}
          subtitle="Security Management"
          onClose={() => setShowPermAssignModal(false)}
        />
        <ModalBody>
          <div className="flex justify-end mb-3">
            <Button
              size="xs"
              color="gray"
              onClick={() => {
                if (selectedPerms.length === permissions.length && permissions.length > 0) {
                  setSelectedPerms([]);
                } else {
                  setSelectedPerms(permissions.map(p => p.name));
                }
              }}
            >
              {selectedPerms.length === permissions.length && permissions.length > 0 ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
            {permissions?.map((p) => (
              <label
                key={p.id}
                className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Checkbox
                  id={`perm-${p.id}`}
                  checked={selectedPerms.includes(p.name)}
                  onChange={() =>
                    setSelectedPerms((prev) =>
                      prev.includes(p.name)
                        ? prev.filter((x) => x !== p.name)
                        : [...prev, p.name],
                    )
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {p.name}
                    </span>
                    {p.action && (
                      <Badge
                        color={
                          p.action === "DELETE" || p.action === "ADMIN"
                            ? "failure"
                            : "info"
                        }
                        size="xs"
                        className="px-1 py-0"
                      >
                        {p.action}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                    {p.description ||
                      `Grant ${p.action} access to ${p.resource}`}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <CustomModalFooter
            onClose={() => setShowPermAssignModal(false)}
            isEditMode={false}
            submitText="Save Configuration"
            onSubmit={savePermissions}
            cancelText="Cancel"
          />
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;
