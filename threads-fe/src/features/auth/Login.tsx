import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../core/hooks/useToast";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const loadingId = toast.loading("Đang đăng nhập...");
      await login(form);
      toast.dismiss(loadingId);
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi đăng nhập");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px] space-y-4">
        <h2 className="text-2xl font-bold text-center">Đăng Nhập</h2>

        <input
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg text-white"
          placeholder="Email"
          type="email"
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg text-white"
          placeholder="Mật khẩu"
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
        >
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:text-blue-400 font-semibold"
          >
            Đăng ký
          </button>
        </p>
      </div>
    </div>
  );
}