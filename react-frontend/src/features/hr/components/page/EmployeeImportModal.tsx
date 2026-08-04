import React from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@/lib/flowbite-compat";
import { UserPlus, X, Search } from "lucide-react";

interface Props {
  state: any;
}

export default function EmployeeImportModal({ state }: Props) {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    importCandidates,
    selectedImportIds,
    toggleImportSelect,
    importLoading,
    importFetching,
    handleImportUsers,
  } = state;

  if (!isImportModalOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                Import System Users as Employees
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Link existing accounts to HR employee records automatically.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {importFetching ? (
            <div className="py-12 text-center space-y-2">
              <Spinner size="lg" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Scanning linkable user accounts…
              </p>
            </div>
          ) : importCandidates.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-gray-400">
              <Search size={32} className="mx-auto text-gray-300" />
              <p className="font-bold text-sm">All system users are already onboarded as employees!</p>
            </div>
          ) : (
            importCandidates.map((user: any) => {
              const isSelected = selectedImportIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleImportSelect(user.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm"
                      : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName} (@{user.userName})
                      </h4>
                      <p className="text-xs text-gray-500">{user.email || "No email attached"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-white dark:bg-gray-800 rounded-full text-indigo-600 border">
                    {user.roleName || "USER"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-bold">
            {selectedImportIds.length} candidate(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleImportUsers}
              disabled={selectedImportIds.length === 0 || importLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {importLoading ? "Importing…" : `Import Selected (${selectedImportIds.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
