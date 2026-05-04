import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';

export interface DownloadsPayload {
  mac: {
    installCommand: string;
    installScriptUrl: string;
    releasesUrl: string;
    latestVersion: string;
    releasedAt: string;
  };
}

export const useDownloads = () =>
  useQuery({
    queryKey: ['public-downloads'],
    queryFn: () => api<DownloadsPayload>('/public/downloads'),
    staleTime: 5 * 60 * 1000,
  });
