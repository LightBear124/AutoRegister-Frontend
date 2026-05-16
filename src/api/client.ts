const API_BASE_URL = 'http://localhost:8080/api';

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

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = (await response.json()) as { error?: string };
      if (errorData.error) {
        message = errorData.error;
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}
