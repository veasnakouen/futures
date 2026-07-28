import React from "react";
import { Modal, ModalBody, ModalFooter, Button, Badge } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Box, MapPin, DollarSign, Layers } from "lucide-react";

interface WarehouseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

const WarehouseDetailsModal: React.FC<WarehouseDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader title="Stock Item Inspector" subtitle={`Node ID: #${item.sku || item.id}`} onClose={onClose} />
      <ModalBody className="p-6 space-y-4 bg-white dark:bg-gray-800 text-xs">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : <Box size={28} />}
          </div>
          <div>
            <h4 className="font-black text-lg dark:text-white uppercase">{item.name}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.location || "Primary Node"} &bull; {item.category || "General"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border">
            <p className="text-[9px] font-black text-blue-500 uppercase">Stock Quantity</p>
            <p className="font-mono font-black text-2xl dark:text-white">{item.quantity} <span className="text-xs text-gray-400">{item.unit || "pcs"}</span></p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border">
            <p className="text-[9px] font-black text-emerald-600 uppercase">Unit Price</p>
            <p className="font-mono font-black text-2xl text-emerald-600">${item.unitPrice || 0}</p>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border">
          <p className="font-bold text-gray-500 uppercase">Description / Specifications</p>
          <p className="text-gray-600 dark:text-gray-300">{item.description || "Standard warehouse stock node."}</p>
        </div>
      </ModalBody>
      <ModalFooter className="justify-end bg-gray-50 border-t">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px] px-6 h-10">Close Inspector</Button>
      </ModalFooter>
    </Modal>
  );
};

export default WarehouseDetailsModal;
