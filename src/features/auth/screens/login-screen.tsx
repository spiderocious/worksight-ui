import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useAuth } from '@shared/hooks/use-auth';
import { AuthFrame } from '../parts/auth-frame';
import { useLogin } from '../api/use-auth-api';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { push } = useToast();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login.mutateAsync({ email, password });
      signIn(data.token, data.reviewer);
      navigate('/candidates');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Sign-in failed', 'error');
    }
  };

  return (
    <AuthFrame
      title="Welcome back"
      subtitle="Sign in to review your candidates."
      footer={
        <>
          New to WorkSight?{' '}
          <Link to="/signup" className="ws-link font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Button type="submit" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>
    </AuthFrame>
  );
};
