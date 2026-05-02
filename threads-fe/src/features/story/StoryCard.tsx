import { likeStoryAPI, unlikeStoryAPI } from "./api";
import { useState } from "react";

export default function StoryCard({ story }: any) {
  const [liked, setLiked] = useState(story.isLiked);

  const toggleLike = async () => {
    try {
      if (liked) {
        await unlikeStoryAPI(story.id);
        setLiked(false);
      } else {
        await likeStoryAPI(story.id);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div className="w-20 flex flex-col items-center gap-1">
      <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-[2px]">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
          {story.imageUrl ? (
            <img
              src={story.imageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs">
              {story.user?.username?.[0]}
            </div>
          )}
        </div>
      </div>

      <span className="text-xs text-gray-400">
        {story.user?.username}
      </span>

      <button
        onClick={toggleLike}
        className="text-xs text-pink-400"
      >
        {liked ? "♥" : "♡"}
      </button>
    </div>
  );
}