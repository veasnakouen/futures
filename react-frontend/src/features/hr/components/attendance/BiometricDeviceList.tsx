import React from "react";
import { Server, Search, Users, Edit3, Trash2 } from "lucide-react";
import { Badge, Button, Spinner } from '@/lib/flowbite-compat';

interface BiometricDevice {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  location: string;
  status: string;
  lastSync: string | null;
}

interface BiometricDeviceListProps {
  devices: BiometricDevice[];
  isLoading: boolean;
  isTesting: string | null;
  isSyncing: string | null;
  isProbing: string | null;
  isFetchingUsers: string | null;
  deviceUsers: any[];
  onTestConnection: (id: number) => void;
  onSyncDeviceData: (id: number) => void;
  onProbeDevice: (id: number) => void;
  onFetchDeviceUsers: (ip: string) => void;
  onStartEdit: (device: BiometricDevice) => void;
  onRemoveDevice: (id: number) => void;
  onClearUsers: () => void;
}

const BiometricDeviceList: React.FC<BiometricDeviceListProps> = ({
  devices,
  isLoading,
  isTesting,
  isSyncing,
  isProbing,
  isFetchingUsers,
  deviceUsers,
  onTestConnection,
  onSyncDeviceData,
  onProbeDevice,
  onFetchDeviceUsers,
  onStartEdit,
  onRemoveDevice,
  onClearUsers,
}) => {
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeUsers = Array.isArray(deviceUsers) ? deviceUsers : [];

  return (
    <div className="flex-1 p-8 overflow-y-auto border-r">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
        Active Network Nodes
      </h4>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10"><Spinner size="xl" /></div>
        ) : safeDevices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No devices registered</p>
          </div>
        ) : (
          safeDevices.map((device) => (
            <div key={device.id} className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-md group hover:border-indigo-500/30 border transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${device.status === "Online" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    <Server size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black dark:text-white">{device.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{device.location}</p>
                  </div>
                </div>
                <Badge color={device.status === "Online" ? "success" : "failure"} className="rounded-md">{device.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3 bg-white dark:bg-gray-700 rounded-md">
                  <p className="text-[8px] font-black text-gray-400 uppercase">IP Address</p>
                  <p className="font-mono font-bold dark:text-white">{device.ipAddress}:{device.port}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700 rounded-md">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Last Sync</p>
                  <p className="font-bold dark:text-white">{device.lastSync || "N/A"}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all flex-wrap">
                <Button size="xs" color="indigo" className="flex-1 font-black uppercase text-[9px]" onClick={() => onTestConnection(device.id)} disabled={isTesting === device.id.toString()}>
                  {isTesting === device.id.toString() ? <Spinner size="sm" className="mr-1" /> : null} Test
                </Button>
                <Button size="xs" color="success" className="flex-1 font-black uppercase text-[9px]" onClick={() => onSyncDeviceData(device.id)} disabled={isSyncing === device.id.toString() || device.status === "Offline"}>
                  {isSyncing === device.id.toString() ? <Spinner size="sm" className="mr-1" /> : null} Sync
                </Button>
                <Button size="xs" color="light" className="flex-1 font-black uppercase text-[9px]" onClick={() => onProbeDevice(device.id)} disabled={isProbing === device.id.toString()}>
                  {isProbing === device.id.toString() ? <Spinner size="sm" /> : <Search size={12} className="text-blue-600 mr-1" />} Probe
                </Button>
                <Button size="xs" color="light" className="flex-1 font-black uppercase text-[9px]" onClick={() => onFetchDeviceUsers(device.ipAddress)} disabled={isFetchingUsers === device.ipAddress}>
                  {isFetchingUsers === device.ipAddress ? <Spinner size="sm" /> : <Users size={12} className="mr-1" />} Users
                </Button>
                <Button size="xs" color="indigo" onClick={() => onStartEdit(device)}><Edit3 size={14} /></Button>
                <Button size="xs" color="gray" onClick={() => onRemoveDevice(device.id)}><Trash2 size={14} className="text-red-500" /></Button>
              </div>
            </div>
          ))
        )}
      </div>

      {safeUsers.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hardware User Registry</h4>
            <Button size="xs" color="light" onClick={onClearUsers} className="text-[8px] uppercase font-black">Clear View</Button>
          </div>
          <div className="divide-y rounded-md overflow-hidden text-xs">
            <div className="grid grid-cols-2 text-[9px] font-black text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 px-4 py-2">
              <span>PIN</span><span>Name</span>
            </div>
            {safeUsers.map((u: any, i: number) => (
              <div key={i} className="grid grid-cols-2 px-4 py-2 font-bold dark:text-white hover:bg-gray-50">
                <span className="font-mono">{u.userId}</span><span>{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricDeviceList;
