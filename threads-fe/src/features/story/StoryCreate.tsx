import { useState } from "react";
import { createStoryAPI } from "./api";
import ImageUpload from "../../shared/components/ImageUpload";

export default function StoryCreate({ onCreated }: any) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CREATE STORY =================
  const handleCreate = async () => {
    if (!imageUrl) {
      alert("Vui lòng chọn ảnh");
      return;
    }

    try {
      setLoading(true);

      const res = await createStoryAPI({
        imageUrl,
      });

      onCreated(res.data);

      // reset
      setImageUrl("");
    } catch (err) {
      console.error("Create story error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-[#1A1A1A] space-y-3">

      {/* 🔥 IMAGE UPLOAD (reuse component) */}
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Chọn ảnh story"
      />

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!imageUrl || loading}
          className="bg-white text-black px-4 py-1 rounded-full disabled:opacity-50"
        >
          {loading ? "Đang đăng..." : "Đăng Story"}
        </button>
      </div>
    </div>
  );
}