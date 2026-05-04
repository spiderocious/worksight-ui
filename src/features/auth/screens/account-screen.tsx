import { useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, Input } from '@shared/ui';
import { useAuth } from '@shared/hooks/use-auth';
import { useToast } from '@shared/hooks/use-toast';
import { useUpdatePassword, useUpdateProfile } from '../api/use-auth-api';

export const AccountScreen = () => {
  const { reviewer, refresh } = useAuth();
  const { push } = useToast();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const [name, setName] = useState(reviewer?.name ?? '');
  const [email, setEmail] = useState(reviewer?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name, email });
      await refresh();
      push('Profile updated', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      push('Password updated', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not change password', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Account</h1>
        <p className="text-sm text-ink-muted mt-1">Manage your reviewer profile.</p>
      </header>

      <Card>
        <CardHeader title="Profile" subtitle="Your name and email." />
        <form onSubmit={onSaveProfile} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="flex justify-end">
            <Button type="submit" loading={updateProfile.isPending}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Password" subtitle="Update your sign-in password." />
        <form onSubmit={onChangePassword} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={updatePassword.isPending}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
