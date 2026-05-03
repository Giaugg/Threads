import api from "../../core/api/api";

// CREATE
export const createRepostAPI = (data: {
  originalPostId: string;
  caption?: string;
}) => api.post("/reposts", data);

// GET by post
export const getRepostsByPostAPI = (postId: string) =>
  api.get(`/reposts/post/${postId}`);

// CHECK
export const checkRepostAPI = (postId: string) =>
  api.get(`/reposts/check/${postId}`);

// DELETE
export const deleteRepostAPI = (repostId: string) =>
  api.delete(`/reposts/${repostId}`);

export const getUserRepostsAPI = (userId: string) =>
  api.get(`/reposts/users/${userId}`);