import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';

export const useBlocklist = () =>
  useQuery({
    queryKey: ['public-blocklist'],
    queryFn: () => api<{ domains: string[]; updatedAt: string }>('/blocklist'),
    staleTime: 10 * 60 * 1000,
  });
