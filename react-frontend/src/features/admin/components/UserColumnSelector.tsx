import React from "react";
import { Button, Checkbox } from "@/lib/flowbite-compat";
import { SlidersHorizontal } from "lucide-react";

interface UserColumnSelectorProps {
  visibleColumns: {
    profile: boolean;
    contact: boolean;
    credentials: boolean;
    roles: boolean;
    status: boolean;
    governance: boolean;
  };
  toggleColumn: (key: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  isSuperAdmin: boolean;
  t: (key: string) => string;
}

export const UserColumnSelector: React.FC<UserColumnSelectorProps> = ({
  visibleColumns,
  toggleColumn,
  showDropdown,
  setShowDropdown,
  isSuperAdmin,
  t,
}) => {
  return (
    <div className="relative">
      <Button
        color="gray"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center rounded-xl font-bold"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        {t("columns") || "Columns"}
      </Button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-4 z-20 space-y-2.5 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              {t("displayColumns") || "Display Columns"}
            </h3>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
              <Checkbox
                checked={visibleColumns.profile}
                onChange={() => toggleColumn("profile")}
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                {t("userProfile") || "User Profile"}
              </span>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
              <Checkbox
                checked={visibleColumns.contact}
                onChange={() => toggleColumn("contact")}
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                {t("contactInfo") || "Contact Info"}
              </span>
            </label>

            {isSuperAdmin && (
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
                <Checkbox
                  checked={visibleColumns.credentials}
                  onChange={() => toggleColumn("credentials")}
                />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {t("credentials") || "Credentials"}
                </span>
              </label>
            )}

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
              <Checkbox
                checked={visibleColumns.roles}
                onChange={() => toggleColumn("roles")}
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                {t("securityRoles") || "Security Roles"}
              </span>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
              <Checkbox
                checked={visibleColumns.status}
                onChange={() => toggleColumn("status")}
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                {t("status") || "Status"}
              </span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default UserColumnSelector;
