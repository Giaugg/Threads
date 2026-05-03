import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";

const tabs = [
  { id: "dashboard", label: "Dashboard", path: "/admin" },
  { id: "users", label: "Users", path: "/admin/users" },
  { id: "posts", label: "Posts", path: "/admin/posts" },
  { id: "stories", label: "Stories", path: "/admin/stories" },
  { id: "hashtags", label: "Hashtags", path: "/admin/hashtags" },
];

export const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user
    logout();

    // clear token (nếu có lưu)
    localStorage.removeItem("token");

    // redirect
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#111] border-r border-gray-800 fixed h-full p-5 flex flex-col justify-between">
        
        {/* TOP */}
        <div>
          <h2 className="text-xl font-bold mb-8">ADMIN</h2>

          <nav>
            {tabs.map((t) => (
              <NavLink
                key={t.id}
                to={t.path}
                end={t.path === "/admin"}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg mb-2 ${
                    isActive
                      ? "bg-white text-black"
                      : "text-gray-400 hover:bg-[#222]"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM - LOGOUT */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
};