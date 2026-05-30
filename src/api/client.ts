const API_BASE_URL = 'http://localhost:8080/api';

type ApiEnvelope<T> = {
  success: boolean;
  status_code: number;
  message?: string;
  data?: T;
  error?: string;
};

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let result: ApiEnvelope<T>;

  try {
    result = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error(`Ошибка ответа сервера. Код: ${response.status}`);
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || `Ошибка запроса. Код: ${result.status_code || response.status}`,
    );
  }

  return result.data as T;
}