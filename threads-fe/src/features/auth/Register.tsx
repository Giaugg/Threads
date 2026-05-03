// File: src/features/auth/Register.jsx

import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../core/hooks/useToast";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

  const validatePassword = (password) => {
    // Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Sử dụng trong hàm handleSubmit
  if (!validatePassword(form.password)) {
    toast.error(
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#...)"
    );
    return;
  }

    try {
      setLoading(true);
      const loadingId = toast.loading("Đang đăng ký...");
      await register(form);
      toast.dismiss(loadingId);
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi đăng ký");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px] space-y-4">
        <h2 className="text-2xl font-bold text-center">Đăng Ký</h2>

        <input
          placeholder="Tên người dùng"
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg text-white"
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg text-white"
          type="email"
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Mật khẩu (ít nhất 6 ký tự)"
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg text-white"
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
        >
          {loading ? "Đang đăng ký..." : "Đăng Ký"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-400 font-semibold"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}