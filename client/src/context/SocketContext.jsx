import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      console.log("⏳ Waiting for user before socket connect");
      return;
    }

    if (socketRef.current) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", user._id);
    });

    socket.on("hire-notification", (data) => {
      console.log("📨 Notification received:", data);

      toast.success(data.message);

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
          read: false,
        },
        ...prev,
      ]);

      setUnreadCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user?._id]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
