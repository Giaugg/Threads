import { useState } from "react";
import { useStories } from "./hooks";
import StoryCard from "./StoryCard";
import StoryCreate from "./StoryCreate";
import StoryViewModal from "./StoryViewModal"; // Import component Modal

export default function StoryList() {
  const { stories, setStories, loading } = useStories();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const handleNew = (story: any) => {
    setStories([story, ...stories]);
  };

  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading stories...</p>;
  }

  return (
    <div className="border-b border-[#1A1A1A]">
      <StoryCreate onCreated={handleNew} />

      <div className="flex gap-3 overflow-x-auto p-3 no-scrollbar">
        {stories.length === 0 ? (
          <p className="text-gray-500 text-sm p-2">No stories</p>
        ) : (
          stories.map((s, index) => (
            <div key={s.id} onClick={() => handleOpenStory(index)} className="cursor-pointer">
              <StoryCard story={s} />
            </div>
          ))
        )}
      </div>

      {/* RENDER MODAL KHI CÓ STORY ĐƯỢC CHỌN */}
      {selectedStoryIndex !== null && (
        <StoryViewModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
}