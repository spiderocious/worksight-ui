import type { ReactNode } from 'react';

/**
 * One numbered step on the invite page. Used for "01 Install", "02 Sign in",
 * "03 Start your session". Body content is whatever the caller passes in.
 */
export const Step = ({
  number,
  title,
  subtitle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  children: ReactNode;
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
