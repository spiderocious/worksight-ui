import { Camera, Hourglass, ShieldCheck } from '@shared/ui/icons';

/**
 * Faked reviewer-side session detail mock. Three placeholder screenshot
 * thumbnails (gradient blocks — no real images) under a scrubber slider whose
 * thumb auto-animates left↔right via the `ws-scrub` keyframe in index.css.
 */
export const StepScrubMock = () => (
  <div className="ws-card p-5 motion-safe:rotate-[0.4deg] border-dashed border-brand-200/60 hover:rotate-0 transition-transform">
    {/* Mini metadata row */}
    <div className="flex items-center gap-3 mb-4 text-[11px] text-ink-muted">
      <span className="inline-flex items-center gap-1">
        <Hourglass size={11} /> 47:12 / 90:00
      </span>
      <span className="inline-flex items-center gap-1">
        <Camera size={11} /> 18 captures
      </span>
      <span className="inline-flex items-center gap-1 ml-auto px-1.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
        <ShieldCheck size={10} /> CLEAN
      </span>
    </div>

    {/* Three thumbnails — gradient placeholders */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="aspect-video rounded-md bg-gradient-to-br from-brand-200 via-brand-100 to-brand-50 border border-brand-200/60" />
      <div className="aspect-video rounded-md bg-gradient-to-br from-brand-300 via-brand-200 to-brand-100 border border-brand-200/60 ring-2 ring-brand-500/40" />
      <div className="aspect-video rounded-md bg-gradient-to-br from-brand-100 via-brand-50 to-surface-subtle border border-brand-200/60" />
    </div>

    {/* Scrubber track + animated thumb */}
    <div className="relative h-1.5 rounded-full bg-line">
      <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-brand-500/40" />
      <div
        className="absolute top-1/2 -mt-2 -ml-2 h-4 w-4 rounded-full bg-brand-700 shadow-soft motion-safe:animate-[ws-scrub_4s_ease-in-out_infinite]"
        style={{ left: '50%' }}
      />
    </div>

    <div className="mt-3 flex items-center justify-between text-[10px] text-ink-soft font-mono">
      <span>00:00</span>
      <span>screenshot 9 of 18</span>
      <span>90:00</span>
    </div>
  </div>
);
