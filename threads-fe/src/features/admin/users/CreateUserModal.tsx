import React, { useState } from "react";
import { useToast } from "../../../core/hooks/useToast";
import api from "../../../core/api/api"; // Hoặc adminAPI nếu bạn đã khai báo

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ onClose, onSuccess }: Props) {
  const toast = useToast();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
      return toast.error("Vui lòng điền đầy đủ thông tin");
    }

    try {
      setLoading(true);
      // Gọi API tạo user cho admin (thông thường là dùng chung route register hoặc route admin riêng)
      await api.post("/auth/register", form); 
      toast.success("Tạo người dùng thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Thêm Người Dùng Mới</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Tên người dùng"
            className="w-full p-3 bg-black border border-gray-800 rounded-lg text-white outline-none focus:border-white transition"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            placeholder="Email"
            type="email"
            className="w-full p-3 bg-black border border-gray-800 rounded-lg text-white outline-none focus:border-white transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mật khẩu (ít nhất 6 ký tự)"
            className="w-full p-3 bg-black border border-gray-800 rounded-lg text-white outline-none focus:border-white transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-semibold hover:bg-[#222] transition"
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}