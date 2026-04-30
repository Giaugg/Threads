import api from "../../core/api/api";

export const getUserProfileAPI = (id: string) =>
  api.get(`/users/${id}/profile`);

export const getUserPostsAPI = (id: string) =>
  api.get(`/users/${id}/posts`);

export const getUserRepliesAPI = (id: string) =>
  api.get(`/comments/user/${id}`);

export const getUserMediaAPI = (id: string) =>
  api.get(`/Users/user/${id}/media`);

export const updateProfileAPI = (id: string, data: any) =>
  api.put(`/Users/${id}`, data);

export const checkFollowAPI = (id: string) =>
  api.get(`/users/${id}/follow/check`);

export const followAPI = (id: string) =>
  api.post(`/users/${id}/follow`);

export const unfollowAPI = (id: string) =>
  api.delete(`/users/${id}/follow`);