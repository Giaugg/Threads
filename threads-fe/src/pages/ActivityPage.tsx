import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Trash2, CheckCircle, CheckSquare } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { useToast } from "../core/hooks/useToast";
import { getNotificationsAPI, markAsReadAPI, deleteNotificationAPI, markAllAsReadAPI } from "../features/notification/api";

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  fromUserId: string;
  postId: string;
  isRead: boolean;
  createdAt: string;
}

export default function ActivityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsAPI(user.id);
        setNotifications(res.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadAPI(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Đánh dấu đã đọc", { duration: 2000 });
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Lỗi khi đánh dấu đã đọc");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      const loadingId = toast.loading("Đang cập nhật...");
      await markAllAsReadAPI(user.id);
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      toast.dismiss(loadingId);
      toast.success("Đã đánh dấu tất cả đã đọc", { duration: 2000 });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Lỗi khi cập nhật");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationAPI(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Đã xóa thông báo", { duration: 2000 });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      follow: "👤",
      like: "❤️",
      comment: "💬",
      repost: "🔄",
    };
    return icons[type] || "📢";
  };

  const getNotificationColor = (type: string) => {
    const colors: { [key: string]: string } = {
      follow: "from-blue-500/10 to-blue-500/5",
      like: "from-red-500/10 to-red-500/5",
      comment: "from-green-500/10 to-green-500/5",
      repost: "from-purple-500/10 to-purple-500/5",
    };
    return colors[type] || "from-gray-500/10 to-gray-500/5";
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-[#1A1A1A] rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Bell size={24} />
              Hoạt động
            </h1>
            <p className="text-xs text-gray-500">
              {filteredNotifications.length} thông báo
            </p>
          </div>

          {/* MARK ALL AS READ */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckSquare size={16} />
              Đã đọc tất cả
            </button>
          )}
        </div>

        {/* FILTER TABS */}
        <div className="max-w-2xl mx-auto px-4 flex gap-4 border-t border-[#1A1A1A]">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              filter === "all"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              filter === "unread"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Bell size={48} className="text-gray-600" />
            <div className="text-center">
              <p className="text-lg font-semibold">Không có thông báo nào</p>
              <p className="text-sm text-gray-500">
                {filter === "unread"
                  ? "Bạn đã đọc tất cả thông báo"
                  : "Hãy đợi hoạt động mới từ những người bạn theo dõi"}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-[#0A0A0A] transition group ${
                  !notification.isRead ? "bg-[#111111]" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* ICON */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-xl`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 break-words">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-[#1A1A1A] rounded-full transition"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle size={18} className="text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-[#1A1A1A] rounded-full transition"
                      title="Xóa"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* CLICKABLE AREA FOR POST */}
                {notification.postId && (
                  <div className="mt-3">
                    <button
                      className="text-xs bg-[#1A1A1A] hover:bg-[#242424] px-3 py-2 rounded-lg transition"
                    >
                      Xem bài viết
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
