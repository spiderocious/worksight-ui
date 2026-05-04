import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useAuth } from '@shared/hooks/use-auth';
import { AuthFrame } from '../parts/auth-frame';
import { useSignup } from '../api/use-auth-api';

export const SignupScreen = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { push } = useToast();
  const signup = useSignup();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup.mutateAsync({ name, email, password });
      signIn(data.token, data.reviewer);
      push('Welcome to WorkSight', 'success');
      navigate('/app/candidates');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Sign-up failed', 'error');
    }
  };

  return (
    <AuthFrame
      title="Create your account"
      subtitle="Start running monitored take-home assessments."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="ws-link font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Your name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
        />
        <Button type="submit" className="w-full" loading={signup.isPending}>
          Create account
        </Button>
      </form>
    </AuthFrame>
  );
};
