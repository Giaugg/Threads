import { useState } from "react";
import { adminAPI } from "./adminAPI";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (fn: any) => {
    try {
      setLoading(true);
      const data = await fn(); // Chỗ này KHÔNG dùng .data nữa vì adminAPI đã làm rồi
      console.log("Admin API response:", data);
      return data; 
    } catch (e) {
      console.error(e);
      setError("Something went wrong");
      return null; // Trả về null thay vì [] để dễ kiểm tra cho Object
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,

    // Đổi tên hàm để khớp với các file UserPage, PostPage...
    getAllUsers: () => handle(() => adminAPI.getAllUsers()),
    searchUsers: () => handle(() => adminAPI.searchUsers()),
    deleteUser: (id: string) => adminAPI.deleteUser(id),

    getAllPosts: () => handle(() => adminAPI.getAllPosts()),
    createPost: (data: any) => handle(() => adminAPI.createPost(data)),
    updatePost: (id: string, data: any) => handle(() => adminAPI.updatePost(id, data)),
    deletePost: (id: string) => adminAPI.deletePost(id),

    getAllStories: () => handle(() => adminAPI.getAllStories()),
    deleteStory: (id: string) => adminAPI.deleteStory(id),

    getAllHashtags: () => handle(() => adminAPI.getAllHashtags()),
    addHashtag: (name: string) => handle(() => adminAPI.addHashtag(name)),
    deleteHashtag: (id: string) => adminAPI.deleteHashtag(id),
    editHashtag: (id: string, name: string) => handle(() => adminAPI.updateHashtag(id, name)),

    getAllReposts: () => handle(() => adminAPI.getAllReposts()),
    deleteRepost: (id: string) => adminAPI.deleteRepost(id),

    getStats: () => handle(adminAPI.getStatistics),
  };
};