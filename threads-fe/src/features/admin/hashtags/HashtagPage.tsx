import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import TableWrapper from "../components/TableWrapper";
import DeleteBtn from "../components/DeleteBtn";
import { useToast } from "../../../core/hooks/useToast";

export default function HashtagPage() {
  const { getAllHashtags, editHashtag, deleteHashtag, addHashtag } = useAdmin();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const load = async () => {
    try {
      const res = await getAllHashtags();
      setData(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách hashtag");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- XỬ LÝ THÊM MỚI ---
  const handleAdd = async () => {
    const name = window.prompt("Nhập tên Hashtag mới (không cần dấu #):");
    if (!name) return;

    try {
      await addHashtag( name ); 
      toast.success("Đã thêm hashtag");
      load();
    } catch (error) {
      toast.error("Thêm thất bại (Hashtag có thể đã tồn tại)");
    }
  };

  // --- XỬ LÝ CẬP NHẬT (SỬA) ---
  const handleEdit = async (h: any) => {
    const newName = window.prompt("Sửa tên Hashtag:", h.name);
    if (newName && newName !== h.name) {
      try {
        // ĐẢM BẢO truyền object cho tham số thứ 2
        await editHashtag(h.id, newName );
        toast.success("Cập nhật thành công");
        load();
      } catch (error) {
        toast.error("Lỗi khi cập nhật");
      }
    }
  };

  // --- XỬ LÝ XÓA ---
  const handleDelete = async (h: any) => {
    const warning = h.postCount > 0 
      ? `Hashtag #${h.name} đang được dùng trong ${h.postCount} bài viết. Bạn vẫn muốn xóa?` 
      : `Xóa hashtag #${h.name}?`;

    if (window.confirm(warning)) {
      try {
        await deleteHashtag(h.id);
        toast.success("Xóa thành công");
        load();
      } catch (error) {
        toast.error("Lỗi khi xóa dữ liệu");
      }
    }
  };

  const filteredData = data.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-400">Quản lý Hashtags</h2>
          <input 
            type="text"
            placeholder="Tìm nhanh..."
            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-zinc-600 text-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={handleAdd}
          className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition text-sm"
        >
          + Thêm thủ công
        </button>
      </div>

      <TableWrapper>
        <thead>
          <tr className="text-gray-500 border-b border-zinc-800">
            <th className="py-4 px-4 text-left font-medium">Tên Hashtag</th>
            <th className="py-4 px-4 text-left font-medium">Độ phổ biến</th>
            <th className="py-4 px-4 text-right font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-12">
                Không có dữ liệu phù hợp
              </td>
            </tr>
          ) : (
            filteredData.map((h) => (
              <tr key={h.id} className="border-b border-zinc-900 hover:bg-white/[0.01] transition">
                <td className="py-4 px-4">
                  <span className="text-blue-400 font-semibold">#{h.name}</span>
                </td>
                <td className="py-4 px-4 text-zinc-500">
                  {h.postCount} bài viết
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-4">
                    <button 
                      onClick={() => handleEdit(h)}
                      className="text-sm text-zinc-500 hover:text-white transition"
                    >
                      Sửa
                    </button>
                    <DeleteBtn onClick={() => handleDelete(h)} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableWrapper>
    </div>
  );
}