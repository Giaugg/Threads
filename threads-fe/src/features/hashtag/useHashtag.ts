import { useState, useCallback } from "react";
import { hashtagAPI, Hashtag } from "./hashtagAPI";

export const useHashtag = () => {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllHashtags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await hashtagAPI.getAllHashtags();
      setHashtags(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hashtags");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getHashtagByName = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const data = await hashtagAPI.getHashtagByName(name);
      setError(null);
      return data;
    } catch (err) {
      setError("Failed to fetch hashtag");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createHashtag = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const data = await hashtagAPI.createHashtag({ name });
      setError(null);
      return data;
    } catch (err) {
      setError("Failed to create hashtag");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hashtags,
    loading,
    error,
    getAllHashtags,
    getHashtagByName,
    createHashtag,
  };
};
