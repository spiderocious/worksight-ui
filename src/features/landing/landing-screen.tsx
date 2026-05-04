import { Link } from 'react-router-dom';
import { Logo, Button, Badge } from '@shared/ui';
import {
  ArrowRight,
  ShieldCheck,
  Camera,
  Hourglass,
  ClipboardCheck,
  Activity,
  Lock,
  Eye,
  ShieldAlert,
  CheckCircle2,
  X,
  Copy,
  Check,
} from '@shared/ui/icons';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';
import { useState } from 'react';
import { useDownloads } from './api/use-downloads';
import { useBlocklist } from './api/use-blocklist';

export const LandingScreen = () => {
  const { data: downloads } = useDownloads();
  const { data: blocklist } = useBlocklist();
  const [copied, setCopied] = useState(false);

  const onCopyBrew = async () => {
    if (!downloads?.mac.brewInstall) return;
    if (await copyToClipboard(downloads.mac.brewInstall)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Top nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-surface/80 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login" className="ws-link text-sm">
              Sign in
            </Link>
            <Link to="/signup">
              <Button size="sm" variant="primary" iconRight={<ArrowRight size={14} />}>
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-brand-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-300 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-20 lg:pt-32 pb-20 text-center">
          <Badge tone="brand" className="mb-6">
            <ShieldCheck size={11} /> Closed beta · macOS
          </Badge>
          <h1 className="font-display text-5xl lg:text-6xl tracking-tight leading-[1.05] text-ink">
            Take-homes you can <span className="italic text-brand-700">actually trust.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            WorkSight blocks AI tools at the OS level, captures timestamped screenshots, and gives you
            a clear evidence trail — so you can score the candidate, not the model.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            {downloads?.mac.url && (
              <a href={downloads.mac.url} target="_blank" rel="noreferrer">
                <Button size="lg" iconLeft={<Hourglass size={16} />}>
                  Download for Mac
                  {downloads.mac.version && (
                    <span className="ml-2 text-xs opacity-70 font-mono">v{downloads.mac.version}</span>
                  )}
                </Button>
              </a>
            )}
            <Link to="/signup">
              <Button size="lg" variant="secondary" iconRight={<ArrowRight size={14} />}>
                Sign up as a reviewer
              </Button>
            </Link>
          </div>

          {downloads?.mac.brewInstall && (
            <button
              type="button"
              onClick={onCopyBrew}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-ink-soft hover:text-ink bg-surface border border-line rounded-md px-3 py-1.5 transition"
            >
              <span>$ {downloads.mac.brewInstall}</span>
              {copied ? <Check size={12} className="text-brand-700" /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </section>

      {/* The problem */}
      <Section>
        <Eyebrow>The problem</Eyebrow>
        <H2>You can't tell whose work you're scoring.</H2>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Take-homes have no reliable way to distinguish independent work from AI-assisted work. Verbal
          warnings don't work. Code-pattern detectors are subjective. The candidate who knows they
          won't get caught has every incentive to outsource. <span className="text-ink">You end up
          scoring GPT — not them.</span>
        </p>
      </Section>

      {/* How it works */}
      <Section background="subtle">
        <Eyebrow>How it works</Eyebrow>
        <H2>Three steps. No new IDE.</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <Step
            number={1}
            title="Create the assessment"
            body="In the dashboard, write a brief and set a duration. WorkSight generates a 10-character access code for the candidate."
          />
          <Step
            number={2}
            title="Candidate runs the desktop app"
            body="They sign in with the code, read the rules, and start the timer. WorkSight blocks AI tools at the OS network level and captures random screenshots in the background."
          />
          <Step
            number={3}
            title="You scrub the evidence"
            body="When they submit, you see the timeline of screenshots, the metadata, and any abnormal-termination flags. Score with confidence."
          />
        </div>
      </Section>

      {/* Feature grid */}
      <Section>
        <Eyebrow>What WorkSight captures</Eyebrow>
        <H2>Real evidence, not vibes.</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <Feature
            icon={<Camera size={20} />}
            title="Random screenshots"
            body="Captured at intervals you control. Stored in object storage with presigned URLs — keys only on our servers."
          />
          <Feature
            icon={<Hourglass size={20} />}
            title="Server-side timer"
            body="The countdown runs on our servers. Closing or killing the app doesn't pause it. The session always ends on time."
          />
          <Feature
            icon={<ShieldAlert size={20} />}
            title="Force-quit detection"
            body="If the candidate kills the app, the next launch detects it and the session is flagged as abnormally terminated."
          />
          <Feature
            icon={<Lock size={20} />}
            title="OS-level blocking"
            body="ChatGPT, Claude, Gemini, Copilot, Stack Overflow and more — blocked via /etc/hosts and pf. Not just the browser."
          />
          <Feature
            icon={<ClipboardCheck size={20} />}
            title="Configurable rules"
            body="Customize the rules screen candidates must acknowledge before starting. Add your own, hide ours."
          />
          <Feature
            icon={<Activity size={20} />}
            title="Full audit trail"
            body="Start time, end time, duration, clean vs. dirty termination, and every screenshot — all in one view."
          />
        </div>
      </Section>

      {/* What it blocks */}
      {blocklist && (
        <Section background="subtle">
          <Eyebrow>The blocklist</Eyebrow>
          <H2>Out of the box.</H2>
          <p className="text-base text-ink-muted max-w-2xl">
            On session start, WorkSight blocks these domains at the OS level. Maintained centrally so
            it stays current without shipping new app versions.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            {blocklist.domains.map((d) => (
              <span
                key={d}
                className="font-mono text-xs px-3 py-1.5 rounded-md bg-surface border border-line text-ink-muted"
              >
                {d}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Trust signal */}
      <Section>
        <Eyebrow>Equally important</Eyebrow>
        <H2>What WorkSight deliberately does not do.</H2>
        <p className="text-base text-ink-muted max-w-2xl">
          We're a warden. The list below is non-negotiable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          <NotDoing label="No webcam or microphone access" />
          <NotDoing label="No keystroke logging" />
          <NotDoing label="No AI-detection guesswork on submissions" />
          <NotDoing label="No data sold or shared with third parties" />
          <NotDoing label="No persistent surveillance outside an active session" />
          <NotDoing label="No browser extension or IDE plugin to install" />
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-brand-900 text-brand-50 mt-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-700 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-brand-500 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-white">
            Ready to score real work?
          </h2>
          <p className="mt-4 text-brand-200 max-w-xl mx-auto">
            WorkSight is in closed beta. Sign up free, onboard your first candidate in under five
            minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" iconRight={<ArrowRight size={14} />}>
                Create reviewer account
              </Button>
            </Link>
            {downloads?.mac.url && (
              <a href={downloads.mac.url} target="_blank" rel="noreferrer">
                <Button size="lg" variant="soft">
                  Get the candidate app
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-surface border-t border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
          <Logo size={20} />
          <p>© WorkSight · macOS-only closed beta</p>
        </div>
      </footer>
    </div>
  );
};

const Section = ({
  children,
  background = 'default',
}: {
  children: React.ReactNode;
  background?: 'default' | 'subtle';
}) => (
  <section className={background === 'subtle' ? 'bg-surface' : ''}>
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">{children}</div>
  </section>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs uppercase tracking-[0.18em] text-brand-700 font-medium mb-3">{children}</p>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-ink mb-4 leading-[1.15]">
    {children}
  </h2>
);

const Step = ({ number, title, body }: { number: number; title: string; body: string }) => (
  <div className="ws-card p-6">
    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-800 flex items-center justify-center font-display text-lg font-medium">
      {number}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
    <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
  </div>
);

const Feature = ({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) => (
  <div className="ws-card p-5">
    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-sm font-semibold text-ink">{title}</h3>
    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{body}</p>
  </div>
);

const NotDoing = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 ws-card p-4">
    <span className="shrink-0 w-7 h-7 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
      <X size={14} />
    </span>
    <span className="text-sm text-ink">{label}</span>
  </div>
);

// Suppress unused-import warnings for icons we reserved for future use without breaking layout.
void [Eye, CheckCircle2];
