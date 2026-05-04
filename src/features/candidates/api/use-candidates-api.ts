import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';
import type { Candidate, CandidateHistoryItem, CandidateWithCounts } from '@shared/types';

export const candidatesKey = ['candidates'] as const;
export const candidateKey = (id: string) => ['candidate', id] as const;
export const candidateHistoryKey = (id: string) => ['candidate-history', id] as const;

export const useCandidates = () =>
  useQuery({
    queryKey: candidatesKey,
    queryFn: () => api<CandidateWithCounts[]>('/candidates'),
  });

export const useCandidate = (id: string | undefined) =>
  useQuery({
    queryKey: candidateKey(id ?? ''),
    queryFn: () => api<Candidate>(`/candidates/${id}`),
    enabled: !!id,
  });

export const useCandidateHistory = (id: string | undefined) =>
  useQuery({
    queryKey: candidateHistoryKey(id ?? ''),
    queryFn: () => api<CandidateHistoryItem[]>(`/candidates/${id}/history`),
    enabled: !!id,
  });

export const useCreateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; email: string }) =>
      api<Candidate>('/candidates', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: candidatesKey }),
  });
};

export const useDeactivateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<Candidate>(`/candidates/${id}/deactivate`, { method: 'PATCH' }),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: candidatesKey });
      qc.invalidateQueries({ queryKey: candidateKey(id) });
    },
  });
};

export const useRegenerateCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<Candidate>(`/candidates/${id}/regenerate-code`, { method: 'POST' }),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: candidatesKey });
      qc.invalidateQueries({ queryKey: candidateKey(id) });
    },
  });
};
