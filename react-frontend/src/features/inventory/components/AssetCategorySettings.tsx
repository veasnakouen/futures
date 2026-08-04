import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Button, TextInput, Label, Modal, ModalBody } from "@/lib/flowbite-compat";
import { Plus, Trash2, Edit3, Settings, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import ConfirmModal from "@/components/common/ConfirmModal";

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
  const [categoryToDelete, setCategoryToDelete] = useState<AssetCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prefixCode: "",
    isActive: true,
    requiresExpiryDate: false,
    requiresSerialTracking: false
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const response = await api.get("/stock/categories");
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/stock/categories", data);
      return res.data;
    },
    onSuccess: (newCat: any) => {
      if (newCat && newCat.id) {
        queryClient.setQueryData<AssetCategory[]>(["inventory-categories"], (old = []) => [...old, newCat]);
      }
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category created successfully");
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Failed to create category";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/stock/categories/${id}`, data);
      return res.data;
    },
    onSuccess: (updatedCat: any, variables) => {
      const itemToUpdate = updatedCat?.id ? updatedCat : { ...variables.data, id: variables.id };
      queryClient.setQueryData<AssetCategory[]>(["inventory-categories"], (old = []) =>
        old.map((cat) => (cat.id === variables.id ? { ...cat, ...itemToUpdate } : cat))
      );
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category updated successfully");
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Failed to update category";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/stock/categories/${id}`);
      return id;
    },
    onSuccess: (deletedId: number) => {
      queryClient.setQueryData<AssetCategory[]>(["inventory-categories"], (old = []) =>
        old.filter((cat) => cat.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Failed to delete category";
      toast.error(msg);
      setCategoryToDelete(null);
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      prefixCode: "",
      isActive: true,
      requiresExpiryDate: false,
      requiresSerialTracking: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AssetCategory) => {
    setEditingCategory(cat);
    setFormData({ 
      name: cat.name || "", 
      description: cat.description || "",
      prefixCode: cat.prefixCode || "",
      isActive: cat.isActive !== false,
      requiresExpiryDate: cat.requiresExpiryDate || false,
      requiresSerialTracking: cat.requiresSerialTracking || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) return toast.error("Category name is required");

    const payload = {
      name: trimmedName,
      description: formData.description?.trim() ? formData.description.trim() : null,
      prefixCode: formData.prefixCode?.trim() ? formData.prefixCode.trim().toUpperCase() : null,
      isActive: formData.isActive,
      requiresExpiryDate: formData.requiresExpiryDate,
      requiresSerialTracking: formData.requiresSerialTracking,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const generateSmartPrefix = (name: string) => {
    const cleanName = name.replace(/[^A-Za-z\s]/g, '').trim();
    if (!cleanName) return "";
    const words = cleanName.split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    }
    if (words.length === 2) {
      return (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
    }
    return words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
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
        <Button color="blue" onClick={openCreateModal} className="font-black uppercase tracking-widest text-[10px]">
          <Plus size={14} className="mr-2" />
          New Category
        </Button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
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
                    <button onClick={() => openEditModal(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors" title="Edit Category">
                      <Edit3 size={14} />
                    </button>
                    {cat.isActive !== false && (
                      <button onClick={() => setCategoryToDelete(cat)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors" title="Delete Category">
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

      {/* CREATE/EDIT MODAL */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <CustomModalHeader 
          title={editingCategory ? "Edit Category" : "New Category"} 
          subtitle={editingCategory ? "Modify category details" : "Create a new asset group"}
          onClose={() => setIsModalOpen(false)} 
        />
        <ModalBody className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Category Name *</Label>
                <TextInput
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: newName
                    }));
                  }}
                  placeholder="e.g. IT Equipment"
                  required
                />
              </div>
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SKU Prefix (Optional)</Label>
                <div className="flex gap-2">
                  <TextInput
                    value={formData.prefixCode}
                    onChange={(e) => setFormData({ ...formData, prefixCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. ELECTRON"
                    maxLength={10}
                    className="flex-1"
                  />
                  <Button type="button" color="light" size="xs" onClick={() => {
                    if (formData.name) {
                       const autoPrefix = generateSmartPrefix(formData.name);
                       setFormData({ ...formData, prefixCode: autoPrefix });
                       toast.success("Prefix Generated");
                    } else {
                       toast.error("Please enter a Category Name first");
                    }
                  }} title="Auto-generate from Category Name">
                    <Wand2 size={14} className="text-indigo-600" />
                  </Button>
                </div>
                {formData.prefixCode && (
                  <p className="mt-1.5 text-[9px] text-gray-400 font-semibold">
                    Items in this category will be numbered as <span className="text-indigo-500 font-black">{formData.prefixCode}-00001</span>
                  </p>
                )}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Delete Asset Category"
        message={`Are you sure you want to delete or deactivate the category "${categoryToDelete?.name}"? Items linked to this category may be affected.`}
        confirmText="Yes, Delete Category"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete.id);
          }
        }}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
