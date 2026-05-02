import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";

interface Props {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // ❌ chưa login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 route admin nhưng user không phải admin
  if (adminOnly && user.username !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🔥 auto redirect admin (CHỈ khi vào root)
  if (user.username === "admin" && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}