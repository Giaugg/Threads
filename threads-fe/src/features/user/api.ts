import api from "../../core/api/api";

export const getUsersAPI = () =>
  api.get("/users");

export const searchUsersAPI = (q: string) =>
  api.get(`/users/search?q=${q}`);

export const getUserAPI = (id: string) =>
  api.get(`/users/${id}`);

export const updateUserAPI = (id: string, data: any) =>
  api.put(`/users/${id}`, data);

export const deleteUserAPI = (id: string) =>
  api.delete(`/users/${id}`);

export const getProfileAPI = (id: string) =>
  api.get(`/users/${id}/profile`);

export const getTopUsersAPI = () =>
  api.get("/users/top-followed?take=10");