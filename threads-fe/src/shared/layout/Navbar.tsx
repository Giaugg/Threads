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
          <button
            onClick={() => setShowNoti(!showNoti)}
            className="relative p-2 text-gray-400 hover:text-white"
          >
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                {notifications.length}
              </span>
            )}
            <Bell size={22} />
          </button>

          {showNoti && (
            <div className="absolute right-0 w-80 bg-black border">
              {notifications.length === 0 ? (
                <div className="p-3 text-gray-500">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.postId) navigate(`/post/${n.postId}`);
                    }}
                    className="p-3 border-b cursor-pointer"
                  >
                    <div>{n.message}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

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