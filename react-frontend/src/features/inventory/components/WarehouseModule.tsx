import React, { useState } from "react";
import { Button, TextInput } from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { Package, Plus, Search, LayoutGrid, List, Activity } from "lucide-react";
import { toast } from "react-hot-toast";

import StockTransactionModal from "@/features/inventory/components/StockTransactionModal";
import WarehouseGridCards from "./warehouse/WarehouseGridCards";
import WarehouseDetailsModal from "./warehouse/WarehouseDetailsModal";
import WarehouseRegistrationModal from "./warehouse/WarehouseRegistrationModal";

interface StockModuleProps {
  items: any[];
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading: boolean;
  onRefresh?: () => void;
}

const WarehouseModule: React.FC<StockModuleProps> = ({
  items,
  onAdd,
  onUpdate,
  onDelete,
  loading,
}) => {
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("TABLE");
  const [itemsPerRow, setItemsPerRow] = useState("4");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [selectedItemForTx, setSelectedItemForTx] = useState<any>(null);

  const defaultFormData = {
    name: "", sku: "", category: "Office Supplies", quantity: 0, unit: "pcs",
    minQuantity: 5, unitPrice: 0, location: "Main Warehouse", status: "In Stock",
    description: "", imageUrl: "", vendor: "", binLocation: "", brand: ""
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const safeItems = Array.isArray(items) ? items : [];
  const categories = ["ALL", "Office Supplies", "Electronics", "Furniture", "Software", "General"];
  const filteredItems = safeItems.filter((item) => {
    const matchesSearch = (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (item.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || (item.category || "General") === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const columns: ColumnDef<any>[] = [
    {
      header: "Item Specification",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : <Package size={18} />}
          </div>
          <div>
            <p className="font-black dark:text-white text-xs uppercase">{item.name}</p>
            <p className="text-[8px] font-black text-gray-400 uppercase">{item.location || "Primary Node"}</p>
          </div>
        </div>
      )
    },
    { header: "SKU / ID", accessorKey: "sku", className: "font-mono text-xs font-bold text-gray-500" },
    { header: "Stock Level", accessorKey: "quantity", cell: (item) => <span className="font-mono font-black text-sm">{item.quantity} {item.unit || "pcs"}</span> },
    { header: "Unit Price", accessorKey: "unitPrice", className: "font-black text-blue-600", cell: (item) => `$${item.unitPrice || 0}` },
  ];

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku) return toast.error("Name and SKU required");
    try {
      setIsProcessing(true);
      if (isEditMode && editingId) await onUpdate(editingId, formData);
      else await onAdd(formData);
      setIsModalOpen(false);
      setFormData(defaultFormData);
    } catch {
      toast.error("Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase">Unique SKUs</p>
          <h4 className="text-3xl font-black text-blue-600">{safeItems.length}</h4>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase">Total Units</p>
          <h4 className="text-3xl font-black text-emerald-600">{safeItems.reduce((s, i) => s + (i.quantity || 0), 0)}</h4>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase">Low Stock Alerts</p>
          <h4 className="text-3xl font-black text-amber-500">{safeItems.filter((i) => (i.quantity || 0) <= (i.minQuantity || 5)).length}</h4>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md">
          <p className="text-[10px] font-black uppercase opacity-80">Inventory Status</p>
          <h4 className="text-xl font-black">All Nodes Synced</h4>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border shadow-sm">
        <div className="flex gap-2">
          <button onClick={() => setViewMode("TABLE")} className={`p-2 rounded-lg ${viewMode === "TABLE" ? "bg-blue-600 text-white" : "text-gray-400"}`}><List size={16} /></button>
          <button onClick={() => setViewMode("GRID")} className={`p-2 rounded-lg ${viewMode === "GRID" ? "bg-blue-600 text-white" : "text-gray-400"}`}><LayoutGrid size={16} /></button>
        </div>
        <Button color="blue" size="xs" onClick={() => { setFormData(defaultFormData); setIsEditMode(false); setIsModalOpen(true); }} className="font-black uppercase text-[10px]">
          <Plus size={14} className="mr-1" /> New Item
        </Button>
      </div>

      {/* View Output */}
      {viewMode === "TABLE" ? (
        <DataTable
          data={paginatedItems}
          columns={columns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        <WarehouseGridCards
          paginatedItems={paginatedItems}
          itemsPerRow={itemsPerRow}
          onOpenTransaction={(i) => { setSelectedItemForTx(i); setIsTransactionModalOpen(true); }}
          onOpenDetails={(i) => { setViewingItem(i); setIsDetailsModalOpen(true); }}
          onOpenEdit={(i) => { setFormData(i); setEditingId(i.id); setIsEditMode(true); setIsModalOpen(true); }}
          onDelete={onDelete}
        />
      )}

      {/* Modals */}
      <WarehouseRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditMode={isEditMode} currentStep={currentStep} setCurrentStep={setCurrentStep} formData={formData} setFormData={setFormData} categories={categories} isProcessing={isProcessing} onSubmit={handleSubmit} onImageChange={() => {}} />
      <WarehouseDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} item={viewingItem} />
      <StockTransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} item={selectedItemForTx} onSuccess={() => {}} />
    </div>
  );
};

export default WarehouseModule;
