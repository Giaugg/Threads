import React, { useState, useEffect, useCallback } from "react";
import { timeAgoVN } from "../../core/utils"; // Giả định bạn có helper này

export default function StoryViewModal({ stories, initialIndex, onClose }: any) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000;

  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    const interval = 50;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (interval / STORY_DURATION) * 100;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [handleNext, currentIndex]);

  if (!currentStory) return null;

return (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md">
    
    {/* --- NÚT PREVIOUS (Bên trái) --- */}
    {currentIndex > 0 && (
      <button 
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className="absolute left-4 md:left-10 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    )}

    {/* --- NÚT NEXT (Bên phải) --- */}
    <button 
      onClick={(e) => { e.stopPropagation(); handleNext(); }}
      className="absolute right-4 md:right-10 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>

    {/* Nút Close */}
    <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-50">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div className="relative w-full max-w-[420px] h-[90vh] md:h-[800px] bg-[#111] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/5">
      
      {/* Progress Bars (Giữ nguyên) */}
      <div className="absolute top-0 left-0 right-0 p-3 flex gap-1 z-30">
        {stories.map((_: any, idx: number) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-[50ms] linear"
              style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* User Info & Content (Giữ nguyên) */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
        {currentStory.imageUrl ? (
          <img src={currentStory.imageUrl} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
        ) : (
          <div className="p-10 text-center text-xl font-medium leading-relaxed">{currentStory.content}</div>
        )}

        {/* Vùng click nhạy cảm (Vẫn giữ để người dùng dùng quen kiểu mobile) */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
          <div className="w-2/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
        </div>
      </div>
    </div>
  </div>
);
}