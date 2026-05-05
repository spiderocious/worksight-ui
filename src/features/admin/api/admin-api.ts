// Admin-side API client. Same wire format as the reviewer client (it's the
// same backend), but with its own token store so the two sessions don't
// collide in the same browser.
//
// Re-exports `ApiError` from the shared client. Callers can do
// `instanceof ApiError` to detect things like the 409 from the bootstrap
// endpoint without importing from a different path than they got `adminApi`
// from.

import { createApiClient } from '@shared/services/api-client';
import { adminTokenStore } from './admin-token-store';

export { ApiError } from '@shared/services/api-client';

export const adminApi = createApiClient(adminTokenStore);
