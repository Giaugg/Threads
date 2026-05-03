export interface Repost {
  id: string;
  userId: string;
  originalPostId: string;
  caption?: string;
  createdAt: string;

  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };

  originalPost?: any;
}