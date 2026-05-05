import { Copy, Check, KeyRound } from '@shared/ui/icons';
import { Step } from './step';

interface Props {
  accessCode: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}

export const AccessCodeStep = ({ accessCode, copiedKey, onCopy }: Props) => (
  <Step
    number={2}
    title="Sign in with your access code"
    subtitle="When the app launches, paste this code into the access-code field."
  >
    <button
      type="button"
      onClick={() => onCopy('code', accessCode)}
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
            {accessCode}
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
      Keep this code somewhere safe. You'll need it again if you ever sign out of the app.
    </p>
  </Step>
);
