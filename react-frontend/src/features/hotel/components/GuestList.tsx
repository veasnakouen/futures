"use client";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, GuestDto } from "../../../services/hotelService";
import { Plus, Edit2, Trash2, Search, FileCheck, FileText, Eye } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import GuestFormModal from "./GuestFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "../../../components/common/CustomModalHeader";

export default function GuestList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuestDto | null>(null);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["guests", page, size],
    queryFn: () => hotelService.getGuests(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteGuest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Guest deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete guest")
  });

  const filteredData = data?.content?.filter((p: GuestDto) => {
    return p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.idProofNumber?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guests</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage hotel guests, passports, and identity documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchInput
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={setSearchTerm}
            containerClassName="flex-1 sm:w-64"
          />
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> Add Guest
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Phone</th>
                <th className="px-6 py-4 font-bold">Passport / ID #</th>
                <th className="px-6 py-4 font-bold">Nationality</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500"><div className="flex justify-center"><Spinner size="lg" /></div></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">No guests found.</td></tr>
              ) : (
                filteredData.map((item: GuestDto) => {
                  const hasUploadedDoc = item.idProofNumber?.startsWith("data:");
                  return (
                    <tr key={item.id} className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/25 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.phoneNumber}</td>
                      <td className="px-6 py-4">
                        {hasUploadedDoc ? (
                          <button
                            onClick={() => setPreviewDocUrl(item.idProofNumber || null)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                          >
                            <FileCheck size={14} /> Verified Scan <Eye size={12} className="ml-1" />
                          </button>
                        ) : item.idProofNumber ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            <FileText size={14} /> {item.idProofNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-italic">Unverified</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{item.nationality || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => { setSelectedItem(item); setIsConfirmOpen(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {data?.totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/50">
            <ModernPagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <GuestFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Guest"
        message={`Are you sure you want to delete this guest?`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />

      {/* Passport / ID Document Preview Modal */}
      {previewDocUrl && (
        <Modal show={true} onClose={() => setPreviewDocUrl(null)} size="lg">
          <CustomModalHeader title="Passport / ID Verification Document" onClose={() => setPreviewDocUrl(null)} icon={null} />
          <ModalBody className="p-6 flex flex-col items-center justify-center bg-gray-900">
            <img src={previewDocUrl} alt="Passport Scan Document" className="max-h-[70vh] rounded-xl object-contain shadow-2xl" />
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
