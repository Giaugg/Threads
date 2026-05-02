import React from "react";
import { useRepost } from "../useRepost";
import { Repeat2 } from "lucide-react";
import "@/features/repost/RepostButton.css";

interface RepostButtonProps {
  postId: string;
  onRepost?: () => void;
}

export const RepostButton: React.FC<RepostButtonProps> = ({
  postId,
  onRepost,
}) => {
  const { createRepost, loading } = useRepost();
  const [isReposted, setIsReposted] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [showInput, setShowInput] = React.useState(false);

  const handleRepost = async () => {
    const result = await createRepost(postId, caption || undefined);
    if (result) {
      setIsReposted(true);
      setCaption("");
      setShowInput(false);
      onRepost?.();
    }
  };

  return (
    <div className="repost-container">
      <button
        className={`repost-button ${isReposted ? "reposted" : ""}`}
        onClick={() => setShowInput(!showInput)}
        disabled={loading}
      >
        <Repeat2 size={18} />
        <span>{isReposted ? "Reposted" : "Repost"}</span>
      </button>

      {showInput && (
        <div className="repost-input-container">
          <input
            type="text"
            placeholder="Add a caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button onClick={handleRepost} disabled={loading}>
            {loading ? "Reposting..." : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
};
