import { useState, type ChangeEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../../core/hooks/useToast";
import { createPostAPI, uploadImageAPI } from "./api";
import PostImageUpload from "../../shared/components/PostImageUpload";

export default function PostCreate({ onCreated }: any) {
  const { user } = useAuth();
  const toast = useToast();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!content.trim() && !imageFile) {
      toast.error("Vui lòng nhập nội dung hoặc chọn ảnh");
      return;
    }

    setError("");
    setLoading(true);
    const loadingId = toast.loading("Đang đăng bài...");

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const uploadRes = await uploadImageAPI(imageFile);
        imageUrl = uploadRes.data.url;
      }

      const res = await createPostAPI({ content, imageUrl });
      toast.dismiss(loadingId);
      toast.success("Bài viết đã được đăng thành công", { duration: 3000 });
      onCreated(res.data);
      
      // Reset form
      setContent("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Lỗi khi đăng bài";
      toast.dismiss(loadingId);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File, previewUrl: string) => {
    setImageFile(file);
    setPreviewUrl(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const getInitials = (username?: string) => {
    if (!username) return "?";
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-b border-threadBorder p-4 flex gap-3">
      {/* User Avatar */}
      <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center font-bold text-white">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-xs">{getInitials(user?.username)}</span>
        )}
      </div>

      <div className="flex-1">
        <textarea
          className="w-full bg-transparent outline-none resize-none text-lg placeholder-gray-500"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />

        <div className="mt-3 space-y-3">
          <PostImageUpload
            onImageSelect={handleImageSelect}
            onRemove={handleRemoveImage}
            previewUrl={previewUrl}
            isLoading={loading}
          />

          {error && (
            <div className="p-2 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}