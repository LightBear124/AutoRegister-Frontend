import { apiRequest } from './client';
import type { CartResponse, CrossingDetail } from '../types/api';

export async function getCartInfo() {
  return apiRequest<CartResponse>('/crossings/cart');
}

export async function getCrossingById(id: number) {
  return apiRequest<CrossingDetail>(`/crossings/${id}`);
}

export async function deleteCrossing(id: number) {
  return apiRequest<{ message: string }>(`/crossings/${id}`, {
    method: 'DELETE',
  });
}

export async function completeCrossing(id: number) {
  return apiRequest<{ message: string }>(`/crossings/${id}/complete`, {
    method: 'PUT',
  });
}

export async function rejectCrossing(id: number) {
  return apiRequest<{ message: string }>(`/crossings/${id}/reject`, {
    method: 'PUT',
  });
}
