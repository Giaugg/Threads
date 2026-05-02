"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopUsersAPI } from "../../features/user/api";
import { useAuth } from "../../features/auth/AuthContext";

export default function MainLayout({
  children,
  stories, // 👈 thêm prop để render story
}: {
  children: React.ReactNode;
  stories?: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"posts" | "stories">("posts");

  // ================= FETCH SUGGESTIONS =================
  useEffect(() => {
    if (!user) return;
    fetchSuggestions();
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      const res = await getTopUsersAPI();

      let data = res.data.filter((u: any) => u.user.id !== user.id);

      const shuffled = data.sort(() => 0.5 - Math.random());

      const randomUsers = shuffled.slice(
        0,
        Math.floor(Math.random() * 2) + 3
      );

      setSuggestions(randomUsers);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  // ================= AUTH PAGES =================
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F3F5F7]">
        {children}
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F5F7] flex flex-col">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1A1A1A]">
        <Navbar />
      </div>

      <div className="flex flex-1 justify-center w-full max-w-[1280px] mx-auto">

        {/* LEFT SIDEBAR */}
        <aside className="hidden md:flex w-[72px] xl:w-[280px] border-r border-[#1A1A1A]">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-[640px]">

          {/* 🔥 TOGGLE POSTS / STORIES */}
          <div className="flex border-b border-[#1A1A1A] sticky top-[56px] bg-[#0A0A0A] z-40">
            <button
              onClick={() => setViewMode("posts")}
              className={`flex-1 py-3 text-sm ${
                viewMode === "posts"
                  ? "border-b-2 border-white font-semibold"
                  : "text-gray-500"
              }`}
            >
              Bài viết
            </button>

            <button
              onClick={() => setViewMode("stories")}
              className={`flex-1 py-3 text-sm ${
                viewMode === "stories"
                  ? "border-b-2 border-white font-semibold"
                  : "text-gray-500"
              }`}
            >
              Story
            </button>
          </div>

          {/* 🔥 CONTENT SWITCH */}
          <div className="h-full overflow-y-auto">
            {viewMode === "posts" ? children : stories || (
              <div className="p-6 text-center text-gray-500">
                Không có story
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex w-[350px] flex-col p-6 space-y-4">

          {/* SUGGESTIONS */}
          <div className="rounded-2xl bg-[#121212] border border-[#1A1A1A] overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold">Gợi ý cho bạn</h2>
            </div>

            <div className="px-1 pb-1">
              {suggestions.map((item) => (
                <div
                  key={item.user.id}
                  onClick={() => navigate(`/profile/${item.user.id}`)}
                  className="group flex items-center gap-3 p-3 hover:bg-[#1A1A1A] rounded-xl cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#262626] overflow-hidden">
                    {item.user.avatarUrl ? (
                      <img
                        src={item.user.avatarUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">
                        {item.user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px]">
                      {item.user.username}
                    </div>
                    <div className="text-[#666] text-[13px]">
                      {item.followers} followers
                    </div>
                  </div>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full"
                  >
                    Theo dõi
                  </button>
                </div>
              ))}

              {suggestions.length === 0 && (
                <div className="p-4 text-gray-500 text-sm">
                  Không có gợi ý
                </div>
              )}
            </div>

            <div
              onClick={fetchSuggestions}
              className="p-4 text-blue-400 text-sm cursor-pointer hover:bg-[#1A1A1A]"
            >
              Làm mới gợi ý
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-4 text-[13px] text-[#666] flex flex-wrap gap-x-3 gap-y-1">
            <span className="hover:underline cursor-pointer">Điều khoản</span>
            <span className="hover:underline cursor-pointer">Chính sách</span>
            <span>© 2026 Threads Clone</span>
          </div>
        </aside>
      </div>
    </div>
  );
}