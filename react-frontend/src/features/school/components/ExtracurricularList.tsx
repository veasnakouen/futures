import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { schoolService, ExtracurricularDto } from "../../../services/schoolService";
import ModernPagination from "../../../components/common/ModernPagination";
import ExtracurricularFormModal from "./ExtracurricularFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";

export default function ExtracurricularList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ExtracurricularDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["extracurriculars", page, size],
    queryFn: () => schoolService.getExtracurriculars(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      // Fake delay
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      toast.success("Activity deleted successfully");
      setIsConfirmOpen(false);
    },
  });

  const handleEdit = (activity: ExtracurricularDto) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = (activity: ExtracurricularDto) => {
    setSelectedActivity(activity);
    setIsConfirmOpen(true);
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Extracurricular Activities
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage school clubs and activities
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Activity Name</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Loading activities...
                  </td>
                </tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        No activities found
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Get started by adding a new activity to the system.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.content?.map((activity: ExtracurricularDto) => (
                  <tr
                    key={activity.id}
                    className="bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{activity.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {activity.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(activity)}
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
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <ModernPagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ExtracurricularFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        activityToEdit={selectedActivity}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedActivity!.id)}
        title="Delete Activity"
        message={`Are you sure you want to delete ${selectedActivity?.name}? This action cannot be undone.`}
        confirmText="Delete Activity"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
