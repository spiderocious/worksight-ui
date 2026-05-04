import { useState } from 'react';
import { Copy, Check, ExternalLink } from '@shared/ui/icons';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';

interface Props {
  accessCode: string;
}

/**
 * Displays the candidate's personalized invite URL with copy + open buttons.
 * Anchored on the access code, not a separate token — if the reviewer
 * regenerates the code, the old invite link breaks (intentional).
 */
export const InviteLinkDisplay = ({ accessCode }: Props) => {
  const url = `${window.location.origin}/candidate/invite/${accessCode}`;
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyToClipboard(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex items-center gap-3 ws-card p-4 bg-surface-subtle">
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-ink truncate select-all">{url}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 inline-flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-800 font-medium transition"
        title="Copy invite link"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition"
        title="Open invite preview"
      >
        <ExternalLink size={14} />
        Preview
      </a>
    </div>
  );
};
