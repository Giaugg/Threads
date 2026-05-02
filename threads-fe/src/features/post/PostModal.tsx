import { useEffect, useState } from "react";
import { getCommentsAPI, createCommentAPI, getRepliesAPI } from "./api";
import { useToast } from "../../core/hooks/useToast";
import { timeAgoVN } from "../../core/utils";
import { useNavigate } from "react-router-dom";

export default function PostModal({ post, onClose }: any) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  // ... (giữ các state cũ)

  // ✅ Helper giống PostCard
  const renderContent = (text: string) => {
    return text.split(/(\s+)/).map((part, i) => 
      part.startsWith("#") ? (
        <span 
          key={i} 
          className="text-blue-400 cursor-pointer hover:underline"
          onClick={() => { navigate(`/search?q=${part.replace("#", "")}`); onClose(); }}
        >
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-start pt-10 z-50 overflow-y-auto px-4">
      <div className="bg-[#111111] w-full max-w-2xl rounded-2xl border border-threadBorder shadow-2xl pb-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-threadBorder">
          <span className="font-bold">Bài viết</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">Đóng</button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
               <img src={post.user?.avatarUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <div className="font-bold text-sm">{post.user?.username}</div>
              <div className="text-xs text-gray-500">{timeAgoVN(post.createdAt)}</div>
            </div>
          </div>
          <div className="text-[15px] text-gray-100 whitespace-pre-wrap mb-4">
            {renderContent(post.content)}
          </div>
          {post.imageUrl && (
             <img src={post.imageUrl} className="w-full rounded-xl border border-threadBorder max-h-[500px] object-contain bg-black" alt="" />
          )}
        </div>
        
        {/* Input Comment & List Comments... (Giữ nguyên phần logic cũ của bạn) */}
      </div>
    </div>
  );
}