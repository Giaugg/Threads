import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../../core/hooks/useToast";
import { createPostAPI, uploadImageAPI } from "./api";
import PostImageUpload from "../../shared/components/PostImageUpload";

export default function PostCreate({ onCreated }: { onCreated: (post: any) => void }) {
  const { user } = useAuth();
  const toast = useToast();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!content.trim() && !imageFile) return;

    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploadRes = await uploadImageAPI(imageFile);
        imageUrl = uploadRes.data.url;
      }

      const res = await createPostAPI({ content, imageUrl });
      toast.success("Đã đăng bài viết!");
      onCreated(res.data);
      
      setContent("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Không thể đăng bài");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-threadBorder p-4 flex gap-3 bg-black">
      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
        <img src={user?.avatarUrl} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-1">
        <textarea
          className="w-full bg-transparent outline-none resize-none text-[15px] placeholder-gray-500 min-h-[40px]"
          placeholder="Bạn đang nghĩ gì? (Dùng # để thêm hashtag)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <PostImageUpload
          onImageSelect={(file, url) => { setImageFile(file); setPreviewUrl(url); }}
          onRemove={() => { setImageFile(null); setPreviewUrl(null); }}
          previewUrl={previewUrl}
          isLoading={loading}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleCreate}
            disabled={loading || (!content.trim() && !imageFile)}
            className="bg-white text-black px-5 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}