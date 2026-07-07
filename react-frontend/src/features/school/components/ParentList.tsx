import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { schoolService, ParentDto } from "../../../services/schoolService";
import ModernPagination from "../../../components/common/ModernPagination";
import ParentFormModal from './ParentFormModal';
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";

export default function ParentList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["parents", page, size],
    queryFn: () => schoolService.getParents(page, size).then((res) => res.data),
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("parentsGuardians")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("manageParentsDesc")}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} />
          {t("addParent")}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("searchParents")}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">{t("id")}</th>
                <th className="px-6 py-4 font-bold">{t("name")}</th>
                <th className="px-6 py-4 font-bold">{t("contactNumber")}</th>
                <th className="px-6 py-4 font-bold text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {t("loadingParents")}
                  </td>
                </tr>
              ) : !data?.content || data.content.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {t("noParentsFound")}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        {t("addFirstParent")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.content?.map((parent: ParentDto) => (
                  <tr
                    key={parent.id}
                    className="bg-white dark:bg-gray-800 border-b hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{parent.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {parent.name}
                    </td>
                    <td className="px-6 py-4">{parent.contactNumber}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(parent)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(parent)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data?.totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/50">
            <ModernPagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ParentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        parentToEdit={selectedParent}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedParent!.id)}
        title={t("deleteParent")}
        message={t("confirmDeleteParent", { name: selectedParent?.name })}
        confirmText={t("deleteParent")}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
