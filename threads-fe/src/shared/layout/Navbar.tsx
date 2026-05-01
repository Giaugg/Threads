// File: shared/layout/Navbar.tsx

import {
  Moon,
  Sun,
  Bell,
  Settings,
  Search,
  LogOut,
  User,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsersAPI } from "../../features/user/api";
import { useAuth } from "../../features/auth/AuthContext";
import { getNotificationsAPI } from "../../features/notification/api";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [showNoti, setShowNoti] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, logout, notifications, setNotifications } = useAuth();
  // SEARCH
  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const res = await searchUsersAPI(value);
    setResults(res.data);
    setShowSearch(true);
  };

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    getNotificationsAPI(user.id).then(res => {
      setNotifications(res.data);
    });
  }, [user]);

    // LOGOUT
    const handleLogout = () => {
      logout();
      navigate("/login");
    };

  return (
    <div className="sticky top-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-[#1A1A1A]">
      <div className="flex items-center justify-between px-6 h-[72px] max-w-[1280px] mx-auto">

        {/* SEARCH */}
        <div className="hidden md:block flex-1 max-w-md mx-auto relative">
          <div className="flex items-center bg-[#121212] border border-[#1A1A1A] rounded-2xl px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm người..."
              className="bg-transparent outline-none ml-2 text-sm w-full"
            />
          </div>

          {/* RESULT */}
          {showSearch && results.length > 0 && (
            <div className="absolute w-full mt-2 bg-[#121212] border border-[#1A1A1A] rounded-xl z-50">
              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    navigate(`/profile/${u.id}`);
                    setShowSearch(false);
                    setQuery("");
                  }}
                  className="p-3 hover:bg-[#1E1E1E] cursor-pointer flex gap-2 items-center"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
                    {u.avatarUrl && (
                      <img
                        src={u.avatarUrl}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 relative" ref={menuRef}>

          {/* 🔔 NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() => setShowNoti(!showNoti)}
              className="relative p-2 text-gray-400 hover:text-white transition"
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full font-semibold">
                  {notifications.length > 99 ? "99+" : notifications.length}
                </span>
              )}
              <Bell size={22} />
            </button>

            {showNoti && (
              <div className="absolute -right-2 top-12 w-96 bg-[#121212] border border-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden z-50">
                {/* HEADER */}
                <div className="px-4 py-3 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <h3 className="text-sm font-semibold">Thông báo</h3>
                </div>

                {/* NOTIFICATIONS LIST */}
                {notifications.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 8).map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-[#1A1A1A] hover:bg-[#1A1A1A] transition cursor-pointer ${
                          !n.isRead ? "bg-[#111111]" : ""
                        }`}
                      >
                        <div className="flex gap-2">
                          <div className="text-lg mt-0.5">
                            {["follow"].includes(n.type)
                              ? "👤"
                              : ["like"].includes(n.type)
                                ? "❤️"
                                : ["comment"].includes(n.type)
                                  ? "💬"
                                  : ["repost"].includes(n.type)
                                    ? "🔄"
                                    : "📢"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 break-words">
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(n.createdAt).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    Không có thông báo nào
                  </div>
                )}

                {/* FOOTER - SEE ALL BUTTON */}
                <div className="px-4 py-3 border-t border-[#1A1A1A] bg-[#0A0A0A]">
                  <button
                    onClick={() => {
                      navigate("/activity");
                      setShowNoti(false);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* THEME */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Settings size={22} />
          </button>

          {/* DROPDOWN */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-[#121212] border border-[#1A1A1A] rounded-xl shadow-lg overflow-hidden z-50">

              {/* USER INFO */}
              <div className="px-4 py-3 border-b border-[#1A1A1A]">
                <div className="text-sm font-semibold">
                  {user?.username || "Guest"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>

              {/* PROFILE */}
              <button
                onClick={() => {
                  navigate(`/profile/${user?.id}`);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#1A1A1A]"
              >
                <User size={18} />
                Trang cá nhân
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#1A1A1A]"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}