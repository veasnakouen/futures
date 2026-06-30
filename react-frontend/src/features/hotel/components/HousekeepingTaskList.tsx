"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, HousekeepingTaskDto } from "../../../services/hotelService";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import HousekeepingTaskFormModal from "./HousekeepingTaskFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";

export default function HousekeepingTaskList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HousekeepingTaskDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["housekeeping", page, size],
    queryFn: () => hotelService.getHousekeepingTasks(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteHousekeepingTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
      toast.success("Task deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete task")
  });

  const filteredData = data?.content?.filter((p: HousekeepingTaskDto) => {
    const matchesSearch = p.roomId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.staffId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Housekeeping</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage cleaning tasks and maintenance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Room ID or Staff ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> Assign Task
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">Room ID</th>
                <th className="px-6 py-4 font-bold">Staff ID</th>
                <th className="px-6 py-4 font-bold">Task Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading tasks...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center">No tasks found.</td></tr>
              ) : (
                filteredData.map((item: HousekeepingTaskDto) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.roomId}</td>
                    <td className="px-6 py-4">{item.staffId}</td>
                    <td className="px-6 py-4">{item.taskDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${item.status === 'COMPLETED' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {item.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => { setSelectedItem(item); setIsConfirmOpen(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
            <ModernPagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <HousekeepingTaskFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Task"
        message={`Are you sure you want to delete this housekeeping task?`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
