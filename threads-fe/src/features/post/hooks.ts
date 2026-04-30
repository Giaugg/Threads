// File: features/post/hooks.ts

import { useEffect, useState } from "react";
import { getPostsAPI } from "./api";
import type { Post } from "./types";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPostsAPI().then((res) => setPosts(res.data));
  }, []);

  return { posts, setPosts };
};