// Thin shared HTTP client. The same wire format (`{ success, data, error }`)
// is used by every backend endpoint, so every part of the app talks to it
// the same way.
//
// Two flavors of "the same thing":
//   - The default `api()` + `tokenStore` use a "reviewer" localStorage key.
//   - The factory `createApiClient(tokenStore)` lets the admin feature pass
//     in its own token store so admin and reviewer sessions don't clobber
//     each other in the same browser.
//
// Anything else (URL, headers, error mapping, 401 handling) is identical.

const API_BASE =
  (import.meta.env.VITE_WORKSIGHT_API as string | undefined) ??
  'http://localhost:4000/api';

export const FILE_SERVICE_BASE =
  (import.meta.env.VITE_FILE_SERVICE_BASE as string | undefined) ??
  'https://go-file-service-production.up.railway.app';

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

// ----- Token stores -----
//
// A "token store" is just a tiny shape that knows how to read/write/clear a
// token in localStorage. Different parts of the app use different keys so
// they don't collide.

export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
}

export const createTokenStore = (key: string): TokenStore => ({
  get: () => localStorage.getItem(key),
  set: (token) => localStorage.setItem(key, token),
  clear: () => localStorage.removeItem(key),
});

// Default reviewer-side token store. Backwards-compatible export — anything
// that previously imported `tokenStore` keeps working.
export const tokenStore: TokenStore = createTokenStore('worksight.reviewer.token');

// ----- The actual client -----

export interface RequestOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  // When true, skip attaching the Authorization header even if a token exists.
  // Used for setup/login routes that the user doesn't have a token for yet.
  noAuth?: boolean;
}

/**
 * Build an `api` function that hits the WorkSight backend using the given
 * token store. The default `api` export below uses the reviewer store; the
 * admin feature builds its own with `createApiClient(adminTokenStore)`.
 */
export const createApiClient = (store: TokenStore) => {
  return async <T>(path: string, opts: RequestOpts = {}): Promise<T> => {
    const token = !opts.noAuth ? store.get() : null;
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
      const msg =
        json && json.success === false ? json.error : `Request failed (${res.status})`;
      // 401 → clear THIS client's token store (not all of them). The reviewer
      // and admin sessions are independent.
      if (res.status === 401) store.clear();
      throw new ApiError(
        msg,
        res.status,
        json && json.success === false ? json.details : undefined
      );
    }
    return json.data;
  };
};

// Default reviewer client.
export const api = createApiClient(tokenStore);
