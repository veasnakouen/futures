import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Select, Button, FileInput } from 'flowbite-react';
import { Image as ImageIcon, X } from 'lucide-react';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen, onClose, isEditMode, formData, setFormData, handleSubmit
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col">
          <h3 className="text-xl font-black dark:text-white leading-tight">
            {isEditMode ? 'Modify Inventory Record' : 'Initialize Stock Item'}
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">System Node: Inventory_Control_Alpha</p>
        </div>
      </ModalHeader>

      <ModalBody className="bg-white dark:bg-gray-800 p-8">
        <form id="inventory-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Item Nomenclature</Label>
              <TextInput required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">SKU / Identity Code</Label>
              <TextInput value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Asset Category</Label>
              <Select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="rounded-lg">
                <option>Office Supplies</option>
                <option>IT Equipment</option>
                <option>Furniture</option>
                <option>Consumables</option>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Storage Location</Label>
              <TextInput value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Current Qty</Label>
              <TextInput type="number" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Safety Threshold</Label>
              <TextInput type="number" required value={formData.minQuantity} onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Measurement Unit</Label>
              <TextInput value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="rounded-lg" placeholder="e.g. pcs, boxes" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Unit Valuation (USD)</Label>
              <TextInput type="number" step="0.01" required value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })} className="rounded-lg" />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Asset Visual Reference</Label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border dark:border-gray-700 shadow-inner shrink-0">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <FileInput id="item-image" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Label htmlFor="item-image" className="inline-block px-3 py-1.5 bg-white dark:bg-gray-700 border dark:border-gray-700 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                    Upload
                  </Label>
                </div>
                {formData.imageUrl && (
                  <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="p-1.5 text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex justify-end gap-4 w-full">
          <Button color="light" onClick={onClose} className="rounded-lg px-8 font-black uppercase text-[10px]">Discard</Button>
          <Button type="submit" form="inventory-form" color="blue" className="rounded-lg px-12 shadow-xl shadow-blue-500/30 font-black uppercase text-[10px] h-12">
            {isEditMode ? 'Update Database' : 'Initialize Node'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default InventoryItemModal;
