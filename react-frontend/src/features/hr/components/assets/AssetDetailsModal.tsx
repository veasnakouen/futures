import React from "react";
import { Modal, ModalBody, ModalFooter, Button, Badge } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { getAssetIcon } from "./AssetGridCard";
import { Printer, RotateCcw, UserPlus, Zap } from "lucide-react";
import { format } from "date-fns";

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
  onGenerateLabel: (asset: any) => void;
  onOpenAssign: (asset: any) => void;
  onProcessReturn: (asset: any) => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  isOpen,
  onClose,
  asset: a,
  onGenerateLabel,
  onOpenAssign,
  onProcessReturn,
}) => {
  if (!isOpen || !a) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <CustomModalHeader
        title="Hardware Node Specification"
        subtitle={`System Audit & Lifecycle Ledger for ${a.name}`}
        onClose={onClose}
      />
      <ModalBody className="p-6 space-y-6">
        {/* Top Header Card */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 shadow-sm overflow-hidden">
            {a.imageUrl ? (
              <img
                src={a.imageUrl}
                alt={a.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="scale-150">{getAssetIcon(a.assetType)}</div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <Badge
                color={a.status === "Assigned" ? "blue" : "success"}
                className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm"
              >
                {a.status || "Available"}
              </Badge>
              <Badge color="gray" className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                {a.assetType || "Standard Node"}
              </Badge>
            </div>
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
              {a.name}
            </h3>
            <p className="text-xs font-mono font-bold text-gray-400 mt-1">
              S/N: {a.serialNumber} • Barcode: {a.barcode || "N/A"}
            </p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Brand & Model
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              {a.brand || "Generic"} {a.modelNumber || ""}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Vendor / Supplier
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              {a.vendor || "Direct Procurement"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Condition
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              {a.assetCondition || "Good"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Purchase Cost
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              ${a.purchaseCost ? a.purchaseCost.toLocaleString() : "0.00"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Purchase Date
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              {a.purchaseDate ? format(new Date(a.purchaseDate), "yyyy-MM-dd") : "N/A"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Warranty Expiry
            </p>
            <p className="text-xs font-black dark:text-white mt-1">
              {a.warrantyExpiryDate ? format(new Date(a.warrantyExpiryDate), "yyyy-MM-dd") : "N/A"}
            </p>
          </div>
        </div>

        {/* Custodian Banner */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
              Current Custodian Assignment
            </p>
            <p className="text-sm font-black dark:text-white mt-0.5">
              {a.employee
                ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish} (${a.employee.departmentName || "General"})`
                : "Unassigned • Available in Main Warehouse"}
            </p>
          </div>
          <Button
            size="xs"
            color={a.status === "Assigned" ? "warning" : "blue"}
            onClick={() => {
              onClose();
              if (a.status === "Assigned") onProcessReturn(a);
              else onOpenAssign(a);
            }}
            className="rounded-lg font-black uppercase text-[9px]"
          >
            {a.status === "Assigned" ? <RotateCcw size={12} className="mr-1" /> : <UserPlus size={12} className="mr-1" />}
            {a.status === "Assigned" ? "Return" : "Deploy"}
          </Button>
        </div>
      </ModalBody>
      <ModalFooter className="flex justify-between">
        <Button
          color="light"
          onClick={() => onGenerateLabel(a)}
          className="font-black uppercase text-[10px] tracking-widest"
        >
          <Printer size={14} className="mr-1.5 text-blue-600" /> Print Label
        </Button>
        <Button
          color="gray"
          onClick={onClose}
          className="font-black uppercase text-[10px] tracking-widest"
        >
          Close Specification
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssetDetailsModal;
