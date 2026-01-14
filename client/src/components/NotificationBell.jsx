import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Badge } from "../components/ui/badge";

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
    if (!open) markAllRead(); // ✅ SAFE NOW
  };

  return (
    <div className="relative">
      <button onClick={toggle} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-600 text-white rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-md z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 border-b text-sm"
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
