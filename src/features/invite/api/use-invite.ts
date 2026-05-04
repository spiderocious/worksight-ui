import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';

export interface InviteRule {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  order: number;
}

export interface InvitePayload {
  candidate: { name: string; accessCode: string };
  reviewer: { name: string };
  install: {
    installCommand: string;
    installScriptUrl: string;
    releasesUrl: string;
    latestVersion: string;
    releasedAt: string;
  };
  rules: InviteRule[];
}

export const useInvite = (code: string | undefined) =>
  useQuery({
    queryKey: ['invite', code],
    queryFn: () => api<InvitePayload>(`/public/invite/${code}`),
    enabled: !!code && code.length === 10,
    retry: false,
  });
