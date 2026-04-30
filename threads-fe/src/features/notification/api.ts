import api from "../../core/api/api";

export const getNotificationsAPI = (userId: string) =>
  api.get(`/notifications/${userId}`);

export const markAsReadAPI = (id: string) =>
  api.put(`/notifications/${id}/read`);