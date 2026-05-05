import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';
import type { Assignment, AssignmentInstance, InstanceWithRelations, SubmissionType } from '@shared/types';

export const assignmentsKey = ['assignments'] as const;
export const assignmentKey = (id: string) => ['assignment', id] as const;
export const instancesKey = (filter?: Record<string, string | undefined>) =>
  ['instances', filter ?? {}] as const;

export const useAssignments = () =>
  useQuery({
    queryKey: assignmentsKey,
    queryFn: () => api<Assignment[]>('/assignments'),
  });

export const useAssignment = (id: string | undefined) =>
  useQuery({
    queryKey: assignmentKey(id ?? ''),
    queryFn: () => api<Assignment>(`/assignments/${id}`),
    enabled: !!id,
  });

export const useInstances = (filter: { candidateId?: string; status?: string } = {}) =>
  useQuery({
    queryKey: instancesKey(filter),
    queryFn: () => {
      const qs = new URLSearchParams();
      if (filter.candidateId) qs.set('candidateId', filter.candidateId);
      if (filter.status) qs.set('status', filter.status);
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return api<InstanceWithRelations[]>(`/assignment-instances${suffix}`);
    },
  });

interface CreateBody {
  title: string;
  brief: string;
  submissionType: SubmissionType;
  durationMinutes: number;
  hideUntilStart: boolean;
  mainTitle: string | null;
  mainBrief: string | null;
}

export const useCreateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBody) => api<Assignment>('/assignments', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: assignmentsKey }),
  });
};

export const useUpdateAssignment = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<CreateBody>) =>
      api<Assignment>(`/assignments/${id}`, { method: 'PATCH', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assignmentsKey });
      qc.invalidateQueries({ queryKey: assignmentKey(id) });
    },
  });
};

export const useDeleteAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/assignments/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: assignmentsKey }),
  });
};

export const useAssignToCandidate = (assignmentId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { candidateId: string; deadline?: string }) =>
      api<AssignmentInstance>(`/assignments/${assignmentId}/assign`, { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['instances'] });
      qc.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
};

export interface BulkAssignBody {
  assignments: Array<{ assignmentId: string; deadline?: string | null }>;
  candidateIds: string[];
}

export interface BulkAssignResult {
  created: number;
  skipped: number;
  instances: AssignmentInstance[];
}

export const useBulkAssign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: BulkAssignBody) =>
      api<BulkAssignResult>('/assignments/bulk-assign', { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['instances'] });
      qc.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
};
