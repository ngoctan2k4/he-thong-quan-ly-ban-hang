import { apiClient } from './client';
import type { ApiResponse } from '../types/api';
import type { AuthUser } from '../types/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
  return response.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<AuthUser>>('/users/me');
  return response.data.data;
}
