import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./features/auth/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: "#121212",
          color: "#fff",
          border: "1px solid #1A1A1A",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: "#1a3a1a",
            borderColor: "#2d5f2d",
          },
          icon: "✅",
        },
        error: {
          duration: 4000,
          style: {
            background: "#3a1a1a",
            borderColor: "#5f2d2d",
          },
          icon: "❌",
        },
        loading: {
          style: {
            background: "#1a2a3a",
            borderColor: "#2d4f5f",
          },
          icon: "⏳",
        },
      }}
    />
    <App />
  </AuthProvider>
);