import React, { useState, useEffect } from "react";
import { Modal, TextInput } from '@/lib/flowbite-compat';
import { X, Camera, Image as ImageIcon, Wand2 } from "lucide-react";
import { posService, PosProductDto } from "../../../services/posService";
import { toast } from "react-hot-toast";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: PosProductDto | null;
  onSaved: () => void;
  existingCategories?: string[];
  existingBrands?: string[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSaved,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<PosProductDto>>({
    name: "", sku: "", category: "General", price: 0, stockQuantity: 0, description: "", imageUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) setFormData(productToEdit);
    else setFormData({ name: "", sku: "", category: "General", price: 0, stockQuantity: 0, description: "", imageUrl: "" });
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (productToEdit?.id) await posService.updateProduct(productToEdit.id, formData as PosProductDto);
      else await posService.createProduct(formData as PosProductDto);
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSku = async () => {
    try {
      const res = await posService.generateSku();
      if (res?.sku) setFormData({ ...formData, sku: res.sku });
    } catch {
      toast.error("Failed to generate SKU");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-black dark:text-white">{productToEdit ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Product Name</label>
            <TextInput value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sizing="sm" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">SKU</label>
              <div className="flex gap-2">
                <TextInput value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} sizing="sm" required />
                <button type="button" onClick={handleGenerateSku} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Wand2 size={14} /></button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Category</label>
              <TextInput value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} sizing="sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Price ($)</label>
              <TextInput type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} sizing="sm" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Stock Qty</label>
              <TextInput type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })} sizing="sm" />
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-black text-xs rounded-lg shadow-sm">
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
