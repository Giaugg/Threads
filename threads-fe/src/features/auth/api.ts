// File: features/auth/api.ts

import api from "../../core/api/api";
import { type LoginDto, type RegisterDto, type AuthResponse, type User } from "./type";

export const loginAPI = (data: LoginDto) =>
  api.post<AuthResponse>("/auth/login", data);

export const registerAPI = (data: RegisterDto) =>
  api.post<AuthResponse>("/auth/register", data);

export const meAPI = () => api.get<User>("/auth/me");