import { useState, useCallback } from "react";
import { repostAPI, Repost } from "./repostAPI";

export const useRepost = () => {
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRepost = useCallback(
    async (originalPostId: string, caption?: string) => {
      setLoading(true);
      try {
        const data = await repostAPI.createRepost({
          originalPostId,
          caption,
        });
        setError(null);
        return data;
      } catch (err) {
        setError("Failed to create repost");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUserReposts = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const data = await repostAPI.getUserReposts(userId);
      setReposts(data);
      setError(null);
      return data;
    } catch (err) {
      setError("Failed to fetch reposts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRepost = useCallback(async (repostId: string) => {
    setLoading(true);
    try {
      const data = await repostAPI.deleteRepost(repostId);
      setError(null);
      return data;
    } catch (err) {
      setError("Failed to delete repost");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reposts,
    loading,
    error,
    createRepost,
    getUserReposts,
    deleteRepost,
  };
};
