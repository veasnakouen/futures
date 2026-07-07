"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, BranchDto } from "../../../services/schoolService";
import { Plus, Edit2, Trash2, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import BranchFormModal from "./BranchFormModal";
import { Spinner } from "@/components/ui/spinner";

export default function BranchList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState<BranchDto | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: branches = [], isLoading } = useQuery<BranchDto[]>({
    queryKey: ["branches"],
    queryFn: () => schoolService.getBranches().then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success(t("branchDeletedSuccess"));
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`${t("branchDeletedFail")}: ${msg}`);
    },
  });

  const handleDelete = (id: string) => {
    setBranchToDelete(id);
  };

  const confirmDelete = () => {
    if (branchToDelete) {
      deleteMutation.mutate(branchToDelete);
      setBranchToDelete(null);
    }
  };

  const handleEdit = (branch: BranchDto) => {
    setBranchToEdit(branch);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setBranchToEdit(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            {t("branches")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("manageBranchesDesc")}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addBranch")}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">{t("branchName")}</th>
                <th className="px-6 py-4 font-medium">{t("contact")}</th>
                <th className="px-6 py-4 font-medium">{t("location")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {t("noBranchesFound")}
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {branch.branchName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {branch.email && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Mail className="h-3 w-3" />
                            {branch.email}
                          </div>
                        )}
                        {branch.phoneNumber && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Phone className="h-3 w-3" />
                            {branch.phoneNumber}
                          </div>
                        )}
                        {!branch.email && !branch.phoneNumber && (
                          <span className="text-gray-400 italic">{t("noContactInfo")}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {branch.address && (branch.address.city || branch.address.street) ? (
                        <div className="text-gray-600 dark:text-gray-300 line-clamp-2 max-w-xs">
                          {[branch.address.street, branch.address.village, branch.address.commune, branch.address.district, branch.address.city, branch.address.state]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">{t("noAddress")}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(branch)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <BranchFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          branchToEdit={branchToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <Trash2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {t("confirmDeleteBranch")}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t("deleting") : t("yesSure")}
              </button>
              <button
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-300 rounded-lg transition-colors"
              >
                {t("noCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
