import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, Input } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { type ReviewerSettings, useUpdateReviewerSettings } from '../api/use-settings-api';

export const ScreenshotsTab = ({ settings }: { settings: ReviewerSettings }) => {
  const update = useUpdateReviewerSettings();
  const { push } = useToast();
  const [min, setMin] = useState(settings.screenshotIntervalSeconds.min);
  const [max, setMax] = useState(settings.screenshotIntervalSeconds.max);
  const [showWarning, setShowWarning] = useState(settings.showScreenshotWarning);

  useEffect(() => {
    setMin(settings.screenshotIntervalSeconds.min);
    setMax(settings.screenshotIntervalSeconds.max);
    setShowWarning(settings.showScreenshotWarning);
  }, [settings]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (min >= max) {
      push('Min must be less than max', 'error');
      return;
    }
    try {
      await update.mutateAsync({
        screenshotIntervalSeconds: { min, max },
        showScreenshotWarning: showWarning,
      });
      push('Saved', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save', 'error');
    }
  };

  return (
    <Card>
      <CardHeader
        title="Screenshots"
        subtitle="Control how often WorkSight captures the candidate's screen during a session."
      />
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Minimum interval (seconds)"
            type="number"
            min={30}
            max={1800}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            required
          />
          <Input
            label="Maximum interval (seconds)"
            type="number"
            min={31}
            max={1800}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            required
          />
        </div>
        <p className="text-xs text-ink-soft -mt-2">
          WorkSight captures a screenshot at a random moment between min and max seconds. The default
          (60–240) gives ~2 captures per 5-minute session.
        </p>

        <div className="border-t border-line pt-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showWarning}
              onChange={(e) => setShowWarning(e.target.checked)}
              className="mt-1 h-4 w-4 accent-brand-700"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                Show "screenshots are being captured" notice during a session
              </span>
              <span className="block text-xs text-ink-soft mt-1 leading-relaxed">
                When enabled, candidates see a small notice on the session screen acknowledging that
                screenshots are being taken. When disabled, screenshots still happen — just covertly.
              </span>
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={update.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
};
