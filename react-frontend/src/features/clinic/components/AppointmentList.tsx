"use client";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, AppointmentDto } from "../../../services/clinicService";
import { Plus, Edit2, Trash2, Search, Filter, CalendarCheck } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import AppointmentFormModal from "./AppointmentFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";

export default function AppointmentList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AppointmentDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", page, size],
    queryFn: () => clinicService.getAppointments(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete appointment")
  });

  const filteredData = data?.content?.filter((p: AppointmentDto) => {
    const matchesSearch = p.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || p.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner">
            <CalendarCheck size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Appointments</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">Manage scheduling and visits</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchInput
                    placeholder="Search notes or ID..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    containerClassName="flex-1 sm:w-64"
                  />
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/50 dark:text-white appearance-none cursor-pointer shadow-inner font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/30 whitespace-nowrap hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} /> Schedule
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-900 dark:text-gray-100 uppercase bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md">
              <tr>
                <th className="px-8 py-5 font-black tracking-wider">Patient ID</th>
                <th className="px-6 py-5 font-black tracking-wider">Doctor ID</th>
                <th className="px-6 py-5 font-black tracking-wider">Date & Time</th>
                <th className="px-6 py-5 font-black tracking-wider">Status</th>
                <th className="px-8 py-5 font-black tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/30">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><div className="flex justify-center"><Spinner size="xl" /></div></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium">No appointments found.</td></tr>
              ) : (
                filteredData.map((item: AppointmentDto) => (
                  <tr key={item.id} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">
                      {item.patientId || "N/A"}
                    </td>
                    <td className="px-6 py-5 font-medium">{item.doctorId || "N/A"}</td>
                    <td className="px-6 py-5 font-bold text-emerald-600 dark:text-emerald-400">
                      {item.appointmentDate} <span className="text-gray-400 dark:text-gray-500 ml-1">at {item.appointmentTime}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        item.status === 'COMPLETED' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                        item.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                        item.status === 'CANCELLED' ? 'bg-red-500/20 text-red-700 dark:text-red-400' :
                        'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {item.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => { setSelectedItem(item); setIsConfirmOpen(true); }} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/30 bg-gray-50/30 dark:bg-gray-800/20">
            <ModernPagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <AppointmentFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Appointment"
        message={`Are you sure you want to permanently delete this appointment record?`}
        confirmText="Delete Record"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
