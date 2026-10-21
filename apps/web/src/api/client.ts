import type { ApiErrorResponse } from '@tasklane/shared';

/** An error response from the API, in the shared `{ error: { code, message } }` format. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** The user picked in the user menu. Required by endpoints that create something. */
  userId?: number;
}

export async function apiRequest<T>(path: string, { method = 'GET', body, userId }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['content-type'] = 'application/json';
  }
  if (userId !== undefined) {
    headers['x-user-id'] = String(userId);
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    throw new ApiError(
      response.status,
      payload?.error.code ?? 'UNKNOWN_ERROR',
      payload?.error.message ?? `Request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as T;
}
