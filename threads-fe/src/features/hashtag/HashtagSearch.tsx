import React from "react";
import { useHashtag } from "../useHashtag";
import { Search } from "lucide-react";
import "@/features/hashtag/HashtagSearch.css";

interface HashtagSearchProps {
  onHashtagSelect?: (hashtag: string) => void;
}

export const HashtagSearch: React.FC<HashtagSearchProps> = ({
  onHashtagSelect,
}) => {
  const { hashtags, loading, error, getAllHashtags } = useHashtag();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);

  React.useEffect(() => {
    getAllHashtags();
  }, []);

  const filteredHashtags = hashtags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hashtag-search">
      <div className="search-input-container">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search hashtags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {showResults && (
        <div className="hashtag-results">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : filteredHashtags.length > 0 ? (
            filteredHashtags.map((tag) => (
              <div
                key={tag.id}
                className="hashtag-result"
                onClick={() => {
                  onHashtagSelect?.(tag.name);
                  setSearchTerm("");
                  setShowResults(false);
                }}
              >
                <span className="hashtag-name">#{tag.name}</span>
                <span className="hashtag-count">{tag.postCount} posts</span>
              </div>
            ))
          ) : (
            <div>No hashtags found</div>
          )}
        </div>
      )}
    </div>
  );
};
