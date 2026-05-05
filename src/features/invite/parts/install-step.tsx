import { Copy, Check } from '@shared/ui/icons';
import { Step } from './step';
import { Troubleshooting } from './troubleshooting';

interface Props {
  installCommand: string;
  installScriptUrl: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}

export const InstallStep = ({ installCommand, installScriptUrl, copiedKey, onCopy }: Props) => (
  <Step
    number={1}
    title="Install the WorkSight app"
    subtitle="Copy this command into Terminal on your Mac and press Enter. You only need to do this once."
  >
    <div className="ws-card p-4 bg-ink text-brand-50 font-mono text-xs overflow-x-auto">
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-brand-300 select-none">$</span>
        <code className="flex-1 break-all whitespace-pre-wrap leading-relaxed">
          {installCommand}
        </code>
        <button
          type="button"
          onClick={() => onCopy('install', installCommand)}
          className="shrink-0 text-brand-200 hover:text-brand-50 transition"
          title="Copy"
        >
          {copiedKey === 'install' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>

    <Troubleshooting installScriptUrl={installScriptUrl} />
  </Step>
);
