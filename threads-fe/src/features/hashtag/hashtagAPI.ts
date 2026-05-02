import api from "@/core/api";

export interface Hashtag {
  id: string;
  name: string;
  createdAt: string;
  postCount: number;
}

export interface CreateHashtagDto {
  name: string;
}

export const hashtagAPI = {
  getAllHashtags: async () => {
    const response = await api.get("/hashtags");
    return response.data;
  },

  getHashtagById: async (id: string) => {
    const response = await api.get(`/hashtags/${id}`);
    return response.data;
  },

  getHashtagByName: async (name: string) => {
    const response = await api.get(`/hashtags/search/${name}`);
    return response.data;
  },

  getPostsByHashtag: async (hashtagName: string) => {
    const response = await api.get(`/hashtags/posts/${hashtagName}`);
    return response.data;
  },

  createHashtag: async (dto: CreateHashtagDto) => {
    const response = await api.post("/hashtags", dto);
    return response.data;
  },

  addHashtagsToPost: async (postId: string, hashtagNames: string[]) => {
    const response = await api.post(`/hashtags/post/${postId}`, hashtagNames);
    return response.data;
  },

  removeHashtagsFromPost: async (postId: string, hashtagNames: string[]) => {
    const response = await api.delete(`/hashtags/post/${postId}`, {
      data: hashtagNames,
    });
    return response.data;
  },
};
