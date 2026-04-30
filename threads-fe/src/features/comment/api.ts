import api from "../../core/api/api";

export const getCommentsByUserAPI = (userId: string) =>
  api.get(`/comments/user/${userId}`);