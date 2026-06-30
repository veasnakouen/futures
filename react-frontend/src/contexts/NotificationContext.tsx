import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
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
    if (user) {
      // 1. Fetch existing notifications on load
      api.get("/notifications")
        .then(res => {
          setNotifications(res.data);
        })
        .catch(err => console.error("Failed to fetch notifications", err));

      // 2. Connect to WebSocket and subscribe to personal queue
      websocketService.connect(() => {
        websocketService.subscribe("/user/queue/notifications", (newNotification: Notification) => {
          setNotifications((prev) => [newNotification, ...prev]);
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
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
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
