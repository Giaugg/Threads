import { useEffect, useState } from "react";
import { getPostsAPI } from "./api";
import PostCard from "./PostCard";
import { Post } from "./types";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const res = await getPostsAPI(pageNumber);
      const { items, totalPages } = res.data;

      if (pageNumber === 1) {
        setPosts(items);
      } else {
        setPosts((prev) => [...prev, ...items]);
      }

      // Kiểm tra nếu đã hết trang
      setHasMore(pageNumber < totalPages);
    } catch (error) {
      console.error("Lỗi tải bài viết", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={() => {}} />
      ))}

      {hasMore && (
        <div className="p-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="text-blue-400 hover:text-white transition text-sm font-medium"
          >
            {loading ? "Đang tải..." : "Xem thêm bài viết"}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="p-10 text-center text-gray-500 text-sm">
          Bạn đã xem hết bài viết.
        </div>
      )}
    </div>
  );
}