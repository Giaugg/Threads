// File: features/post/api.ts

import api from "../../core/api/api";

export const getPostsAPI = (page: number, size: number = 10) => 
  api.get(`/posts?pageNumber=${page}&pageSize=${size}`);

export const uploadImageAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post<{ url: string }>("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createPostAPI = (data: any) =>
  api.post("/posts", data);

export const likePostAPI = (postId: string) =>
  api.post(`/likes/${postId}`);

export const unlikePostAPI = (postId: string) =>
  api.delete(`/likes/${postId}`);

export const getCommentsAPI = (postId: string) =>
  api.get(`/Comments/post/${postId}`);

export const getRepliesAPI = (commentId: string) =>
  api.get(`/Comments/${commentId}/replies`);

export const createCommentAPI = (data: any) =>
  api.post("/Comments", data);

export const getPostsByUserAPI = (userId: string) =>
  api.get(`/posts/user/${userId}`);