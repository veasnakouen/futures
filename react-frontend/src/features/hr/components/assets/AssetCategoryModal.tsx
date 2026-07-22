import React from "react";
import { Modal, ModalBody, ModalFooter, Button, TextInput } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Plus, SlidersHorizontal, Trash2 } from "lucide-react";

interface AssetCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetCategories: string[];
  newCategoryName: string;
  setNewCategoryName: (val: string) => void;
  handleAddCategory: () => void;
  editingCatIndex: number | null;
  setEditingCatIndex: (index: number | null) => void;
  editingCatValue: string;
  setEditingCatValue: (val: string) => void;
  handleEditCategory: (index: number) => void;
  handleDeleteCategory: (catName: string) => void;
}

export const AssetCategoryModal: React.FC<AssetCategoryModalProps> = ({
  isOpen,
  onClose,
  assetCategories,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  editingCatIndex,
  setEditingCatIndex,
  editingCatValue,
  setEditingCatValue,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title="Manage Hardware Categories"
        subtitle="Add, edit, or delete asset classification categories"
        onClose={onClose}
      />
      <ModalBody className="p-6 space-y-6">
        {/* Add New Category */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Add New Category
          </label>
          <div className="flex gap-2">
            <TextInput
              placeholder="e.g. Tablet, Printer, Networking"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <Button
              color="blue"
              onClick={handleAddCategory}
              className="font-black uppercase text-[10px] tracking-widest shrink-0"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Existing Categories List */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Active Hardware Categories ({assetCategories.length})
          </label>
          <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
            {assetCategories.map((cat, idx) => (
              <div
                key={cat}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between gap-3"
              >
                {editingCatIndex === idx ? (
                  <TextInput
                    value={editingCatValue}
                    onChange={(e) => setEditingCatValue(e.target.value)}
                    className="flex-1 h-9 text-xs font-bold"
                  />
                ) : (
                  <span className="text-xs font-black dark:text-white">
                    {cat}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {editingCatIndex === idx ? (
                    <>
                      <Button
                        color="success"
                        size="xs"
                        onClick={() => handleEditCategory(idx)}
                        className="rounded-md font-black uppercase text-[8px]"
                      >
                        Save
                      </Button>
                      <Button
                        color="gray"
                        size="xs"
                        onClick={() => setEditingCatIndex(null)}
                        className="rounded-md font-black uppercase text-[8px]"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {cat !== "Other" && (
                        <>
                          <button
                            onClick={() => {
                              setEditingCatIndex(idx);
                              setEditingCatValue(cat);
                            }}
                            className="p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-700 transition-all"
                            title="Rename Category"
                          >
                            <SlidersHorizontal size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-all"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="blue"
          onClick={onClose}
          className="w-full font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-blue-500/20 border-none"
        >
          Save and Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssetCategoryModal;
