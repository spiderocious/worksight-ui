import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, Input, Logo } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useAdminLogin } from '../api/use-admin-api';
import { adminTokenStore } from '../api/admin-token-store';

export const AdminLoginScreen = () => {
  const navigate = useNavigate();
  const login = useAdminLogin();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login.mutateAsync({ email, password });
      adminTokenStore.set(data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Sign-in failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Logo />
          <span className="block mt-2 text-[10px] uppercase tracking-[0.2em] text-brand-700 font-medium">
            Admin sign-in
          </span>
        </div>
        <Card>
          <CardHeader title="Sign in" subtitle="Use the credentials generated during setup." />
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Button type="submit" className="w-full" loading={login.isPending}>
              Sign in
            </Button>
          </form>
          <p className="text-xs text-ink-soft mt-6 text-center">
            First time here?{' '}
            <Link to="/admin/setup" className="ws-link">
              Run setup
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
};
