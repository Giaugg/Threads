import api from "../../core/api/api";

// 🔥 lấy story từ người mình follow
export const getStoriesAPI = () =>
  api.get("/stories/me");

// 🔥 tạo story (DTO)
export const createStoryAPI = (data: {
  content?: string;
  imageUrl?: string;
}) => api.post("/stories", data);

// 🔥 like
export const likeStoryAPI = (id: string) =>
  api.post(`/stories/${id}/like`);

// 🔥 unlike
export const unlikeStoryAPI = (id: string) =>
  api.post(`/stories/${id}/unlike`);

// 🔥 delete
export const deleteStoryAPI = (id: string) =>
  api.delete(`/stories/${id}`);