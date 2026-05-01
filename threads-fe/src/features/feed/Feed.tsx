import { usePosts } from "../post/hooks";
import PostCard from "../post/PostCard";
import PostCreate from "../post/PostCreate";
import MainLayout from "../../shared/layout/MainLayout";

export default function Feed() {
  const { posts, setPosts } = usePosts();

  const handleNewPost = (post: any) => {
    setPosts([post, ...posts]);
  };

  const handleUpdatePost = (updatedPost: any) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <MainLayout>
      <PostCreate onCreated={handleNewPost} />

      {posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          onUpdate={handleUpdatePost}
        />
      ))}
    </MainLayout>
  );
}