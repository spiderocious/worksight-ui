// Admin-side API client: same wire format as the rest, but reads its token
// from a separate localStorage key so it doesn't collide with the reviewer
// session in the same browser.

import { adminTokenStore } from './admin-token-store';

const API_BASE =
  (import.meta.env.VITE_WORKSIGHT_API as string | undefined) ?? 'http://localhost:4000/api';

export class AdminApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  noAuth?: boolean;
}

export const adminApi = async <T>(path: string, opts: RequestOpts = {}): Promise<T> => {
  const token = !opts.noAuth ? adminTokenStore.get() : null;
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let json: { success: boolean; data?: T; error?: string; details?: unknown } | null = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }
  if (!res.ok || !json || json.success === false) {
    if (res.status === 401) adminTokenStore.clear();
    throw new AdminApiError(
      json && !json.success ? json.error ?? `Request failed (${res.status})` : `Request failed (${res.status})`,
      res.status,
      json?.details
    );
  }
  return json.data as T;
};
