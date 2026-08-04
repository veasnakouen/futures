import React from "react";
import { Button, Checkbox } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import { SlidersHorizontal, RefreshCw, UserPlus } from "lucide-react";

interface Props {
  state: any;
}

export default function UserToolbar({ state }: Props) {
  const {
    t,
    searchTerm,
    setSearchTerm,
    loading,
    visibleColumns,
    toggleColumn,
    isSuperAdmin,
    setShowCreateModal,
    setIsEditMode,
    setEditingId,
    setNewUser,
    setSelectedNewUserRoles,
    fetchData,
  } = state;

  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);

  const handleOpenAddModal = () => {
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
    setShowCreateModal(true);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-gray-50/60 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
      <div className="relative flex-1 max-w-md">
        <SearchInput
          placeholder={t("searchUsersByUsernameEmail")}
          value={searchTerm}
          onChange={(val: any) => setSearchTerm(typeof val === "string" ? val : val?.target?.value || "")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Customizable Columns Dropdown */}
        <div className="relative">
          <Button
            color="light"
            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            className="rounded-xl font-black uppercase text-xs tracking-wider border-gray-200"
          >
            <SlidersHorizontal size={16} className="mr-2 text-indigo-600" /> Columns
          </Button>

          {showColumnDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 z-50 space-y-2 animate-fade-in">
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b pb-2">
                Display Columns
              </h5>
              <div className="space-y-2 text-xs font-bold text-gray-700 dark:text-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleColumns.profile} onChange={() => toggleColumn("profile")} />
                  Profile Identity
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleColumns.contact} onChange={() => toggleColumn("contact")} />
                  Contact Info
                </label>
                {isSuperAdmin && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={visibleColumns.credentials} onChange={() => toggleColumn("credentials")} />
                    Password Hash
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleColumns.roles} onChange={() => toggleColumn("roles")} />
                  Assigned Roles
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleColumns.status} onChange={() => toggleColumn("status")} />
                  Account Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleColumns.governance} onChange={() => toggleColumn("governance")} />
                  Governance Actions
                </label>
              </div>
            </div>
          )}
        </div>

        <Button
          color="light"
          onClick={() => fetchData()}
          disabled={loading}
          className="rounded-xl font-black uppercase text-xs tracking-wider border-gray-200"
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin text-blue-600" : ""}`} /> Refresh
        </Button>

        <Button
          color="blue"
          onClick={handleOpenAddModal}
          className="rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20"
        >
          <UserPlus size={18} className="mr-2" /> {t("createNewUser")}
        </Button>
      </div>
    </div>
  );
}
