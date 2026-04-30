import api from "../../lib/api";

export const followAPI = (followingId: string) =>
  api.post(`/follows?followingId=${followingId}`);

export const unfollowAPI = (followingId: string) =>
  api.delete(`/follows?followingId=${followingId}`);

export const checkFollowAPI = (followingId: string) =>
  api.get(`/follows/check?followingId=${followingId}`);