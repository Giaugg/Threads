import React, { useState } from "react";
import { useAdmin } from "../useAdmin";
import { useToast } from "../../../core/hooks/useToast";

export default function EditPostModal({ post, onClose, onSuccess }: any) {
  const { updatePost } = useAdmin();
  const toast = useToast();
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updatePost(post.id, { content });
      toast.success("Updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#111] w-full max-w-xl rounded-3xl border border-gray-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <span className="text-sm text-gray-500">Post by @{post.user?.username}</span>
        </div>

        <textarea
          className="w-full bg-black border border-gray-800 rounded-2xl p-4 min-h-[150px] outline-none resize-none focus:border-blue-500 mb-4 text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {post.imageUrl && (
          <div className="mb-4 relative rounded-xl overflow-hidden border border-gray-800">
            <img src={post.imageUrl} className="w-full max-h-40 object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Image editing is limited to content updates
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-400">Cancel</button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-600 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}