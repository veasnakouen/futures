import React from "react";
import { Checkbox } from "@/lib/flowbite-compat";

interface PermissionMatrixGridProps {
  permissions: any[];
  selectedPerms: string[];
  onTogglePerm: (permName: string) => void;
  onToggleAll: (checked: boolean) => void;
}

export const PermissionMatrixGrid: React.FC<PermissionMatrixGridProps> = ({
  permissions,
  selectedPerms,
  onTogglePerm,
  onToggleAll,
}) => {
  const allSelected =
    permissions.length > 0 && selectedPerms.length === permissions.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Select All Permissions ({selectedPerms.length} / {permissions.length})
        </span>
        <Checkbox
          checked={allSelected}
          onChange={(e) => onToggleAll(e.target.checked)}
        />
      </div>

      <div className="max-h-[350px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permissions.map((perm) => {
          const permName = perm.name || perm;
          const isSelected = selectedPerms.includes(permName);

          return (
            <label
              key={perm.id || permName}
              onClick={() => onTogglePerm(permName)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200"
                  : "bg-white dark:bg-gray-800 border-gray-200/70 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-200"
              }`}
            >
              <div className="flex flex-col pr-2">
                <span className="text-xs font-bold font-mono">{permName}</span>
                {perm.description && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {perm.description}
                  </span>
                )}
              </div>
              <Checkbox checked={isSelected} readOnly />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionMatrixGrid;
