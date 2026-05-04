import { Badge } from '@shared/ui';
import { Clock, ChevronRight } from '@shared/ui/icons';

/**
 * Static fragment showing the candidate-side dashboard's "Pending" row, with
 * a hand-drawn arrow pointing at a faked tray title at the top-right of the
 * frame. Used in "How it works → step 2".
 */
export const StepCandidateMock = () => (
  <div className="relative">
    {/* Faked tray pill — sits in the top-right like a macOS menu-bar item */}
    <div className="absolute -top-6 right-2 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900 text-brand-50 text-[11px] font-mono shadow-soft">
      <span className="block w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
      1 pending
    </div>

    {/* Hand-drawn-feeling arrow from below pointing up at the pill */}
    <svg
      className="absolute -top-2 right-12 z-10 text-brand-700/70"
      width="46"
      height="40"
      viewBox="0 0 46 40"
      fill="none"
      aria-hidden
    >
      <path
        d="M 4 36 C 14 28, 22 20, 32 10 M 32 10 L 26 12 M 32 10 L 30 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>

    {/* The card itself */}
    <div className="ws-card p-5 motion-safe:rotate-[-0.4deg] border-dashed border-brand-200/60 hover:rotate-0 transition-transform">
      <p className="text-[11px] uppercase tracking-wider text-ink-soft mb-3">Pending</p>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-ink truncate">
            Backend take-home — Q3 batch
          </h4>
          <p className="text-sm text-ink-muted line-clamp-2 mt-1">
            Build a small Node service that ingests CSV uploads and exposes a paginated
            query endpoint…
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge tone="brand">
              <Clock size={11} /> 90 min
            </Badge>
            <Badge tone="neutral">link + text</Badge>
          </div>
        </div>
        <ChevronRight size={18} className="text-ink-soft shrink-0" />
      </div>
    </div>
  </div>
);
