import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from '@/services/api';
import {Table, Button, Modal, Label, Badge, TextInput, Checkbox, ModalFooter, ModalHeader, ModalBody, Select, FloatingLabel, Accordion, AccordionPanel, AccordionTitle, AccordionContent} from '@/lib/flowbite-compat';
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
import SearchInput from "@/components/common/SearchInput";

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
      toast.error(t("failedToLoadRoleDefs"));
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

      toast.success(t("securityRoleCreated"));
      setShowCreateRoleModal(false);
      setNewRole({ name: "" });
      setSelectedNewRolePerms([]);
      setShowPermissionsGrid(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.response?.data || t("failedToCreateRole"));
    }
  };

  const handleCreatePerm = async () => {
    if (!newPerm.resource) {
      toast.error(t("pleaseSelectResource"));
      return;
    }
    if (selectedActions.length === 0) {
      toast.error(t("pleaseSelectActionRight"));
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
                t("grantAccessDesc", { action, resource: newPerm.resource }),
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
        toast.success(t("definedNewPermissions", { count: successCount }));
      }
      if (existCount > 0 && successCount === 0) {
        toast.error(t("selectedPermissionsExist"));
      } else if (existCount > 0) {
        toast.success(t("permissionsAlreadyExisted", { count: existCount }));
      }
      if (failCount > 0) {
        toast.error(t("failedToDefinePermissions", { count: failCount }));
      }

      if (successCount > 0 || existCount > 0) {
        setShowCreatePermModal(false);
        setNewPerm({ name: "", description: "", resource: "" });
        setSelectedActions([]);
        fetchData();
      }
    } catch (e) {
      toast.error(t("errorDefiningPermissions"));
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
      toast.success(t("permissionsUpdatedFor", { name: selectedRole.name }));
      setShowPermAssignModal(false);
      fetchData();
    } catch (e) {
      toast.error(t("failedToApplyPermissions"));
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
    <div className="space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-emerald-100/50 dark:shadow-black/40 p-6 border border-white/20 dark:border-gray-700/50 animate-fade-in">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("advancedAccessControl")}
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchInput
                        placeholder={t("searchPlaceholder")}
                        value={searchTerm}
                        onChange={setSearchTerm}
                        containerClassName="w-full md:w-64"
                      />
            <Button color="blue" onClick={() => setShowCreateRoleModal(true)} className="rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("role")}
            </Button>
            <Button color="blue" onClick={() => setShowCreatePermModal(true)} className="rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              {t("permission")}
            </Button>
            <Button color="gray" onClick={fetchData} disabled={loading} className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              <RefreshCw
                className={`w-4 h-4 ${loading ?"animate-spin":""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRoles?.map((r) => (
          <div
            key={r.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-900/40 hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <Badge color={r.name.includes("ADMIN") ? "failure" : "info"}>
                {r.name.includes("ADMIN") ? t("highAuthority") : t("standardRole")}
              </Badge>
            </div>
            <div className="flex-1 mb-6">
              <h5 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-1">
                {r.name}
              </h5>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("managedRights", { count: r.permissions?.length || 0 })}
              </p>
            </div>
            <Button
              color="blue"
              onClick={() => openPermAssignModal(r)}
              className="w-full shadow-lg shadow-blue-500/20 rounded-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              {t("configureAccess")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
          title={t("defineSecurityRole")}
          subtitle={t("securityManagement")}
          onClose={() => setShowCreateRoleModal(false)}
        />
        <ModalBody>
          <div className="space-y-6">
            <div>
              <Label>{t("roleIdentifier")}</Label>
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
                className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-md focus:outline-none"
              >
                <span>{t("assignPermissions")}</span>
                <svg
                  data-accordion-icon
                  className={`w-4 h-4 shrink-0 transition-transform ${showPermissionsGrid ?"rotate-180":""}`}
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
                <div className="p-3 mt-2 rounded-md bg-gray-50 dark:bg-gray-800">
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
                      {selectedNewRolePerms.length === permissions.length && permissions.length > 0 ? t("deselectAll") : t("selectAll")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2">
                    {permissions?.map((p) => (
                      <label
                        key={p.id}
                        className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
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
                              t("grantAccessDesc", { action: p.action, resource: p.resource })}
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
            submitText={t("saveRole")}
            onSubmit={handleCreateRole}
            cancelText={t("cancel")}
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
          title={t("newResourceBasedPermission")}
          subtitle={t("securityManagement")}
          onClose={() => setShowCreatePermModal(false)}
        />
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>{t("targetResource")}</Label>
              <Select
                value={newPerm.resource}
                onChange={(e) =>
                  setNewPerm({ ...newPerm, resource: e.target.value })
                }
              >
                <option value="">{t("selectResource")}</option>
                {RESOURCES.map((r) => (
                  <option key={r} value={r}>
                    {t(r.toLowerCase(), { defaultValue: r })}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t("actionRights")}</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {ACTIONS.map((a) => {
                  const isChecked = selectedActions.includes(a);
                  return (
                    <label
                      key={a}
                      className={`flex items-center gap-2 p-2.5 rounded-md cursor-pointer transition-all duration-150 ${ isChecked ?"bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-sm":"bg-white dark:bg-gray-800  hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
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
              <Label>{t("description")}</Label>
              <TextInput
                placeholder={t("briefExplanation")}
                value={newPerm.description}
                onChange={(e) =>
                  setNewPerm({ ...newPerm, description: e.target.value })
                }
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-[10px] text-gray-500 font-mono space-y-1">
              <span className="font-bold block text-gray-400 uppercase text-[9px] mb-1">
                {t("generatedNames")}
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
                  {t("selectResourceAndAction")}
                </span>
              )}
            </div>
          </div>
        </ModalBody>
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <CustomModalFooter
            onClose={() => setShowCreatePermModal(false)}
            isEditMode={false}
            submitText={t("createPermission")}
            onSubmit={handleCreatePerm}
            cancelText={t("cancel")}
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
          title={t("configureAccessRightsFor", { name: selectedRole?.name })}
          subtitle={t("securityManagement")}
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
              {selectedPerms.length === permissions.length && permissions.length > 0 ? t("deselectAll") : t("selectAll")}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
            {permissions?.map((p) => (
              <label
                key={p.id}
                className="flex flex-row items-center justify-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                      t("grantAccessDesc", { action: p.action, resource: p.resource })}
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
            submitText={t("saveConfiguration")}
            onSubmit={savePermissions}
            cancelText={t("cancel")}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;
