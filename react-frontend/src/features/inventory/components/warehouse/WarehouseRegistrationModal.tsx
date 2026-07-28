import React from "react";
import { Modal, ModalBody, ModalFooter, Button, TextInput, Label } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Box, Package, Upload } from "lucide-react";

interface WarehouseRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  isProcessing: boolean;
  onSubmit: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WarehouseRegistrationModal: React.FC<WarehouseRegistrationModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  categories,
  isProcessing,
  onSubmit,
  onImageChange,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader title={isEditMode ? "Modify Stock Record" : "Register New Inventory Node"} subtitle="Warehouse Ledger Entry" onClose={onClose} />
      <ModalBody className="p-6 space-y-4 text-xs">
        {/* Stepper Header */}
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
          {[
            { step: 1, title: "1. Identity" },
            { step: 2, title: "2. Logistics" },
            { step: 3, title: "3. Compliance" },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`font-black uppercase text-[10px] px-3 py-1.5 rounded-lg ${
                currentStep >= s.step ? "bg-blue-600 text-white" : "text-gray-400"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Item Name</Label>
              <TextInput placeholder="e.g. A4 Paper Case" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sizing="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">SKU Code</Label>
                <TextInput placeholder="SKU-10022" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} sizing="sm" />
              </div>
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Category</Label>
                <select className="w-full text-xs rounded-lg border-gray-300 dark:bg-gray-700 h-9" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.filter((c) => c !== "ALL").map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Quantity</Label>
                <TextInput type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} sizing="sm" />
              </div>
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Unit Price ($)</Label>
                <TextInput type="number" value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })} sizing="sm" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Vendor / Supplier</Label>
                <TextInput placeholder="Vendor Name" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} sizing="sm" />
              </div>
              <div>
                <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Bin Location</Label>
                <TextInput placeholder="Aisle 4, Rack B2" value={formData.binLocation} onChange={(e) => setFormData({ ...formData, binLocation: e.target.value })} sizing="sm" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Brand & Model</Label>
              <TextInput placeholder="Brand / Model" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} sizing="sm" />
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="bg-gray-50 border-t justify-between">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px]">Cancel</Button>
        <div className="flex gap-2">
          {currentStep > 1 && <Button color="light" onClick={() => setCurrentStep(currentStep - 1)} className="font-black uppercase text-[10px]">Back</Button>}
          {currentStep < 3 ? (
            <Button color="blue" onClick={() => setCurrentStep(currentStep + 1)} className="font-black uppercase text-[10px]">Next</Button>
          ) : (
            <Button color="blue" onClick={onSubmit} disabled={isProcessing} className="font-black uppercase text-[10px]">
              {isProcessing ? "Saving..." : isEditMode ? "Update Record" : "Register Node"}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default WarehouseRegistrationModal;
