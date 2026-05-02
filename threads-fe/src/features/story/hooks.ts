import { useEffect, useState } from "react";
import { getStoriesAPI } from "./api";

export const useStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getStoriesAPI();

      console.log("Stories response:", res.data);

      // 🔥 fix mọi kiểu response
      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data?.stories || [];

      setStories(data);
    } catch (err) {
      console.error("Story error:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { stories, setStories, reload: load, loading };
};