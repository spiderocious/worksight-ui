import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logo, PageLoader } from '@shared/ui';
import {
  ShieldAlert,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  KeyRound,
  CircleDot,
} from '@shared/ui/icons';
import { ICON_BY_NAME } from '@shared/ui/icon-catalog';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';
import { useInvite, type InviteRule } from '../api/use-invite';

const useCopy = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };
  return { copiedKey, copy };
};

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
    return <InviteInvalidScreen />;
  }

  const firstName = data.candidate.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b border-line bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 h-16 flex items-center">
          <Logo />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        {/* Greeting */}
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-brand-700 font-medium mb-3">
            Personal invite
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-[1.1] text-ink">
            Hi {firstName}, welcome to WorkSight.
          </h1>
          <p className="text-base text-ink-muted mt-4 leading-relaxed max-w-xl">
            Your reviewer{' '}
            <span className="text-ink font-medium">{data.reviewer.name}</span> has
            invited you to complete a take-home assessment. Follow the three steps below
            to install the app, sign in, and start your session.
          </p>
        </section>

        {/* Step 1 — install */}
        <Step
          number={1}
          title="Install the WorkSight app"
          subtitle="Copy this command into Terminal on your Mac and press Enter. You only need to do this once."
        >
          <div className="ws-card p-4 bg-ink text-brand-50 font-mono text-xs overflow-x-auto">
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-brand-300 select-none">$</span>
              <code className="flex-1 break-all whitespace-pre-wrap leading-relaxed">
                {data.install.installCommand}
              </code>
              <button
                type="button"
                onClick={() => copy('install', data.install.installCommand)}
                className="shrink-0 text-brand-200 hover:text-brand-50 transition"
                title="Copy"
              >
                {copiedKey === 'install' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <Troubleshooting installScriptUrl={data.install.installScriptUrl} />
        </Step>

        {/* Step 2 — sign in */}
        <Step
          number={2}
          title="Sign in with your access code"
          subtitle="When the app launches, paste this code into the access-code field."
        >
          <button
            type="button"
            onClick={() => copy('code', data.candidate.accessCode)}
            className="w-full ws-card p-6 flex items-center justify-between gap-4 hover:shadow-lift transition"
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                <KeyRound size={18} />
              </span>
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-wider text-ink-soft">
                  Your access code
                </p>
                <p className="font-mono text-2xl tracking-[0.4em] font-medium text-ink mt-1">
                  {data.candidate.accessCode}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium">
              {copiedKey === 'code' ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </span>
          </button>
          <p className="text-xs text-ink-soft mt-3">
            Keep this code somewhere safe. You'll need it again if you ever sign out of
            the app.
          </p>
        </Step>

        {/* Step 3 — what to expect. Rules come from the reviewer's settings,
            so the candidate sees exactly the same list they'll be asked to
            acknowledge inside the desktop app. */}
        <Step
          number={3}
          title="Start your session"
          subtitle="Before the timer starts, the app will ask you to acknowledge each rule below. Read them now so nothing surprises you."
        >
          {data.rules.length === 0 ? (
            <div className="ws-card p-5 text-sm text-ink-muted">
              Your reviewer hasn't configured any session rules yet. The app will tell
              you what to expect when you open it.
            </div>
          ) : (
            <div className="ws-card p-5 divide-y divide-line">
              {data.rules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} />
              ))}
            </div>
          )}
        </Step>

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

const Step = ({
  number,
  title,
  subtitle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-baseline gap-3 mb-4">
      <span className="font-mono text-sm text-brand-700 font-medium">{`0${number}`}</span>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
    </div>
    <p className="text-sm text-ink-muted leading-relaxed mb-4 max-w-xl">{subtitle}</p>
    <div>{children}</div>
  </section>
);

const RuleRow = ({ rule }: { rule: InviteRule }) => {
  const Icon = ICON_BY_NAME[rule.icon] ?? CircleDot;
  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <span className="shrink-0 w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center mt-0.5">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{rule.title}</p>
        <p className="text-sm text-ink-muted leading-relaxed mt-0.5">{rule.subtitle}</p>
      </div>
    </div>
  );
};

const Troubleshooting = ({ installScriptUrl }: { installScriptUrl: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Trouble installing?
      </button>
      {open && (
        <div className="mt-3 ws-card p-5 text-sm text-ink-muted leading-relaxed space-y-3">
          <div>
            <p className="font-medium text-ink mb-1">"Where do I open Terminal?"</p>
            <p>
              Press <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-subtle text-xs">⌘</kbd>{' '}
              + <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-subtle text-xs">Space</kbd>,
              type <span className="font-mono text-ink">Terminal</span>, hit Enter. Paste the
              command above and press Enter.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink mb-1">"macOS says 'unidentified developer'"</p>
            <p>
              The install command handles that automatically — it strips the security
              flag macOS sets on internet downloads. If you skipped the command and dragged
              the app manually, run this in Terminal:
            </p>
            <pre className="mt-2 ws-card p-3 bg-ink text-brand-50 font-mono text-[11px] overflow-x-auto">
              xattr -dr com.apple.quarantine /Applications/WorkSight.app
            </pre>
          </div>
          <div>
            <p className="font-medium text-ink mb-1">"Is this safe to paste?"</p>
            <p>
              Fair question. The script just downloads the app from GitHub Releases and
              moves it into <span className="font-mono text-ink">/Applications</span>.{' '}
              <a
                href={installScriptUrl}
                target="_blank"
                rel="noreferrer"
                className="ws-link"
              >
                Read the source
              </a>{' '}
              before running it if you'd like.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink mb-1">"I'm on Windows or Linux"</p>
            <p>
              WorkSight is macOS-only for now. Get back to your reviewer — they may be
              able to send you a Mac to use, or shift to a different format.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const InviteInvalidScreen = () => (
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
