import { CircleDot } from '@shared/ui/icons';
import { ICON_BY_NAME } from '@shared/ui/icon-catalog';
import type { InviteRule } from '../api/use-invite';

/**
 * Renders one row of the reviewer's session rules. Mirrors the layout used
 * inside the desktop app's rules screen so the candidate sees the same thing
 * in both places.
 */
export const RuleRow = ({ rule }: { rule: InviteRule }) => {
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
