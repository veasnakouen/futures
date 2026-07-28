import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Button } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import api from '@/services/api';
import { biometricDeviceSchema, type BiometricDeviceFormData } from '@/schemas/biometricSchema';
import BiometricDeviceList from "./attendance/BiometricDeviceList";
import BiometricDeviceForm from "./attendance/BiometricDeviceForm";

interface BiometricDevice {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  location: string;
  status: string;
  lastSync: string | null;
}

interface BiometricDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BiometricDeviceModal: React.FC<BiometricDeviceModalProps> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState<string | null>(null);
  const [deviceUsers, setDeviceUsers] = useState<any[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState<string | null>(null);
  const [decommissionId, setDecommissionId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { register, handleSubmit: hookSubmit, reset, setValue } = useForm<BiometricDeviceFormData>({
    resolver: zodResolver(biometricDeviceSchema),
    defaultValues: { name: "", ipAddress: "", port: "4370", location: "" },
  });

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/hr/attendance/devices");
      setDevices(res.data);
    } catch {
      toast.error("Failed to load biometric nodes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (isOpen) fetchDevices(); }, [isOpen]);

  const onAddDevice = async (data: BiometricDeviceFormData) => {
    const payload = { ...data, port: parseInt(data.port) };
    try {
      if (isEditMode && editingId) {
        await api.put(`/hr/attendance/devices/${editingId}`, payload);
        toast.success("Network node reconfigured successfully");
      } else {
        await api.post("/hr/attendance/devices", { ...payload, status: "Offline" });
        toast.success("New biometric node provisioned on network");
      }
      fetchDevices();
      reset();
      setIsEditMode(false);
      setEditingId(null);
    } catch {
      toast.error("Failed to save biometric node");
    }
  };

  const startEdit = (device: BiometricDevice) => {
    setIsEditMode(true);
    setEditingId(device.id.toString());
    setValue("name", device.name);
    setValue("ipAddress", device.ipAddress);
    setValue("port", device.port.toString());
    setValue("location", device.location);
  };

  const testConnection = async (id: number) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev) return;
    setIsTesting(id.toString());
    try {
      const res = await api.get(`/hr/attendance/test-connection?ipAddress=${dev.ipAddress}&port=${dev.port}`);
      if (res.data === true) {
        toast.success(`Handshake successful: Node ${dev.ipAddress} is active`);
        setDevices(devices.map((d) => (d.id === id ? { ...d, status: "Online" } : d)));
      } else {
        toast.error(`Node ${dev.ipAddress} is unreachable on port ${dev.port}`);
        setDevices(devices.map((d) => (d.id === id ? { ...d, status: "Offline" } : d)));
      }
    } catch {
      toast.error(`Network fault on route to ${dev.ipAddress}`);
    } finally {
      setIsTesting(null);
    }
  };

  const probeDevice = async (id: number) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev) return;
    setIsProbing(id.toString());
    try {
      const res = await api.get(`/hr/attendance/probe-device?ipAddress=${dev.ipAddress}&port=${dev.port}`);
      toast.success(`Hardware Identified: ${res.data}`);
    } catch {
      toast.error("Failed to probe hardware details");
    } finally {
      setIsProbing(null);
    }
  };

  const fetchDeviceUsers = async (ip: string) => {
    setIsFetchingUsers(ip);
    try {
      const res = await api.get(`/hr/attendance/device-users?ipAddress=${ip}`);
      setDeviceUsers(res.data);
      toast.success(`Retrieved ${res.data.length} users from hardware node`);
    } catch {
      toast.error("Failed to read user registry from device");
    } finally {
      setIsFetchingUsers(null);
    }
  };

  const syncDeviceData = async (id: number) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev) return;
    setIsSyncing(id.toString());
    try {
      await api.post(`/hr/attendance/sync-device?ipAddress=${dev.ipAddress}`);
      await queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(`Sync complete for ${dev.name}`);
      fetchDevices();
    } catch (err: any) {
      toast.error(err.response?.data || `Sync failed for node ${dev.ipAddress}`);
    } finally {
      setIsSyncing(null);
    }
  };

  const handleConfirmDecommission = async () => {
    if (!decommissionId) return;
    try {
      await api.delete(`/hr/attendance/devices/${decommissionId}`);
      toast.success("Device decommissioned from network");
      fetchDevices();
    } catch {
      toast.error("Failed to decommission device");
    } finally {
      setDecommissionId(null);
    }
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="3xl">
        <CustomModalHeader title="Biometric Node Manager" subtitle="Hardware Fleet Configuration" onClose={onClose} />
        <ModalBody className="dark:bg-gray-800 p-0">
          <div className="flex flex-col md:flex-row h-[500px]">
            <BiometricDeviceList
              devices={devices}
              isLoading={isLoading}
              isTesting={isTesting}
              isSyncing={isSyncing}
              isProbing={isProbing}
              isFetchingUsers={isFetchingUsers}
              deviceUsers={deviceUsers}
              onTestConnection={testConnection}
              onSyncDeviceData={syncDeviceData}
              onProbeDevice={probeDevice}
              onFetchDeviceUsers={fetchDeviceUsers}
              onStartEdit={startEdit}
              onRemoveDevice={(id) => setDecommissionId(id)}
              onClearUsers={() => setDeviceUsers([])}
            />
            <BiometricDeviceForm
              isEditMode={isEditMode}
              register={register}
              onSubmit={hookSubmit(onAddDevice)}
              onCancelEdit={() => { setIsEditMode(false); setEditingId(null); reset(); }}
            />
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Hardware Network Active</p>
            </div>
            <Button color="gray" onClick={onClose} className="rounded-md px-8 h-10">Close Manager</Button>
          </div>
        </ModalFooter>
      </Modal>

      <ConfirmModal
        show={!!decommissionId}
        onClose={() => setDecommissionId(null)}
        onConfirm={handleConfirmDecommission}
        title="Decommission Hardware Node"
        message="Permanently decommission this hardware node from the network?"
        confirmText="Decommission Device"
        type="danger"
      />
    </>
  );
};

export default BiometricDeviceModal;
