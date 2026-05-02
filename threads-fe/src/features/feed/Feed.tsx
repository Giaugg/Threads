import { useEffect, useState } from "react";
import { getPostsAPI } from "../post/api"; // Đảm bảo bạn đã update api.ts như hướng dẫn trước
import PostCard from "../post/PostCard";
import PostCreate from "../post/PostCreate";
import MainLayout from "../../shared/layout/MainLayout";
import StoryList from "../story/StoryList";
import { type Post } from "../post/types";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Hàm fetch dữ liệu từ API
  const fetchPosts = async (pageNumber: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await getPostsAPI(pageNumber, 10); // pageNumber, pageSize
      const { items, totalPages } = res.data;

      if (pageNumber === 1) {
        setPosts(items);
      } else {
        // Nối thêm bài viết mới vào danh sách hiện tại
        setPosts((prev) => [...prev, ...items]);
      }

      // Kiểm tra xem còn trang để tải không
      setHasMore(pageNumber < totalPages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu lần đầu
  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleNewPost = (newPost: Post) => {
    // Thêm bài viết mới vào ngay đầu danh sách
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <MainLayout stories={<StoryList />}>
      <PostCreate onCreated={handleNewPost} />

      <div className="flex flex-col">
        {posts.length === 0 && !loading ? (
          <div className="text-center text-gray-500 p-6">No posts yet</div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={`${p.id}-${p.createdAt}`} // Key an toàn hơn khi nối mảng
              post={p}
              onUpdate={handleUpdatePost}
            />
          ))
        )}

        {/* Nút Tải thêm / Loading state */}
        <div className="p-8 flex justify-center border-t border-threadBorder">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
          ) : hasMore ? (
            <button
              onClick={handleLoadMore}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
            >
              Xem thêm bài viết
            </button>
          ) : (
            posts.length > 0 && (
              <span className="text-gray-500 text-sm italic">
                Bạn đã xem hết bài viết hôm nay.
              </span>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
}