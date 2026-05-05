import { Step } from './step';
import { RuleRow } from './rule-row';
import type { InviteRule } from '../api/use-invite';

/**
 * The rules the candidate will be asked to acknowledge after starting the
 * session inside the desktop app. Surfaced here on the invite page so the
 * candidate sees the same list ahead of time. Driven by the reviewer's
 * Settings → Rules configuration — single source of truth.
 */
export const RulesStep = ({ rules }: { rules: InviteRule[] }) => (
  <Step
    number={3}
    title="Start your session"
    subtitle="Before the timer starts, the app will ask you to acknowledge each rule below. Read them now so nothing surprises you."
  >
    {rules.length === 0 ? (
      <div className="ws-card p-5 text-sm text-ink-muted">
        Your reviewer hasn't configured any session rules yet. The app will tell you what
        to expect when you open it.
      </div>
    ) : (
      <div className="ws-card p-5 divide-y divide-line">
        {rules.map((rule) => (
          <RuleRow key={rule.id} rule={rule} />
        ))}
      </div>
    )}
  </Step>
);
