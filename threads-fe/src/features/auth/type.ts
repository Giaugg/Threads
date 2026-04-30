// File: features/auth/types.ts

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}