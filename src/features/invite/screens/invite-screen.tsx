import { useParams } from 'react-router-dom';
import { Logo, PageLoader } from '@shared/ui';
import { useInvite } from '../api/use-invite';
import { useCopy } from '../parts/use-copy';
import { InviteGreeting } from '../parts/invite-greeting';
import { InstallStep } from '../parts/install-step';
import { AccessCodeStep } from '../parts/access-code-step';
import { RulesStep } from '../parts/rules-step';
import { InviteInvalid } from '../parts/invite-invalid';

/**
 * The candidate's entry point — public, accessed by clicking a link from
 * their reviewer. Resolves the access code on the backend and presents the
 * three steps: install the app, sign in, start the session.
 *
 * All section components live in `parts/`. This file is just the layout +
 * data plumbing.
 */
export const InviteScreen = () => {
  const { code = '' } = useParams<{ code: string }>();
  const upperCode = code.toUpperCase();
  const { data, isLoading, isError } = useInvite(upperCode);
  const { copiedKey, copy } = useCopy();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-subtle">
        <PageLoader />
      </div>
    );
  }

  if (isError || !data) {
    return <InviteInvalid />;
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b border-line bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 h-16 flex items-center">
          <Logo />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <InviteGreeting
          candidateName={data.candidate.name}
          reviewerName={data.reviewer.name}
        />

        <InstallStep
          installCommand={data.install.installCommand}
          installScriptUrl={data.install.installScriptUrl}
          copiedKey={copiedKey}
          onCopy={copy}
        />

        <AccessCodeStep
          accessCode={data.candidate.accessCode}
          copiedKey={copiedKey}
          onCopy={copy}
        />

        <RulesStep rules={data.rules} />

        <footer className="pt-8 border-t border-line text-sm text-ink-soft">
          <p>
            Questions? Reply directly to the invite from{' '}
            <span className="text-ink-muted">{data.reviewer.name}</span>.
          </p>
        </footer>
      </main>
    </div>
  );
};
