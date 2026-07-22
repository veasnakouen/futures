import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Activity, Trophy } from "lucide-react";
import { schoolService, ExtracurricularDto } from "../../../services/schoolService";
import ExtracurricularFormModal from "./ExtracurricularFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";
import { toast } from "react-hot-toast";

export default function ExtracurricularList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ExtracurricularDto | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["extracurriculars", page - 1, size],
    queryFn: () => schoolService.getExtracurriculars(page - 1, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.deleteExtracurricular(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      toast.success(t("activityDeletedSuccess"));
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

  const allActivities: ExtracurricularDto[] = data?.content || [];
  const filteredActivities = allActivities.filter((a) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (a.name && a.name.toLowerCase().includes(query)) ||
      (String(a.id).includes(query))
    );
  });

  const totalElements = data?.totalElements || filteredActivities.length;
  const totalPages = data?.totalPages || Math.ceil(totalElements / size) || 1;

  const columns: ColumnDef<ExtracurricularDto>[] = [
    {
      header: t("id"),
      accessorKey: "id",
      sortable: true,
      cell: (activity) => (
        <span className="font-mono text-xs font-bold text-gray-500">
          #{activity.id}
        </span>
      ),
    },
    {
      header: t("activityName"),
      accessorKey: "name",
      sortable: true,
      cell: (activity) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center font-black text-xs shrink-0">
            <Trophy size={18} />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {activity.name}
          </span>
        </div>
      ),
    },
    {
      header: t("actions"),
      cell: (activity) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(activity)}
            className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all cursor-pointer"
            title="Edit Activity"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(activity)}
            className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
            title="Delete Activity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl shadow-inner">
            <Activity size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("extracurricularActivities")}
            </h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              {t("manageActivitiesDesc")}
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-500/30 whitespace-nowrap hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus size={20} strokeWidth={2.5} /> {t("addActivity")}
        </button>
      </div>

      {/* Enterprise DataTable */}
      <DataTable
        data={filteredActivities}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder={t("searchActivities")}
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
        emptyMessage={t("noActivitiesFound")}
        renderGridCard={(activity: ExtracurricularDto) => (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-full bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center font-black text-xs shrink-0">
                <Trophy size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                  {activity.name}
                </h4>
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  #{activity.id}
                </span>
              </div>

              {/* Hover Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(activity);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Edit Activity"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(activity);
                  }}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Activity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      />

      <ExtracurricularFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        activityToEdit={selectedActivity}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedActivity?.id) {
            deleteMutation.mutate(selectedActivity.id.toString());
          }
        }}
        title={t("deleteActivity")}
        message={t("confirmDeleteActivity")}
      />
    </div>
  );
}
