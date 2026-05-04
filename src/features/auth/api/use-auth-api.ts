import { useMutation } from '@tanstack/react-query';
import { api } from '@shared/services/api-client';
import type { Reviewer } from '@shared/types';

interface AuthResponse {
  token: string;
  reviewer: Reviewer;
}

export const useSignup = () =>
  useMutation({
    mutationFn: async (body: { name: string; email: string; password: string }) =>
      api<AuthResponse>('/reviewers/signup', { method: 'POST', body }),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      api<AuthResponse>('/reviewers/login', { method: 'POST', body }),
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (body: { name?: string; email?: string }) =>
      api<Reviewer>('/reviewers/me', { method: 'PATCH', body }),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: async (body: { currentPassword: string; newPassword: string }) =>
      api<{ ok: true }>('/reviewers/me/password', { method: 'PATCH', body }),
  });
