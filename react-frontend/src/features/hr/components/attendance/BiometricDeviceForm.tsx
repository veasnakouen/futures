import React from "react";
import { Button, Label, TextInput } from '@/lib/flowbite-compat';
import { ShieldCheck } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { type BiometricDeviceFormData } from "@/schemas/biometricSchema";

interface BiometricDeviceFormProps {
  isEditMode: boolean;
  register: UseFormRegister<BiometricDeviceFormData>;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

const BiometricDeviceForm: React.FC<BiometricDeviceFormProps> = ({
  isEditMode,
  register,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-700/20 p-8 flex flex-col justify-between">
      <div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
          {isEditMode ? "Edit Network Node" : "Register New Node"}
        </h4>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400">Device Alias</Label>
            <TextInput placeholder="e.g. Front Gate" {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400">Network IP</Label>
            <TextInput placeholder="192.168.1.X" {...register("ipAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400">Communication Port</Label>
            <TextInput placeholder="4370" {...register("port")} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400">Physical Location</Label>
            <TextInput placeholder="Building A, Level 1" {...register("location")} />
          </div>

          <Button
            color={isEditMode ? "warning" : "indigo"}
            className="w-full mt-6 rounded-md font-black uppercase text-[10px] h-11 shadow-lg shadow-indigo-500/20"
            onClick={onSubmit}
          >
            {isEditMode ? "Update Network Node" : "Provision New Node"}
          </Button>

          {isEditMode && (
            <Button
              color="gray"
              className="w-full mt-2 rounded-md font-black uppercase text-[10px] h-10"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-md border border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={14} className="text-indigo-600" />
          <p className="text-[9px] font-black text-indigo-600 uppercase">Security Note</p>
        </div>
        <p className="text-[8px] font-bold text-gray-500 leading-relaxed">
          Ensure all biometric nodes are on the same VLAN as the MTP server. Use static IPs to prevent dropouts.
        </p>
      </div>
    </div>
  );
};

export default BiometricDeviceForm;
