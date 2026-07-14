import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Button, TextInput, Label, Modal, ModalBody } from "@/lib/flowbite-compat";
import { Plus, Trash2, Edit3, Settings } from "lucide-react";
import toast from "react-hot-toast";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

interface AssetCategory {
  id: number;
  name: string;
  description?: string;
  prefixCode?: string;
  isActive?: boolean;
  requiresExpiryDate?: boolean;
  requiresSerialTracking?: boolean;
}

export default function AssetCategorySettings() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", prefixCode: "", isActive: true, requiresExpiryDate: false, requiresSerialTracking: false });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const response = await api.get("/stock/categories");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post("/stock/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category created successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => api.put(`/stock/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category updated successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/stock/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", prefixCode: "", isActive: true, requiresExpiryDate: false, requiresSerialTracking: false });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AssetCategory) => {
    setEditingCategory(cat);
    setFormData({ 
      name: cat.name, 
      description: cat.description || "",
      prefixCode: cat.prefixCode || "",
      isActive: cat.isActive !== false,
      requiresExpiryDate: cat.requiresExpiryDate || false,
      requiresSerialTracking: cat.requiresSerialTracking || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) return toast.error("Name is required");
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Asset Categories</h3>
            <p className="text-xs font-bold text-gray-500">Manage categories for inventory items</p>
          </div>
        </div>
        <Button color="indigo" onClick={openCreateModal} className="rounded-md">
          <Plus size={16} className="mr-2" /> New Category
        </Button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm font-semibold">No categories found</p>
            <p className="text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat: AssetCategory) => (
              <div key={cat.id} className={`p-4 border ${cat.isActive === false ? 'border-red-200 dark:border-red-900/30 opacity-70' : 'border-gray-100 dark:border-gray-700'} rounded-xl hover:shadow-md transition-all group bg-white dark:bg-gray-800 relative overflow-hidden`}>
                {cat.isActive === false && (
                  <div className="absolute top-0 right-0 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
                    Inactive
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {cat.name}
                      {cat.prefixCode && (
                        <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                          {cat.prefixCode}
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit3 size={14} />
                    </button>
                    {cat.isActive !== false && (
                      <button onClick={() => deleteMutation.mutate(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
                <div className="flex gap-2 mt-3">
                   {cat.requiresExpiryDate && <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md uppercase font-black tracking-widest">Expires</span>}
                   {cat.requiresSerialTracking && <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-md uppercase font-black tracking-widest">Serialized</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md" dismissible={false}>
        <CustomModalHeader
          title={editingCategory ? "Edit Category" : "New Category"}
          subtitle="System Settings"
          onClose={() => setIsModalOpen(false)}
        />
        <ModalBody className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Category Name</Label>
                <TextInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. IT Equipment"
                />
              </div>
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SKU Prefix (Optional)</Label>
                <TextInput
                  value={formData.prefixCode}
                  onChange={(e) => setFormData({ ...formData, prefixCode: e.target.value })}
                  placeholder="e.g. ELEC"
                  maxLength={5}
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Description</Label>
              <TextInput
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-500" checked={formData.requiresExpiryDate} onChange={(e) => setFormData({...formData, requiresExpiryDate: e.target.checked})} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requires Expiry Date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-500" checked={formData.requiresSerialTracking} onChange={(e) => setFormData({...formData, requiresSerialTracking: e.target.checked})} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requires Serial Tracking</span>
              </label>
              {editingCategory && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-emerald-500" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Category is Active</span>
                </label>
              )}
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          submitText={editingCategory ? "Update" : "Create"}
          submitDisabled={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
