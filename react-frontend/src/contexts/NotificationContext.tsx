import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import websocketService from "../services/websocketService";
import authService from "../services/authService";
import api from "../services/api";

export interface Notification {
  id: number;
  recipientUsername: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAsRead: (id: number) => Promise<void>;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      // 1. Fetch existing notifications on load safely
      api
        .get("/notifications")
        .then((res) => {
          const list =
            res.data?.data?.content ||
            res.data?.content ||
            res.data?.data ||
            res.data ||
            [];
          setNotifications(Array.isArray(list) ? list : []);
        })
        .catch(() => {
          setNotifications([]);
        });

      // 2. Connect to WebSocket and subscribe to personal queue
      websocketService.connect(() => {
        websocketService.subscribe("/user/queue/notifications", (newNotification: Notification) => {
          setNotifications((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [newNotification, ...safePrev];
          });
          toast.success(newNotification.title || "New Notification");
        });

        // Subscribe to global broadcast topics
        websocketService.subscribe("/topic/notifications", (event: any) => {
          const broadcastNotification: Notification = {
            id: Date.now() + Math.floor(Math.random() * 1000), // Ephemeral ID
            title: event.type ? event.type.replace(/_/g, ' ') : "System Broadcast",
            message: event.message,
            read: false,
            type: "BROADCAST",
            createdAt: event.timestamp || new Date().toISOString(),
            recipientUsername: ""
          };
          setNotifications((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [broadcastNotification, ...safePrev];
          });
          toast.success(event.message);
        });
      });
    }

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map((n) => (n.id === id ? { ...n, read: true } : n));
      });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: safeNotifications,
        setNotifications,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
