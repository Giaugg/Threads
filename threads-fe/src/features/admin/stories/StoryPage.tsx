import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import TableWrapper from "../components/TableWrapper";
import DeleteBtn from "../components/DeleteBtn";
import { timeAgoVN } from "../../../core/utils";
import { useToast } from "../../../core/hooks/useToast";

export default function StoryPage() {
  const { getAllStories, deleteStory } = useAdmin();
  const [data, setData] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const toast = useToast();

  const load = async () => {
    const res = await getAllStories();
    // Đảm bảo lấy đúng mảng data từ response
    setData(Array.isArray(res) ? res : res?.stories || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa story này?")) {
      try {
        await deleteStory(id);
        toast.success("Đã xóa story");
        load();
      } catch (error) {
        toast.error("Lỗi khi xóa story");
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-400 px-2">Quản lý Stories</h2>

      <TableWrapper>
        <thead>
          <tr className="text-gray-500 border-b border-gray-800">
            <th className="py-4 px-4 text-left">Người đăng</th>
            <th className="py-4 px-4 text-left">Nội dung / Ảnh</th>
            <th className="py-4 px-4 text-left">Thời gian</th>
            <th className="py-4 px-4 text-left">Trạng thái</th>
            <th className="py-4 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={999} className="text-center text-gray-500 py-12">
                Không tìm thấy story nào
              </td>
            </tr>
          ) : (
            data.map((s) => (
              <tr key={s.id} className="border-b border-gray-900 hover:bg-white/[0.02] transition">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={s.user?.avatarUrl} 
                      className="w-8 h-8 rounded-full object-cover bg-gray-800" 
                      alt="" 
                    />
                    <span className="font-medium">{s.user?.username}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {s.imageUrl ? (
                      <img 
                        src={s.imageUrl} 
                        className="w-12 h-16 object-cover rounded-md cursor-zoom-in border border-gray-800 hover:border-gray-500 transition"
                        onClick={() => setPreviewImage(s.imageUrl)}
                        title="Click để xem ảnh lớn"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-800 rounded-md flex items-center justify-center text-[10px] text-gray-500">
                        Text
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-400">
                  {timeAgoVN(s.createdAt)}
                </td>
                <td className="py-4 px-4">
                  {new Date(s.expiresAt) > new Date() ? (
                    <span className="text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full">Đang hiện</span>
                  ) : (
                    <span className="text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded-full">Hết hạn</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <DeleteBtn onClick={() => handleDelete(s.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableWrapper>

      {/* MODAL XEM ẢNH NHANH (QUICK VIEW) */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-10 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in duration-200" 
            alt="Preview" 
          />
          <button className="absolute top-10 right-10 text-white text-4xl">&times;</button>
        </div>
      )}
    </div>
  );
}