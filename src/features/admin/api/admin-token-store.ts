// Stored separately from the reviewer token so an admin signed in to the
// same browser doesn't trample the reviewer session, and vice versa.

import { createTokenStore } from '@shared/services/api-client';

export const adminTokenStore = createTokenStore('worksight.admin.token');
