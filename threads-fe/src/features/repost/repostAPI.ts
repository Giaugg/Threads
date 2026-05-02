import api from "@/core/api";

export interface Repost {
  id: string;
  userId: string;
  originalPostId: string;
  caption?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  originalPost: {
    id: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      avatarUrl: string;
    };
    likesCount: number;
  };
}

export interface CreateRepostDto {
  originalPostId: string;
  caption?: string;
}

export const repostAPI = {
  createRepost: async (dto: CreateRepostDto) => {
    const response = await api.post("/reposts", dto);
    return response.data;
  },

  getUserReposts: async (userId: string) => {
    const response = await api.get(`/reposts/user/${userId}`);
    return response.data;
  },

  getPostReposts: async (postId: string) => {
    const response = await api.get(`/reposts/post/${postId}`);
    return response.data;
  },

  isPostReposted: async (postId: string) => {
    const response = await api.get(`/reposts/check/${postId}`);
    return response.data;
  },

  deleteRepost: async (repostId: string) => {
    const response = await api.delete(`/reposts/${repostId}`);
    return response.data;
  },
};
