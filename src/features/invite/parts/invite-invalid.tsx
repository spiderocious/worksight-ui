import { ShieldAlert } from '@shared/ui/icons';

/**
 * Shown when the invite code can't be resolved (deleted candidate,
 * deactivated, regenerated code, etc). Soft messaging — we never reveal which
 * specific case it was.
 */
export const InviteInvalid = () => (
  <div className="min-h-screen bg-surface-subtle flex items-center justify-center px-6">
    <div className="max-w-md text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-6">
        <ShieldAlert size={28} />
      </div>
      <h1 className="font-display text-3xl tracking-tight">Invite link no longer valid</h1>
      <p className="text-sm text-ink-muted mt-3 leading-relaxed">
        This invite has expired or been replaced. Please contact your reviewer to get a
        fresh link.
      </p>
    </div>
  </div>
);
