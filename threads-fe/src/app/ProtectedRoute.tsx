// File: app/ProtectedRoute.tsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}