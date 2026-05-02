import React, { useState, useEffect } from "react";
import { useAdmin } from "../useAdmin";
import { useToast } from "../../../core/hooks/useToast";
import PostImageUpload from "../../../shared/components/PostImageUpload";
import { uploadImageAPI } from "../../../features/post/api"; // Đảm bảo api này tồn tại

export default function CreatePostModal({ onClose, onSuccess }: any) {
  const { searchUsers, createPost } = useAdmin();
  const toast = useToast();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  // User Selection
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Image Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Search user logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim()) {
        const res = await searchUsers(searchTerm);
        setUsers(res || []);
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleCreate = async () => {
    if (!selectedUser) return toast.error("Vui lòng chọn người dùng");
    if (!content.trim() && !imageFile) return toast.error("Nhập nội dung hoặc chọn ảnh");

    setLoading(true);
    const loadingId = toast.loading("Đang tạo bài viết...");

    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadRes = await uploadImageAPI(imageFile);
        imageUrl = uploadRes.data.url;
      }

      await createPost({
        content,
        imageUrl,
        userId: selectedUser.id // Gửi ID của user được chọn
      });

      toast.dismiss(loadingId);
      toast.success("Đã tạo bài viết thành công");
      onSuccess();
      onClose();
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Lỗi khi tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#111] w-full max-w-xl rounded-3xl border border-gray-800 p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Create New Post (Admin)</h2>

        {/* Search User Section */}
        <div className="mb-4 relative">
          <label className="text-xs text-gray-500 mb-1 block">Post as User:</label>
          {selectedUser ? (
            <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/50 p-2 rounded-xl">
              <span className="font-medium text-blue-400">@{selectedUser.username}</span>
              <button onClick={() => setSelectedUser(null)} className="text-xs text-gray-400 hover:text-white">Change</button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search username..."
                className="w-full bg-black border border-gray-700 rounded-xl p-2 text-sm outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {users.length > 0 && (
                <div className="absolute w-full mt-1 bg-[#181818] border border-gray-700 rounded-xl max-h-40 overflow-y-auto z-10 shadow-xl">
                  {users.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => setSelectedUser(u)}
                      className="p-2 hover:bg-white/5 cursor-pointer text-sm border-b border-gray-800 last:border-0"
                    >
                      {u.username} <span className="text-gray-500 text-xs">({u.email})</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Content Section */}
        <textarea
          className="w-full bg-transparent border border-gray-800 rounded-2xl p-4 min-h-[120px] outline-none resize-none focus:border-gray-600 mb-4"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Image Section */}
        <PostImageUpload
          onImageSelect={(file, url) => { setImageFile(file); setPreviewUrl(url); }}
          onRemove={() => { setImageFile(null); setPreviewUrl(null); }}
          previewUrl={previewUrl}
          isLoading={loading}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-gray-400 hover:text-white transition">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading || !selectedUser}
            className="bg-white text-black px-8 py-2 rounded-full font-bold disabled:opacity-50 hover:bg-gray-200 transition"
          >
            {loading ? "Creating..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}