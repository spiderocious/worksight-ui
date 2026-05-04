import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button, Card, CardHeader, Logo } from '@shared/ui';
import { Copy, Check, ShieldAlert, KeyRound } from '@shared/ui/icons';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';
import { useToast } from '@shared/hooks/use-toast';
import { useAdminBootstrap, type AdminBootstrapResult } from '../api/use-admin-api';
import { AdminApiError } from '../api/admin-api';

/**
 * One-shot admin setup. Calls POST /admin/setup; if 409 (already set up),
 * redirects to /admin/login. If 201, displays the generated email + password
 * with copy buttons and a "I've saved these" CTA that goes to login.
 *
 * The plain-text password is shown ONCE. There is no recovery.
 */
export const AdminSetupScreen = () => {
  const bootstrap = useAdminBootstrap();
  const { push } = useToast();
  const [creds, setCreds] = useState<AdminBootstrapResult | null>(null);
  const [tried, setTried] = useState(false);
  const [alreadySetup, setAlreadySetup] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const onCreate = async () => {
    setTried(true);
    try {
      const result = await bootstrap.mutateAsync();
      setCreds(result);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 409) {
        setAlreadySetup(true);
        return;
      }
      push(err instanceof Error ? err.message : 'Setup failed', 'error');
    }
  };

  const copy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  if (alreadySetup) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-surface-subtle flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Logo />
          <span className="block mt-2 text-[10px] uppercase tracking-[0.2em] text-brand-700 font-medium">
            Admin · one-time setup
          </span>
        </div>

        {!creds && !tried && (
          <Card>
            <CardHeader
              title="Create the admin account"
              subtitle="One-shot setup. Click the button to generate credentials. They'll be shown once and stored hashed in the database."
            />
            <div className="ws-card p-4 bg-amber-50 border-amber-200 text-sm text-amber-900 mb-4 flex gap-3">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-700" />
              <p>
                You will see the password exactly once. Copy it somewhere safe before
                continuing — we don't keep it in plain text and there is no reset.
              </p>
            </div>
            <Button onClick={onCreate} loading={bootstrap.isPending} className="w-full">
              Generate admin credentials
            </Button>
          </Card>
        )}

        {creds && (
          <Card>
            <CardHeader
              title="Save these credentials"
              subtitle="This is the only time you will see the password. Store it somewhere safe."
            />
            <div className="space-y-3">
              <CredRow
                label="Email"
                value={creds.email}
                onCopy={() => copy('email', creds.email)}
                copied={copiedKey === 'email'}
              />
              <CredRow
                label="Password"
                value={creds.password}
                onCopy={() => copy('password', creds.password)}
                copied={copiedKey === 'password'}
                mono
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Link to="/admin/login">
                <Button iconLeft={<KeyRound size={14} />}>I've saved them — sign in</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const CredRow = ({
  label,
  value,
  onCopy,
  copied,
  mono,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}) => (
  <div className="ws-card p-4 bg-surface-subtle">
    <p className="text-[11px] uppercase tracking-wider text-ink-soft mb-1">{label}</p>
    <div className="flex items-center justify-between gap-3">
      <code className={`flex-1 break-all ${mono ? 'font-mono text-base' : 'text-sm'} text-ink`}>
        {value}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 inline-flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-800 font-medium"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  </div>
);
