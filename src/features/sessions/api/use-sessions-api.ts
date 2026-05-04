import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, FILE_SERVICE_BASE } from '@shared/services/api-client';
import type { Score, SessionDetail } from '@shared/types';

export const sessionKey = (id: string) => ['session', id] as const;
export const scoreKey = (sessionId: string) => ['session-score', sessionId] as const;
export const screenshotUriKey = (key: string) => ['screenshot-uri', key] as const;

export const useSession = (id: string | undefined) =>
  useQuery({
    queryKey: sessionKey(id ?? ''),
    queryFn: () => api<SessionDetail>(`/sessions/${id}`),
    enabled: !!id,
  });

export const useSessionScore = (sessionId: string | undefined) =>
  useQuery({
    queryKey: scoreKey(sessionId ?? ''),
    queryFn: () => api<Score | null>(`/sessions/${sessionId}/score`),
    enabled: !!sessionId,
  });

export const useUpsertScore = (sessionId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { numericScore: number; feedback: string }) =>
      api<Score>(`/sessions/${sessionId}/score`, { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: scoreKey(sessionId) });
      qc.invalidateQueries({ queryKey: sessionKey(sessionId) });
    },
  });
};

interface FileUriResponse {
  cached: boolean;
  expires_in: string;
  uri: string;
}

export const useScreenshotUri = (key: string | undefined) =>
  useQuery({
    queryKey: screenshotUriKey(key ?? ''),
    queryFn: async () => {
      const res = await fetch(`${FILE_SERVICE_BASE}/get-file-uri?key=${encodeURIComponent(key ?? '')}`);
      if (!res.ok) throw new Error(`File service returned ${res.status}`);
      return (await res.json()) as FileUriResponse;
    },
    enabled: !!key,
    staleTime: 50 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
