import { Repeat } from "lucide-react";
import { useRepost } from "./hooks";

export default function RepostButton({ postId }: { postId: string }) {
  const { isReposted, toggleRepost, loading } = useRepost(postId);

  return (
    <button
      onClick={toggleRepost}
      disabled={loading}
      className={`flex items-center gap-1 text-sm transition ${
        isReposted
          ? "text-green-400"
          : "text-gray-400 hover:text-white"
      }`}
    >
      <Repeat size={18} />
      <span>{isReposted ? "Reposted" : "Repost"}</span>
    </button>
  );
}