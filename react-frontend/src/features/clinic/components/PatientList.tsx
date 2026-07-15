"use client";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, PatientDto } from "../../../services/clinicService";
import { Plus, Edit2, Trash2, Search, Filter, User } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import PatientFormModal from "./PatientFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";
import { useNavigate } from "@/lib/react-router-compat";

export default function PatientList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PatientDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["patients", page, size],
    queryFn: () => clinicService.getPatients(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete patient")
  });

  const filteredData = data?.content?.filter((p: PatientDto) => {
    const matchesSearch = p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || p.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "ALL" || p.gender === genderFilter;
    return matchesSearch && matchesGender;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
            <User size={28} className="drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Patient Directory</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">Manage clinical demographics</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchInput
            placeholder="Search patients..."
            value={searchTerm}
            onChange={setSearchTerm}
            containerClassName="flex-1 sm:w-64"
          />
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/50 dark:text-white appearance-none cursor-pointer shadow-inner font-medium"
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} /> Add Patient
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-900 dark:text-gray-100 uppercase bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md">
              <tr>
                <th className="px-8 py-5 font-black tracking-wider">Patient Name</th>
                <th className="px-6 py-5 font-black tracking-wider">DOB</th>
                <th className="px-6 py-5 font-black tracking-wider">Gender</th>
                <th className="px-6 py-5 font-black tracking-wider">Contact</th>
                <th className="px-8 py-5 font-black tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/30">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><div className="flex justify-center"><Spinner size="xl" /></div></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium">No patients found. Create one to get started.</td></tr>
              ) : (
                filteredData.map((item: PatientDto) => (
                  <tr key={item.id} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer" onClick={() => navigate(`/clinic/patients/${item.id}`)}>
                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow-md">
                        {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                      </div>
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="px-6 py-5 font-medium">{item.dateOfBirth}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {item.gender}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium">{item.contactNumber}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsFormOpen(true); }} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsConfirmOpen(true); }} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all"><Trash2 size={18} /></button>
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

      <PatientFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Patient"
        message={`Are you sure you want to permanently delete this patient record?`}
        confirmText="Delete Record"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
