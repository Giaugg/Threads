import { useEffect, useState } from "react";
import {
  createRepostAPI,
  deleteRepostAPI,
  checkRepostAPI,
} from "./api";

export const useRepost = (postId: string) => {
  const [isReposted, setIsReposted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= CHECK =================
  useEffect(() => {
    if (!postId) return;

    checkRepostAPI(postId)
      .then((res) => {
        setIsReposted(res.data.isReposted);
      })
      .catch(() => {});
  }, [postId]);

  // ================= TOGGLE =================
  const toggleRepost = async () => {
    try {
      setLoading(true);

      if (isReposted) {
        // ⚠️ bạn cần lưu repostId nếu muốn delete chính xác
        // tạm thời BE nên hỗ trợ delete theo postId + userId
        await deleteRepostAPI(postId);
        setIsReposted(false);
      } else {
        await createRepostAPI({
          originalPostId: postId,
        });
        setIsReposted(true);
      }
    } catch (err) {
      console.error("Repost error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isReposted,
    loading,
    toggleRepost,
  };
};