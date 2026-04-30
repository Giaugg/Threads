import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../features/auth/AuthContext";
import { Home, Search, Heart, User } from "lucide-react";
import { searchUsersAPI } from "../../features/user/api";

const menu = [
  { icon: Home, label: "Dành cho bạn", path: "/" },
  { icon: Heart, label: "Hoạt động", path: "/activity" },
  { icon: User, label: "Trang cá nhân", path: "/profile" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const res = await searchUsersAPI(value);
    setResults(res.data);
    setShow(true);
  };

  return (
    <div className="hidden md:flex w-[72px] xl:w-72 flex-col border-r border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 h-screen overflow-y-auto">

      <div className="px-3 py-6 space-y-4 flex-1">

        {/* LOGO */}
        <div
          className="flex items-center gap-3 px-3 mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="font-black text-black">T</span>
          </div>
          <span className="hidden xl:inline text-xl font-bold">Threads</span>
        </div>

        {/* 🔍 SEARCH */}
        <div className="relative px-3">
          <div className="flex items-center bg-[#121212] rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm người..."
              className="bg-transparent outline-none text-sm ml-2 w-full"
            />
          </div>

          {/* RESULT */}
          {show && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[#121212] border border-[#1A1A1A] rounded-xl shadow-lg z-50">
              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    navigate(`/profile/${u.id}`);
                    setShow(false);
                  }}
                  className="p-3 hover:bg-[#1E1E1E] cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full" />
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="space-y-1 mt-4">
          {menu.map((item, i) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl
                ${isActive ? "bg-[#121212] text-white" : "text-gray-500 hover:bg-[#121212] hover:text-white"}`}
              >
                <item.icon size={24} />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}