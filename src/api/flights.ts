import { apiRequest } from './client';
import type { FlightDetail, FlightListItem } from '../types/api';

export async function getFlights() {
  return apiRequest<FlightListItem[]>('/flights');
}

export async function getFlightById(id: number) {
  return apiRequest<FlightDetail>(`/flights/${id}`);
}
