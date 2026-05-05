import { useState } from 'react';
import { ChevronDown, ChevronRight } from '@shared/ui/icons';

/**
 * Collapsible "Trouble installing?" block under the install command.
 * Static text, only the open/close state is interactive.
 */
export const Troubleshooting = ({ installScriptUrl }: { installScriptUrl: string }) => {
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
          <Section title='"Where do I open Terminal?"'>
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-subtle text-xs">
              ⌘
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-subtle text-xs">
              Space
            </kbd>
            , type <span className="font-mono text-ink">Terminal</span>, hit Enter. Paste
            the command above and press Enter.
          </Section>

          <Section title={`"macOS says 'unidentified developer'"`}>
            The install command handles that automatically — it strips the security flag
            macOS sets on internet downloads. If you skipped the command and dragged the
            app manually, run this in Terminal:
            <pre className="mt-2 ws-card p-3 bg-ink text-brand-50 font-mono text-[11px] overflow-x-auto">
              xattr -dr com.apple.quarantine /Applications/WorkSight.app
            </pre>
          </Section>

          <Section title='"Is this safe to paste?"'>
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
          </Section>

          <Section title={`"I'm on Windows or Linux"`}>
            WorkSight is macOS-only for now. Get back to your reviewer — they may be
            able to send you a Mac to use, or shift to a different format.
          </Section>
        </div>
      )}
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <p className="font-medium text-ink mb-1">{title}</p>
    <div>{children}</div>
  </div>
);
