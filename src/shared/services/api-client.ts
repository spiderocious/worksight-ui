const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'worksight.reviewer.token';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}
export interface ApiFailure {
  success: false;
  error: string;
  details?: unknown;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

interface RequestOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export const api = async <T>(path: string, opts: RequestOpts = {}): Promise<T> => {
  const token = tokenStore.get();
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });
  const text = await res.text();
  let json: ApiResponse<T> | null = null;
  if (text) {
    try {
      json = JSON.parse(text) as ApiResponse<T>;
    } catch {
      json = null;
    }
  }
  if (!res.ok || !json || json.success === false) {
    const msg = json && json.success === false ? json.error : `Request failed (${res.status})`;
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(msg, res.status, json && json.success === false ? json.details : undefined);
  }
  return json.data;
};

export const FILE_SERVICE_BASE = 'https://go-file-service-production.up.railway.app';
