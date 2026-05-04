import { useState } from 'react';
import { Camera, ImageIcon } from '@shared/ui/icons';
import { Spinner } from '@shared/ui';
import { formatDate } from '@shared/utils/format-date';
import type { ScreenshotRef } from '@shared/types';
import { useScreenshotUri } from '../api/use-sessions-api';

interface Props {
  screenshots: ScreenshotRef[];
}

const ScreenshotImage = ({ k }: { k: string }) => {
  const { data, isLoading, isError } = useScreenshotUri(k);
  if (isLoading) {
    return (
      <div className="aspect-video w-full bg-surface-sunken rounded-lg flex items-center justify-center">
        <Spinner size={20} className="text-brand-700" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="aspect-video w-full bg-surface-sunken rounded-lg flex flex-col items-center justify-center text-ink-soft text-sm gap-1">
        <ImageIcon size={20} />
        <span>Could not load screenshot</span>
      </div>
    );
  }
  return (
    <img
      src={data.uri}
      alt="Session screenshot"
      className="w-full rounded-lg border border-line bg-surface-sunken object-contain max-h-[60vh]"
    />
  );
};

export const ScreenshotScrubber = ({ screenshots }: Props) => {
  const [idx, setIdx] = useState(0);
  if (screenshots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line py-10 px-6 text-center text-ink-soft text-sm">
        <Camera size={22} className="mx-auto mb-2" />
        No screenshots were captured during this session.
      </div>
    );
  }
  const current = screenshots[idx];
  return (
    <div className="space-y-3">
      <ScreenshotImage k={current.key} />
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          {idx + 1} / {screenshots.length}
        </span>
        <span>{formatDate(current.capturedAt)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={screenshots.length - 1}
        step={1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        className="w-full accent-brand-700"
      />
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {screenshots.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`shrink-0 h-1.5 w-6 rounded-full transition ${
              i === idx ? 'bg-brand-700' : 'bg-line hover:bg-brand-300'
            }`}
            aria-label={`Screenshot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
