import React, { useState, useEffect } from "react";
import {Modal, ModalBody, ModalFooter, Label, TextInput, Badge, Button, Spinner} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import {
  X,
  Server,
  Activity,
  ShieldCheck,
  Plus,
  Trash2,
  Globe,
  Wifi,
  Edit3,
  Users,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import api from '@/services/api';
import {
  biometricDeviceSchema,
  type BiometricDeviceFormData,
} from '@/schemas/biometricSchema';

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

const BiometricDeviceModal: React.FC<BiometricDeviceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit: hookSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<BiometricDeviceFormData>({
    resolver: zodResolver(biometricDeviceSchema),
    defaultValues: {
      name: "",
      ipAddress: "",
      port: "4370",
      location: "",
    },
  });

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/hr/attendance/devices");
      setDevices(response.data);
    } catch (err) {
      toast.error("Failed to load biometric nodes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const onAddDevice = async (data: BiometricDeviceFormData) => {
    const payload = {
      ...data,
      port: parseInt(data.port),
    };

    try {
      if (isEditMode && editingId) {
        await api.put(`/hr/attendance/devices/${editingId}`, payload);
        toast.success("Network node reconfigured successfully");
      } else {
        await api.post("/hr/attendance/devices", {
          ...payload,
          status: "Offline",
        });
        toast.success("New biometric node provisioned on network");
      }
      fetchDevices();
      reset();
      setIsEditMode(false);
      setEditingId(null);
    } catch (err) {
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
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    setIsTesting(id.toString());
    console.log(
      `[Biometric] Testing connection to ${device.ipAddress}:${device.port}...`,
    );
    try {
      const response = await api.get(
        `/hr/attendance/test-connection?ipAddress=${device.ipAddress}&port=${device.port}`,
      );
      if (response.data === true) {
        toast.success(
          `Handshake successful: Node ${device.ipAddress} is active`,
        );
        setDevices(
          devices.map((d) => (d.id === id ? { ...d, status: "Online" } : d)),
        );
      } else {
        toast.error(
          `Node ${device.ipAddress} is unreachable on port ${device.port}`,
        );
        setDevices(
          devices.map((d) => (d.id === id ? { ...d, status: "Offline" } : d)),
        );
      }
    } catch (err) {
      console.error("[Biometric] Request Failed:", err);
      toast.error(`Network fault on route to ${device.ipAddress}`);
    } finally {
      setIsTesting(null);
    }
  };

  const [deviceUsers, setDeviceUsers] = useState<any[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState<string | null>(null);

  const fetchDeviceUsers = async (ip: string) => {
    setIsFetchingUsers(ip);
    try {
      const response = await api.get(
        `/hr/attendance/device-users?ipAddress=${ip}`,
      );
      setDeviceUsers(response.data);
      toast.success(
        `Retrieved ${response.data.length} users from hardware node`,
      );
    } catch (err) {
      toast.error("Failed to read user registry from device");
    } finally {
      setIsFetchingUsers(null);
    }
  };

  const [isProbing, setIsProbing] = useState<string | null>(null);

  const probeDevice = async (id: number) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    setIsProbing(id.toString());
    try {
      const response = await api.get(
        `/hr/attendance/probe-device?ipAddress=${device.ipAddress}&port=${device.port}`,
      );
      toast.success(`Hardware Identified: ${response.data}`, {
        duration: 6000,
      });
    } catch (err) {
      toast.error("Failed to probe hardware details");
    } finally {
      setIsProbing(null);
    }
  };

  const syncDeviceData = async (id: number) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    setIsSyncing(id.toString());
    try {
      const response = await api.post(
        `/hr/attendance/sync-device?ipAddress=${device.ipAddress}`,
      );
      await queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(`Sync complete for ${device.name}`);
      fetchDevices();
    } catch (err: any) {
      const msg =
        err.response?.data || `Sync failed for node ${device.ipAddress}`;
      toast.error(msg, { duration: 6000 });
    } finally {
      setIsSyncing(null);
    }
  };

  const removeDevice = async (id: number) => {
    if (!window.confirm("Permanently decommission this hardware node?")) return;
    try {
      await api.delete(`/hr/attendance/devices/${id}`);
      toast.success("Device decommissioned from network");
      fetchDevices();
    } catch (err) {
      toast.error("Failed to decommission device");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader
        title="Biometric Node Manager"
        subtitle="Hardware Fleet Configuration"
        onClose={onClose}
      />
      <ModalBody className="dark:bg-gray-800 p-0">
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Left Side: Device List */}
          <div className="flex-1 p-8 overflow-y-auto border-r">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Active Network Nodes
            </h4>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="xl" />
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No devices registered
                  </p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-md border-transparent hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md ${device.status ==="Online"?"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600":"bg-red-50 dark:bg-red-900/20 text-red-600"}`}
                        >
                          <Server size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black dark:text-white">
                            {device.name}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {device.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        color={
                          device.status === "Online" ? "success" : "failure"
                        }
                        className="rounded-md"
                      >
                        {device.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <p className="text-[8px] font-black text-gray-400 uppercase">
                          IP Address
                        </p>
                        <p className="text-[10px] font-mono font-bold dark:text-white">
                          {device.ipAddress}:{device.port}
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <p className="text-[8px] font-black text-gray-400 uppercase">
                          Last Sync
                        </p>
                        <p className="text-[10px] font-bold dark:text-white">
                          {device.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all flex-wrap">
                      <Button
                        size="xs"
                        color="indigo"
                        className="flex-1 rounded-md font-black uppercase text-[9px] h-12"
                        onClick={() => testConnection(device.id)}
                        disabled={isTesting === device.id.toString()}
                      >
                        {isTesting === device.id.toString() ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : null}
                        Test Connection
                      </Button>
                      <Button
                        size="xs"
                        color="success"
                        className="flex-1 rounded-md font-black uppercase text-[9px] bg-emerald-600 hover:bg-emerald-700 border-none"
                        onClick={() => syncDeviceData(device.id)}
                        disabled={
                          isSyncing === device.id.toString() ||
                          device.status === "Offline"
                        }
                      >
                        {isSyncing === device.id.toString() ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : null}
                        Sync Now
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        className="flex-1 rounded-md font-black uppercase text-[9px]"
                        onClick={() => probeDevice(device.id)}
                        disabled={isProbing === device.id.toString()}
                      >
                        {isProbing === device.id.toString() ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <Search size={12} className="mr-2 text-blue-600" />
                        )}
                        Probe
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        className="flex-1 rounded-md font-black uppercase text-[9px]"
                        onClick={() => fetchDeviceUsers(device.ipAddress)}
                        disabled={isFetchingUsers === device.ipAddress}
                      >
                        {isFetchingUsers === device.ipAddress ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <Users size={12} className="mr-2" />
                        )}
                        View Users
                      </Button>
                      <Button
                        size="xs"
                        color="indigo"
                        className="rounded-md h-12"
                        onClick={() => startEdit(device)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="xs"
                        color="gray"
                        className="rounded-md"
                        onClick={() => removeDevice(device.id)}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {deviceUsers.length > 0 && (
              <div className="mt-8 border-t pt-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Hardware User Registry
                  </h4>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => setDeviceUsers([])}
                    className="text-[8px] uppercase font-black"
                  >
                    Clear View
                  </Button>
                </div>
                <div className="divide-y dark:divide-gray-700 rounded-md overflow-hidden">
                  <div className="grid grid-cols-2 text-[9px] font-black text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 px-4 py-2">
                    <span>PIN</span>
                    <span>Device Name</span>
                  </div>
                  {deviceUsers.map((u: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 px-4 py-2 text-xs font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/20"
                    >
                      <span className="font-mono">{u.userId}</span>
                      <span>{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Add New Device Form */}
          <div className="w-80 bg-gray-50 dark:bg-gray-700/20 p-8">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Register New Node
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-black text-[10px] uppercase text-gray-400">
                  Device Alias
                </Label>
                <TextInput
                  placeholder="e.g. Front Gate"
                  {...register("name")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-black text-[10px] uppercase text-gray-400">
                  Network IP
                </Label>
                <TextInput
                  placeholder="192.168.1.X"
                  {...register("ipAddress")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-black text-[10px] uppercase text-gray-400">
                  Communication Port
                </Label>
                <TextInput placeholder="4370" {...register("port")} />
              </div>
              <div className="space-y-1.5">
                <Label className="font-black text-[10px] uppercase text-gray-400">
                  Physical Location
                </Label>
                <TextInput
                  placeholder="Building A, Level 1"
                  {...register("location")}
                />
              </div>
              <Button
                color={isEditMode ? "warning" : "indigo"}
                className="w-full mt-6 rounded-md font-black uppercase text-[10px] h-12 shadow-lg shadow-indigo-500/20"
                onClick={hookSubmit(onAddDevice)}
              >
                {isEditMode ? "Update Network Node" : "Provision New Node"}
              </Button>
              {isEditMode && (
                <Button
                  color="gray"
                  className="w-full mt-2 rounded-md font-black uppercase text-[10px] h-12"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingId(null);
                    reset();
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            <div className="mt-10 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-md border-indigo-100 dark:border-indigo-900/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-indigo-600" />
                <p className="text-[9px] font-black text-indigo-600 uppercase">
                  Security Note
                </p>
              </div>
              <p className="text-[8px] font-bold text-gray-500 leading-relaxed">
                Ensure all biometric nodes are on the same VLAN as the MTP
                server. Use static IPs to prevent communication dropouts.
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-gray-400" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Global Hardware Network Active
            </p>
          </div>
          <Button
            color="gray"
            onClick={onClose}
            className="rounded-md px-8 h-12"
          >
            Close Manager
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default BiometricDeviceModal;
