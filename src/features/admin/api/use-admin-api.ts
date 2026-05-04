import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from './admin-api';

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
}

export interface AdminStats {
  reviewerCount: number;
  candidateCount: number;
  activeCandidateCount: number;
  assignmentInstanceCount: number;
  sessionCount: number;
  scoredSessionCount: number;
}

export interface AdminBootstrapResult {
  id: string;
  email: string;
  password: string;
}

export interface ReviewerListItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CandidateListItem {
  id: string;
  name: string;
  email: string;
  reviewerId: string;
  isActive: boolean;
  accessCode: string;
  createdAt: string;
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminDownloads {
  mac: {
    installCommand: string;
    installScriptUrl: string;
    releasesUrl: string;
    latestVersion: string;
    releasedAt: string;
  };
}

export interface AdminBlocklist {
  domains: string[];
  updatedAt: string;
}

// ----- mutations -----

export const useAdminBootstrap = () =>
  useMutation({
    mutationFn: () => adminApi<AdminBootstrapResult>('/admin/setup', { method: 'POST', noAuth: true }),
  });

export const useAdminLogin = () =>
  useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      adminApi<{ token: string; admin: Admin }>('/admin/login', {
        method: 'POST',
        body,
        noAuth: true,
      }),
  });

// ----- queries -----

export const useAdminMe = (enabled: boolean) =>
  useQuery({
    queryKey: ['admin-me'],
    queryFn: () => adminApi<Admin>('/admin/me'),
    enabled,
    retry: false,
  });

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi<AdminStats>('/admin/stats'),
  });

export const useAdminReviewers = (page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-reviewers', page, limit],
    queryFn: () => adminApi<PaginatedList<ReviewerListItem>>(`/admin/users/reviewers?page=${page}&limit=${limit}`),
  });

export const useAdminCandidates = (page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-candidates', page, limit],
    queryFn: () => adminApi<PaginatedList<CandidateListItem>>(`/admin/users/candidates?page=${page}&limit=${limit}`),
  });

export const useAdminDownloads = () =>
  useQuery({
    queryKey: ['admin-downloads'],
    queryFn: () => adminApi<AdminDownloads>('/admin/downloads'),
  });

export const useUpdateAdminDownloads = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<AdminDownloads['mac']>) =>
      adminApi<AdminDownloads>('/admin/downloads', { method: 'PATCH', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-downloads'] }),
  });
};

export const useAdminBlocklist = () =>
  useQuery({
    queryKey: ['admin-blocklist'],
    queryFn: () => adminApi<AdminBlocklist>('/admin/blocklist'),
  });

export const useUpdateAdminBlocklist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { domains: string[] }) =>
      adminApi<AdminBlocklist>('/admin/blocklist', { method: 'PATCH', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blocklist'] }),
  });
};
