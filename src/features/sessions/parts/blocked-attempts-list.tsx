import { useState } from 'react';
import { Badge, EmptyState, Spinner } from '@shared/ui';
import { ShieldAlert, Camera, X } from '@shared/ui/icons';
import { formatDate } from '@shared/utils/format-date';
import type { BlockedAttempt } from '@shared/types';
import { useScreenshotUri } from '../api/use-sessions-api';

interface Props {
  attempts: BlockedAttempt[];
}

export const BlockedAttemptsList = ({ attempts }: Props) => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (attempts.length === 0) {
    return (
      <EmptyState
        icon={<ShieldAlert size={28} strokeWidth={1.5} />}
        title="No blocked-domain attempts"
        description="The candidate didn't try to reach any blocked sites during this session."
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-line">
        {attempts.map((a) => (
          <li key={a.id} className="py-3 flex items-center gap-4">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-ink truncate">{a.domain}</p>
              <p className="text-xs text-ink-soft mt-0.5">{formatDate(a.attemptedAt)}</p>
            </div>
            {a.screenshotKey ? (
              <button
                type="button"
                onClick={() => setOpenKey(a.screenshotKey ?? null)}
                className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-800 font-medium"
              >
                <Camera size={14} />
                View screenshot
              </button>
            ) : (
              <Badge tone="neutral">no capture</Badge>
            )}
          </li>
        ))}
      </ul>

      {openKey && <ScreenshotLightbox screenshotKey={openKey} onClose={() => setOpenKey(null)} />}
    </>
  );
};

const ScreenshotLightbox = ({
  screenshotKey,
  onClose,
}: {
  screenshotKey: string;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } = useScreenshotUri(screenshotKey);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-brand-50/80 hover:text-brand-50 p-2 rounded-md hover:bg-ink/40"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <div
        className="relative max-w-5xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="bg-surface-sunken rounded-lg p-12 flex items-center justify-center">
            <Spinner size={24} className="text-brand-700" />
          </div>
        ) : isError || !data ? (
          <div className="bg-surface-sunken rounded-lg p-12 text-center text-ink-muted text-sm">
            Could not load screenshot.
          </div>
        ) : (
          <img
            src={data.uri}
            alt="Blocked-attempt screenshot"
            className="rounded-lg shadow-lift max-h-[85vh] object-contain"
          />
        )}
      </div>
    </div>
  );
};
