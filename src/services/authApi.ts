import { apiRequest } from './httpClient';
import type { LoginResponse, SignupResponse, TokenResponse } from '@/types/api';

export function signup(
  email: string,
  password: string,
  username: string,
): Promise<SignupResponse> {
  return apiRequest<SignupResponse>('/user/signup/', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/user/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getToken(
  email: string,
  password: string,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>('/user/token/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function refreshToken(refresh: string): Promise<{ access: string }> {
  return apiRequest<{ access: string }>('/user/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  });
}
