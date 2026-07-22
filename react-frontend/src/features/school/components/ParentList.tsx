import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, UserCheck, Phone, Shield } from "lucide-react";
import { schoolService, ParentDto } from "../../../services/schoolService";
import ParentFormModal from "./ParentFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";
import { toast } from "react-hot-toast";

export default function ParentList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["parents", page - 1, size],
    queryFn: () => schoolService.getParents(page - 1, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      toast.success(t("parentDeletedSuccess"));
      setIsConfirmOpen(false);
    },
  });

  const handleEdit = (parent: ParentDto) => {
    setSelectedParent(parent);
    setIsFormOpen(true);
  };

  const handleDelete = (parent: ParentDto) => {
    setSelectedParent(parent);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedParent(null);
    setIsFormOpen(true);
  };

  const allParents: ParentDto[] = data?.content || [];
  const filteredParents = allParents.filter((p) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.contactNumber && p.contactNumber.toLowerCase().includes(query)) ||
      (String(p.id).includes(query))
    );
  });

  const totalElements = data?.totalElements || filteredParents.length;
  const totalPages = data?.totalPages || Math.ceil(totalElements / size) || 1;

  const columns: ColumnDef<ParentDto>[] = [
    {
      header: t("id"),
      accessorKey: "id",
      sortable: true,
      cell: (parent) => (
        <span className="font-mono text-xs font-bold text-gray-500">
          #{parent.id}
        </span>
      ),
    },
    {
      header: t("name"),
      accessorKey: "name",
      sortable: true,
      cell: (parent) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1.5px] shrink-0">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-black text-xs text-blue-600">
              {(parent.name || "P").slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-gray-900 dark:text-white block">
              {parent.name}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <Shield size={10} /> Guardian Account
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("contactNumber"),
      accessorKey: "contactNumber",
      cell: (parent) => (
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
          <Phone size={12} className="text-blue-500" />
          {parent.contactNumber || "N/A"}
        </div>
      ),
    },
    {
      header: t("actions"),
      cell: (parent) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(parent)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Edit Guardian"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(parent)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Delete Guardian"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-blue-600" /> {t("parentsGuardians")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("manageParentsDesc")}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          {t("addParent")}
        </button>
      </div>

      {/* Enterprise DataTable */}
      <DataTable
        data={filteredParents}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder={t("searchParents")}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalElements}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setSize(newSize);
          setPage(1);
        }}
        enableViewToggle={true}
        enableColumnToggle={true}
        emptyMessage={t("noParentsFound")}
        renderGridCard={(parent: ParentDto) => (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shrink-0">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-black text-xs text-blue-600">
                  {(parent.name || "P").slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                  {parent.name}
                </h4>
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  #{parent.id}
                </span>
              </div>

              {/* Hover Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(parent);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Edit Guardian"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(parent);
                  }}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Guardian"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs font-mono font-bold text-gray-600 dark:text-gray-300">
              <Phone size={13} className="text-blue-500" />
              {parent.contactNumber || "No Phone Registered"}
            </div>
          </div>
        )}
      />

      <ParentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        parentToEdit={selectedParent}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedParent?.id) {
            deleteMutation.mutate(selectedParent.id.toString());
          }
        }}
        title={t("deleteParent")}
        message={t("confirmDeleteParent")}
      />
    </div>
  );
}
