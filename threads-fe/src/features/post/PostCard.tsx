import { useState } from "react";
import type { Post } from "./types";
import { likePostAPI, unlikePostAPI } from "./api";
import PostModal from "./PostModal";
import { timeAgo, timeAgoVN } from "../../core/utils";
import { useNavigate } from "react-router-dom";

// ✅ ICON
import { Heart, MessageCircle, Repeat2, Image as ImageIcon } from "lucide-react";

export default function PostCard({
  post,
  onUpdate,
}: {
  post: Post;
  onUpdate: (p: Post) => void;
}) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    const apiCall = liked ? unlikePostAPI : likePostAPI;
    const res = await apiCall(post.id);

    setLiked(res.data.liked);
    setLikes(res.data.likesCount);

    onUpdate({
      ...post,
      isLiked: res.data.liked,
      likesCount: res.data.likesCount,
    });
  };

  const handleNavigateToProfile = () => {
    if (post.user?.id) {
      navigate(`/profile/${post.user.id}`);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (username?: string) => {
    if (!username) return "?";
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="border-b border-threadBorder p-4 flex gap-3 hover:bg-[#0a0a0a] transition cursor-pointer">
        {/* Avatar */}
        <div
          onClick={handleNavigateToProfile}
          className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center font-bold text-white hover:opacity-80 transition"
          title={post.user?.username || "User"}
        >
          {post.user?.avatarUrl ? (
            <img
              src={post.user.avatarUrl}
              alt={post.user.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs">{getInitials(post.user?.username)}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="font-semibold text-sm">
            <span
              onClick={handleNavigateToProfile}
              className="hover:underline cursor-pointer"
            >
              {post.user?.username || "Unknown"}
            </span>
            <span className="text-gray-500 ml-2 font-normal">
              {timeAgoVN(post.createdAt)}
            </span>
          </div>

          <p className="text-sm mt-2 text-gray-200 break-words">
            {post.content}
          </p>

          {/* Image Display */}
          {post.imageUrl && (
            <div className="mt-3 relative rounded-2xl overflow-hidden bg-black/50 max-w-full">
              <img
                src={post.imageUrl}
                alt="Post media"
                className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
                onClick={() => setOpen(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-6 mt-3 text-gray-500">
            {/* COMMENT */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1 hover:text-white transition group"
            >
              <MessageCircle size={18} strokeWidth={1.5} />
              <span className="text-xs group-hover:text-white">
                {post.commentsCount || 0}
              </span>
            </button>

            {/* LIKE */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition group ${
                liked ? "text-red-500" : "hover:text-white"
              }`}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                fill={liked ? "currentColor" : "none"}
              />
              <span className="text-xs group-hover:text-white">{likes}</span>
            </button>

            {/* REPOST */}
            <button className="flex items-center gap-1 hover:text-white transition group">
              <Repeat2 size={18} strokeWidth={1.5} />
              <span className="text-xs group-hover:text-white">
                {post.repostsCount || 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <PostModal post={post} onClose={() => setOpen(false)} />
      )}
    </>
  );
}