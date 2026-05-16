import { apiRequest } from './client';

export async function addPassengerToDraft(passengerId: number) {
  return apiRequest<{
    message: string;
    border_crossing_id?: number;
    count?: number;
  }>('/crossing-passengers', {
    method: 'POST',
    body: JSON.stringify({
      passenger_id: passengerId,
    }),
  });
}

export async function updateCrossingPassenger(
  borderCrossingId: number,
  passengerId: number,
  queueNumber: number,
  decision: string,
  isMain: boolean,
) {
  return apiRequest<{ message: string }>('/crossing-passengers', {
    method: 'PUT',
    body: JSON.stringify({
      border_crossing_id: borderCrossingId,
      passenger_id: passengerId,
      queue_number: queueNumber,
      decision,
      is_main: isMain,
    }),
  });
}

export async function allowPassenger(
  borderCrossingId: number,
  passengerId: number,
  queueNumber: number,
  isMain: boolean,
) {
  return updateCrossingPassenger(
    borderCrossingId,
    passengerId,
    queueNumber,
    'allowed',
    isMain,
  );
}

export async function denyPassenger(
  borderCrossingId: number,
  passengerId: number,
  queueNumber: number,
  isMain: boolean,
) {
  return updateCrossingPassenger(
    borderCrossingId,
    passengerId,
    queueNumber,
    'denied',
    isMain,
  );
}
