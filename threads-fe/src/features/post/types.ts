// File: features/post/types.ts

import { type User } from "../auth/type";

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  user?: User;
  createdAt: string;

  likesCount?: number;
  isLiked?: boolean;
  commentsCount?: number;
  repostsCount?: number;
}

export interface CreatePostDto {
  content: string;
  imageUrl?: string;
}