import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

 useEffect(() => {
  if (!isAuthenticated || !user?._id) return;

  // 🔥 ALWAYS DISCONNECT OLD SOCKET
  if (socketRef.current) {
    socketRef.current.disconnect();
    socketRef.current = null;
  }

  const socket = io("https://backendgigflow.onrender.com", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  socketRef.current = socket;

 socket.on("connect", () => {
  console.log("✅ FRONTEND CONNECTED socket.id =", socket.id);
  console.log("🧑 USER ID SENT TO JOIN =", user._id, "type =", typeof user._id);

  socket.emit("join", user._id);
});

  socket.on("hire-notification", (data) => {
    console.log("📨 Hire notification received:", data);

    toast.success(data.message);

    setNotifications((prev) => [
      { id: Date.now(), message: data.message, read: false },
      ...prev,
    ]);

    setUnreadCount((c) => c + 1);
  });

  return () => {
    socket.disconnect();
  };
}, [isAuthenticated, user?._id]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return ctx;
};
