import api from "../../core/api/api";

export interface AdminStatistics {
  totalUsers: number;
  totalPosts: number;
  totalStories: number;
  totalHashtags: number;
  totalReposts: number;
  totalComments: number;
  totalLikes: number;
  activeStories: number;
  expiredStories: number;
}

export const adminAPI = {
  // ================= USERS =================
  getAllUsers: async (page = 1, pageSize = 10) => {
    const res = await api.get("/admin/users", { params: { page, pageSize } });
    return res.data;
  },

  searchUsers: async (keyword: string) => {
    const res = await api.get("/admin/users/search", {
      params: { keyword },
    });
    return res.data;
  },

  updateUser: async (id: string, data: any) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  // ================= POSTS =================
  getAllPosts: async (page = 1, pageSize = 10) => {
    const res = await api.get("/admin/posts", { params: { page, pageSize } });
    return res.data;
  },

  createPost: async (data: any) => {
    const res = await api.post("/admin/posts", data);
    return res.data;
  },

  updatePost: async (id: string, data: any) => {
    const res = await api.put(`/admin/posts/${id}`, data);
    return res.data;
  },

  deletePost: async (id: string) => {
    const res = await api.delete(`/admin/posts/${id}`);
    return res.data;
  },

  // ================= STORIES =================
  getAllStories: async (page = 1, pageSize = 10) => {
    const res = await api.get("/admin/stories", {
      params: { page, pageSize },
    });
    return res.data;
  },

  deleteStory: async (id: string) => {
    const res = await api.delete(`/admin/stories/${id}`);
    return res.data;
  },

  // ================= HASHTAGS =================
// ================= HASHTAGS =================
  getAllHashtags: async () => {
    // Lưu ý: Controller của bạn chưa có phân trang [HttpGet], 
    // nên nếu API trả về toàn bộ thì bỏ params.
    const res = await api.get("/hashtags"); 
    return res.data;
  },

  // KHỚP VỚI [HttpPost] CreateHashtag(CreateHashtagDto dto)
  addHashtag: async (name: string) => {
    // Gửi Object { name } khớp với CreateHashtagDto
    const res = await api.post("/hashtags", { name });
    return res.data;
  },

  // KHỚP VỚI [HttpDelete("post/{postId}")]
  // Lưu ý: Controller của bạn dùng [FromBody] cho Delete, 
  // đây là trường hợp đặc biệt của Axios
  removeHashtagsFromPost: async (postId: string, hashtagNames: string[]) => {
    const res = await api.delete(`/hashtags/post/${postId}`, {
      data: hashtagNames, // Axios yêu cầu body của DELETE nằm trong field 'data'
    });
    return res.data;
  },

  // ================= REPOST =================
  getAllReposts: async (page = 1, pageSize = 10) => {
    const res = await api.get("/admin/reposts", {
      params: { page, pageSize },
    });
    return res.data;
  },

  updateRepost: async (id: string, caption: string) => {
    const res = await api.put(`/admin/reposts/${id}`, { caption });
    return res.data;
  },

  deleteRepost: async (id: string) => {
    const res = await api.delete(`/admin/reposts/${id}`);
    return res.data;
  },

  // ================= COMMENTS =================
  getAllComments: async (page = 1, pageSize = 10) => {
    const res = await api.get("/admin/comments", {
      params: { page, pageSize },
    });
    return res.data;
  },

  updateComment: async (id: string, content: string) => {
    const res = await api.put(`/admin/comments/${id}`, content);
    return res.data;
  },

  deleteComment: async (id: string) => {
    const res = await api.delete(`/admin/comments/${id}`);
    return res.data;
  },

  // ================= STAT =================
  getStatistics: async () => {
    const res = await api.get("/admin/statistics");
    return res.data;
  },
};
export type AdminAPI = typeof adminAPI;
export default adminAPI;