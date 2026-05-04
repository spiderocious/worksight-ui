import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';

export interface SessionRule {
  id: string;
  reviewerId: string;
  icon: string;
  title: string;
  subtitle: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewerSettings {
  id: string;
  reviewerId: string;
  postSubmissionTitle: string;
  postSubmissionDescription: string;
  showScreenshotWarning: boolean;
  screenshotIntervalSeconds: { min: number; max: number };
  createdAt: string;
  updatedAt: string;
}

export const settingsKey = ['reviewer-settings'] as const;
export const rulesKey = ['session-rules'] as const;

export const useReviewerSettings = () =>
  useQuery({
    queryKey: settingsKey,
    queryFn: () => api<ReviewerSettings>('/reviewers/me/settings'),
  });

export const useUpdateReviewerSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<{
      postSubmissionTitle: string;
      postSubmissionDescription: string;
      showScreenshotWarning: boolean;
      screenshotIntervalSeconds: { min: number; max: number };
    }>) => api<ReviewerSettings>('/reviewers/me/settings', { method: 'PATCH', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKey }),
  });
};

export const useSessionRules = () =>
  useQuery({
    queryKey: rulesKey,
    queryFn: () => api<SessionRule[]>('/reviewers/me/rules'),
  });

export const useCreateRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      icon: string;
      title: string;
      subtitle: string;
      active?: boolean;
      order?: number;
    }) => api<SessionRule>('/reviewers/me/rules', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: rulesKey }),
  });
};

export const useUpdateRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<{
        icon: string;
        title: string;
        subtitle: string;
        active: boolean;
        order: number;
      }>;
    }) => api<SessionRule>(`/reviewers/me/rules/${id}`, { method: 'PATCH', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: rulesKey }),
  });
};

export const useDeleteRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/reviewers/me/rules/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: rulesKey }),
  });
};
