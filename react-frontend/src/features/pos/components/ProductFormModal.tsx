import React, { useState, useEffect } from "react";
import { Modal, TextInput } from '@/lib/flowbite-compat';
import { X, Camera, Image as ImageIcon, Wand2, Upload, Trash2 } from "lucide-react";
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        toast.success("Image selected successfully");
      };
      reader.readAsDataURL(file);
    }
  };

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
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Image File Upload & Live Preview Section */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="relative group w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm shrink-0">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={22} />
                  <span className="text-[9px] font-bold mt-0.5">No Image</span>
                </div>
              )}
              <label
                htmlFor="product-image-upload"
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[9px] font-bold gap-0.5"
              >
                <Camera size={14} />
                <span>Upload</span>
              </label>
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Product Image
                </label>
                <label
                  htmlFor="product-image-upload"
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Upload size={10} /> Choose File
                </label>
              </div>
              <div className="flex items-center gap-1.5">
                <TextInput
                  type="url"
                  placeholder="Paste Image URL or select file above"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  sizing="sm"
                  className="w-full text-xs"
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Remove Image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Product Name</label>
            <TextInput value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sizing="sm" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">SKU</label>
              <div className="flex gap-2">
                <TextInput value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} sizing="sm" required />
                <button type="button" onClick={handleGenerateSku} className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 transition-all" title="Auto-Generate SKU"><Wand2 size={14} /></button>
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
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg shadow-sm transition-all">
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
