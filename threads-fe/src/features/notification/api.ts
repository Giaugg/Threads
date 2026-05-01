import api from "../../core/api/api";

export const getNotificationsAPI = (userId: string) =>
  api.get(`/notifications/${userId}`);

export const markAsReadAPI = (id: string) =>
  api.put(`/notifications/${id}/read`);

export const deleteNotificationAPI = (id: string) =>
  api.delete(`/notifications/${id}`);

export const markAllAsReadAPI = (userId: string) =>
  api.post(`/notifications/mark-all-read/${userId}`);