import type { ReactNode } from 'react';
import { Logo } from '@shared/ui';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthFrame = ({ title, subtitle, children, footer }: Props) => (
  <div className="min-h-screen flex">
    <div className="flex-1 hidden lg:flex flex-col justify-between bg-brand-900 text-brand-50 p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-700 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-brand-500 rounded-full blur-3xl opacity-50" />
      </div>
      <div className="relative bg-white w-max p-1">
        <span className="font-display text-[1.05rem] font-medium tracking-tight text-ink">
        Work<span className="text-brand-700">Sight</span>
      </span>
      </div>
      <div className="relative max-w-md">
        <p className="font-display text-3xl leading-tight tracking-tight text-brand-50">
          Trustworthy take-homes.
          <br />
          <span className="text-brand-200 italic">Score the candidate, not the model.</span>
        </p>
        <p className="mt-6 text-brand-200 text-sm leading-relaxed">
          Block AI tools at the OS level, capture timestamped screenshots, and get a clear
          evidence trail for every coding session.
        </p>
      </div>
      <div className="relative text-xs text-brand-300/70">© WorkSight</div>
    </div>
    <div className="flex-1 flex items-center justify-center bg-surface-subtle p-6">
      <div className="w-full max-w-md">
        <div className="lg:hidden mb-8">
          <Logo />
        </div>
        <h1 className="font-display text-3xl text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-2">{subtitle}</p>}
        <div className="mt-8 space-y-4">{children}</div>
        {footer && <div className="mt-6 text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  </div>
);
