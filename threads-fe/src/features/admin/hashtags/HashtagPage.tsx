import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import TableWrapper from "../components/TableWrapper";
import DeleteBtn from "../components/DeleteBtn"; // Tái sử dụng component DeleteBtn
import { useToast } from "../../../core/hooks/useToast";

export default function HashtagPage() {
  // Giả sử useAdmin đã có các hàm này dựa trên cấu trúc adminAPI trước đó
  const { getAllHashtags, updateHashtag, deleteHashtag, addHashtag } = useAdmin();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    const res = await getAllHashtags();
    setData(Array.isArray(res) ? res : res?.hashtags || []);
  };

  useEffect(() => {
    load();
  }, []);

  // Xử lý Xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hashtag này?")) {
      try {
        await deleteHashtag(id);
        toast.success("Đã xóa hashtag");
        load();
      } catch (error) {
        toast.error("Lỗi khi xóa");
      }
    }
  };

  // Xử lý Sửa
  const handleEdit = async (h: any) => {
    const newName = window.prompt("Sửa tên Hashtag (không cần nhập dấu #):", h.name);
    if (newName && newName !== h.name) {
      try {
        // adminAPI: updateHashtag: async (id, name)
        await updateHashtag(h.id, { name: newName });
        toast.success("Cập nhật thành công");
        load();
      } catch (error) {
        toast.error("Lỗi khi cập nhật");
      }
    }
  };

  // Xử lý Thêm mới (Thường hashtag được tạo tự động qua post, 
  // nhưng nếu admin muốn thêm thủ công có thể dùng route riêng nếu backend hỗ trợ)
  const handleAdd = async () => {
    const name = window.prompt("Nhập tên Hashtag mới (không cần nhập dấu #):");
    if (name) {
      try {
        // adminAPI: addHashtag: async (name)
        await addHashtag(name);
        toast.success("Đã thêm hashtag mới");
        load();
      } catch (error) {
        toast.error("Lỗi khi thêm hashtag");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-gray-400">Quản lý Hashtags</h2>
        {/* Nút thêm mới nếu cần */}
        <button 
          onClick={handleAdd}
          className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
        >
          + Thêm thủ công
        </button>
      </div>

      <TableWrapper>
        <thead>
          <tr className="text-gray-500 border-b border-gray-800">
            <th className="py-4 px-4 text-left">Hashtag Name</th>
            <th className="py-4 px-4 text-left">Posts Count</th> {/* Giả sử backend trả về số bài viết */}
            <th className="py-4 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={999} className="text-center text-gray-500 py-12">
                Không tìm thấy dữ liệu hashtag
              </td>
            </tr>
          ) : (
            data.map((h) => (
              <tr key={h.id} className="border-b border-gray-900 hover:bg-white/[0.02] transition">
                <td className="py-4 px-4">
                  <span className="text-blue-400 font-medium">#{h.name}</span>
                </td>
                <td className="py-4 px-4 text-gray-400">
                  {h.postsCount || 0} posts
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleEdit(h)}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Edit
                    </button>
                    <DeleteBtn onClick={() => handleDelete(h.id)} />
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