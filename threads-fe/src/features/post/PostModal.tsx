import { useEffect, useState } from "react";
import { getCommentsAPI, createCommentAPI, getRepliesAPI } from "./api";
import { timeAgo } from "../../core/utils";

export default function PostModal({
  post,
  onClose,
}: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const res = await getCommentsAPI(post.id);
    setComments(res.data);

    const repliesData: Record<string, any[]> = {};
    for (const c of res.data) {
      const replyRes = await getRepliesAPI(c.id);
      repliesData[c.id] = replyRes.data;
    }
    setReplies(repliesData);
  };

  const handleComment = async () => {
    if (!content.trim()) return;

    const res = await createCommentAPI({
      postId: post.id,
      content,
    });

    setComments([res.data, ...comments]);
    setContent("");
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    const res = await createCommentAPI({
      postId: post.id,
      content: replyContent,
      parentCommentId: parentId,
    });

    setReplies({
      ...replies,
      [parentId]: [res.data, ...(replies[parentId] || [])],
    });
    setReplyTo(null);
    setReplyContent("");
  };

  const renderComment = (c: any, isReply = false) => (
    <div
      key={c.id}
      className={`rounded-xl p-3 ${isReply ? "bg-[#141414] ml-6 border border-gray-800" : "bg-[#0f0f0f] border border-gray-700"}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-semibold">{c.user?.username || "Unknown"}</div>
          <div className="text-[11px] text-gray-500">{timeAgo(c.createdAt)}</div>
        </div>
        {!isReply && (
          <button
            onClick={() => setReplyTo(c.id)}
            className="text-blue-400 text-xs font-medium"
          >
            Reply
          </button>
        )}
      </div>
      <p className="text-sm text-gray-100">{c.content}</p>

      {replyTo === c.id && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-gray-400">Replying to {c.user?.username}</div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Add a reply..."
            className="w-full min-h-[80px] rounded-xl border border-gray-700 bg-black px-3 py-2 text-sm text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleReply(c.id)}
              className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Send reply
            </button>
            <button
              onClick={() => setReplyTo(null)}
              className="rounded-xl border border-gray-700 px-3 py-2 text-xs text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {replies[c.id]?.map((r) => renderComment(r, true))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-start pt-10 z-50">
      <div className="bg-[#111111] w-full max-w-3xl rounded-3xl p-5 shadow-2xl shadow-black/50 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">Post detail</div>
            <div className="text-xl font-semibold">{post.user?.username}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-700 px-3 py-2 text-gray-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-[#141414] p-5 mb-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-400">{post.user?.username}</div>
              <div className="text-xs text-gray-500">{timeAgo(post.createdAt)}</div>
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-100">{post.content}</p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-[#121212] p-4 mb-5">
          <div className="text-sm text-gray-400 mb-3">Write a comment</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[100px] rounded-3xl border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleComment}
              className="rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
            >
              Comment
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-700 p-6 text-center text-sm text-gray-500">
              No comments yet. Be the first to reply.
            </div>
          ) : (
            comments.map((c) => renderComment(c))
          )}
        </div>
      </div>
    </div>
  );
}