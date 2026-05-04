import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';

export interface DownloadsPayload {
  mac: {
    url: string;
    version: string;
    releasedAt: string;
    brewInstall: string;
  };
}

export const useDownloads = () =>
  useQuery({
    queryKey: ['public-downloads'],
    queryFn: () => api<DownloadsPayload>('/public/downloads'),
    staleTime: 5 * 60 * 1000,
  });
