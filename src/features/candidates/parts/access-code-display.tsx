import { useState } from 'react';
import { Copy, Check } from '@shared/ui/icons';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';

export const AccessCodeDisplay = ({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const sizing =
    size === 'lg'
      ? 'text-2xl tracking-[0.3em] py-3 px-5'
      : size === 'sm'
        ? 'text-xs tracking-[0.2em] py-1 px-2'
        : 'text-sm tracking-[0.25em] py-1.5 px-3';
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 font-mono font-medium bg-brand-50 text-brand-900 border border-brand-200 rounded-lg hover:bg-brand-100 transition ${sizing}`}
      title="Copy access code"
    >
      <span>{code}</span>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};
