import { useState } from "react";
import type { Post } from "./types";
import { likePostAPI, unlikePostAPI } from "./api";
import PostModal from "./PostModal";
import { timeAgoVN } from "../../core/utils";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Image as ImageIcon } from "lucide-react";

export default function PostCard({ post, onUpdate }: { post: Post; onUpdate: (p: Post) => void }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  // ✅ Hàm xử lý render nội dung có chứa Hashtag
  const renderContentWithHashtags = (content: string) => {
    return content.split(/(\s+)/).map((part, index) => {
      if (part.startsWith("#") && part.length > 1) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/search?q=${part.replace("#", "")}`);
            }}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const apiCall = liked ? unlikePostAPI : likePostAPI;
    const res = await apiCall(post.id);
    setLiked(res.data.liked);
    setLikes(res.data.likesCount);
    onUpdate({ ...post, isLiked: res.data.liked, likesCount: res.data.likesCount });
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="border-b border-threadBorder p-4 flex gap-3 hover:bg-[#0a0a0a] transition cursor-pointer"
      >
        {/* Avatar */}
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-700">
          {post.user?.avatarUrl && (
            <img src={post.user.avatarUrl} className="w-full h-full object-cover" alt="" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm hover:underline" onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${post.user?.id}`);
            }}>
              {post.user?.username}
              <span className="text-gray-500 ml-2 font-normal text-xs">{timeAgoVN(post.createdAt)}</span>
            </div>
          </div>

          {/* ✅ Nội dung bài viết với Hashtag clickable */}
          <p className="text-sm mt-1 text-gray-200 break-words whitespace-pre-wrap">
            {renderContentWithHashtags(post.content)}
          </p>

          {post.imageUrl && (
            <div className="mt-3 relative rounded-2xl overflow-hidden bg-zinc-900 border border-threadBorder">
              <img src={post.imageUrl} className="w-full max-h-96 object-cover" alt="Post" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-6 mt-4 text-gray-500">
            <button className="flex items-center gap-1 hover:text-white transition">
              <MessageCircle size={18} strokeWidth={1.5} />
            </button>
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${liked ? "text-red-500" : "hover:text-white"}`}
            >
              <Heart size={18} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-white transition">
              <Repeat2 size={18} strokeWidth={1.5} />
              <span className="text-xs">{post.repostsCount || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {open && <PostModal post={post} onClose={() => setOpen(false)} />}
    </>
  );
}