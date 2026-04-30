// File: features/auth/AuthContext.tsx

import { createContext, useEffect, useState, useContext } from "react";
import { loginAPI, registerAPI, meAPI } from "./api";
import type { User, LoginDto, RegisterDto } from "./type";
import {
  startConnection,
  onReceiveNotification,
} from "../../core/socket/notification";
import { getNotificationsAPI } from "../notification/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // LOGIN
  const login = async (data: LoginDto) => {
    const res = await loginAPI(data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // REGISTER
  const register = async (data: RegisterDto) => {
    const res = await registerAPI(data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setNotifications([]);
  };

  // INIT USER
  useEffect(() => {
    const init = async () => {
      try {
        const res = await meAPI();
        setUser(res.data);
      } catch {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // REALTIME NOTIFICATION
  useEffect(() => {
    if (!user) return;

    // load initial
    getNotificationsAPI(user.id).then(res => {
      setNotifications(res.data);
    });

    // realtime
    startConnection(user.id);

    const unsubscribe = onReceiveNotification((data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => unsubscribe?.();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        setNotifications,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ custom hook
export const useAuth = () => useContext(AuthContext);