"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService, InvoiceDto } from "../../../services/billingService";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import InvoiceFormModal from "./InvoiceFormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import InvoiceDetailModal from "./InvoiceDetailModal";
import { toast } from "react-hot-toast";

export default function InvoiceList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvoiceDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page, size],
    queryFn: () => billingService.getInvoices(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete invoice")
  });

  const filteredData = data?.content?.filter((p: InvoiceDto) => {
    const matchesSearch = p.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) || p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.sourceModule === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoices</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage patient billing and invoices</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Ref ID or CPT..." 
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
              <option value="ALL">All Modules</option>
              <option value="CLINIC">CLINIC</option>
              <option value="HOTEL">HOTEL</option>
              <option value="SCHOOL">SCHOOL</option>
              <option value="GENERAL">GENERAL</option>
            </select>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700">
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice / Module</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading invoices...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">No invoices found.</td></tr>
              ) : (
                filteredData.map((item: InvoiceDto) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                        {item.invoiceNumber || item.id.substring(0, 8)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mt-1 w-max">
                        {item.sourceModule}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{item.referenceId || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.issueDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      item.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${item.grandTotal?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsDetailOpen(true); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Invoice"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button 
                        onClick={() => { setSelectedItem(item); setIsFormOpen(true); }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit Invoice"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelectedItem(item); setIsConfirmOpen(true); }}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>))
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

      {isFormOpen && (
        <InvoiceFormModal 
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setSelectedItem(null); }}
          itemToEdit={selectedItem}
        />
      )}

      {isDetailOpen && (
        <InvoiceDetailModal
          isOpen={isDetailOpen}
          onClose={() => { setIsDetailOpen(false); setSelectedItem(null); }}
          invoice={selectedItem}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Invoice"
        message={`Are you sure you want to delete this invoice?`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
