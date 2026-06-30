import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import websocketService from "../services/websocketService";
import authService from "../services/authService";

interface NotificationContextType {
  notifications: string[];
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>;
  clearNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      websocketService.connect(() => {
        websocketService.subscribe("/topic/updates", (msg) => {
          setNotifications((prev) =>
            [msg.content || "New update received", ...prev].slice(0, 5),
          );
        });
      });
    }

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        clearNotifications,
        unreadCount: notifications.length,
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
