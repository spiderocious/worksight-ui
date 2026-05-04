import { Badge } from '@shared/ui';
import { Clock, ChevronRight } from '@shared/ui/icons';

/**
 * Static fragment that mirrors the assignment-list card from the reviewer
 * dashboard. Used in the "How it works → step 1" section of the landing page.
 * Intentionally non-interactive.
 */
export const StepCreateMock = () => (
  <div className="ws-card p-5 motion-safe:rotate-[0.4deg] border-dashed border-brand-200/60 hover:rotate-0 transition-transform">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h4 className="text-base font-semibold text-ink truncate">
          Backend take-home — Q3 batch
        </h4>
        <p className="text-sm text-ink-muted line-clamp-2 mt-1">
          Build a small Node service that ingests CSV uploads and exposes a paginated
          query endpoint. We care more about your API design than the parser.
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
);
