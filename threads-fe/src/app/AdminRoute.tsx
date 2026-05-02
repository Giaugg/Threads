import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";

export default function AdminRoute() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // ❌ không phải admin → về home
  if (user.username !== "admin") {
    return <Navigate to="/" />;
  }

  // ✅ admin → cho vào layout + sub routes
  return <Outlet />;
}