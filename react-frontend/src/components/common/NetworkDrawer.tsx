import React, { useState, useEffect } from "react";
import { Drawer, Avatar, Spinner } from '@/lib/flowbite-compat';
import {
  Users,
  Search,
  MessageSquare,
  X,
  Shield,
  Briefcase,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from '@/lib/react-router-compat';
import api from '../../services/api';
import toast from "react-hot-toast";
import websocketService from '../../services/websocketService';

interface NetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Connection {
  id: number;
  userId: string;
  targetId: string;
  targetType: string;
  targetName: string;
  targetAvatar: string;
}

const NetworkDrawer: React.FC<NetworkDrawerProps> = ({ isOpen, onClose }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    websocketService.connect(() => {
      websocketService.subscribe("/topic/onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchConnections();
    }
  }, [isOpen]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await api.get("/connections");
      setConnections(res.data);
    } catch (err) {
      console.error("Failed to fetch network connections", err);
    } finally {
      setLoading(false);
    }
  };

  const removeConnection = async (type: string, id: string) => {
    try {
      await api.delete(`/connections/${type}/${id}`);
      setConnections((prev) =>
        prev.filter((c) => !(c.targetType === type && c.targetId === id)),
      );
      toast.success("Removed from network");
    } catch (err) {
      toast.error("Failed to remove connection");
    }
  };

  const filtered = connections.filter((c) =>
    c.targetName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      position="right"
      className="p-0 w-80 dark:bg-gray-800"
    >
      <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h3 className="font-black text-lg dark:text-white flex items-center gap-2">
            <Users size={20} className="text-indigo-600" /> My Network
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {connections.length} Connections
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search connections..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-140px)] p-2">
        {loading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-10 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-bold">No connections found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((conn) => {
              const isOnline = onlineUsers.includes(conn.targetName);
              return (
                <div
                  key={conn.id}
                  className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group flex items-center gap-3"
                >
                  <div className="relative">
                    {conn.targetAvatar ? (
                      <img
                        src={conn.targetAvatar}
                        alt=""
                        className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                        {conn.targetType === "CLIENT" ? (
                          <UserIcon size={20} />
                        ) : conn.targetType === "EMPLOYER" ? (
                          <Briefcase size={20} />
                        ) : (
                          <Shield size={20} />
                        )}
                      </div>
                    )}
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black dark:text-white truncate">
                      {conn.targetName}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {conn.targetType}
                    </p>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        onClose();
                        navigate(
                          `/chat?chatWith=${encodeURIComponent(conn.targetName)}`,
                        );
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md"
                      title="Message"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() =>
                        removeConnection(conn.targetType, conn.targetId)
                      }
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-md"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default NetworkDrawer;
