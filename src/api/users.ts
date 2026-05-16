import { apiRequest } from './client';
import type { LoginResponse } from '../types/api';

export async function loginUser(login: string, password: string) {
  return apiRequest<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export async function logoutUser() {
  return apiRequest<{ message: string }>('/users/logout', {
    method: 'POST',
  });
}
