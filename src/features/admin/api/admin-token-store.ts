// Stored separately from the reviewer token so an admin signed-in in the same
// browser doesn't trample the reviewer session and vice versa.

const KEY = 'worksight.admin.token';

export const adminTokenStore = {
  get(): string | null {
    return localStorage.getItem(KEY);
  },
  set(token: string): void {
    localStorage.setItem(KEY, token);
  },
  clear(): void {
    localStorage.removeItem(KEY);
  },
};
