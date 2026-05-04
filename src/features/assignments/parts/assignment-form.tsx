import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input, Select, Textarea } from '@shared/ui';
import { Eye, EyeOff } from '@shared/ui/icons';
import type { Assignment, SubmissionType } from '@shared/types';

interface SubmitBody {
  title: string;
  brief: string;
  submissionType: SubmissionType;
  durationMinutes: number;
  hideUntilStart: boolean;
  mainTitle: string | null;
  mainBrief: string | null;
}

interface Props {
  initial?: Partial<Assignment>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (body: SubmitBody) => Promise<void> | void;
  onCancel?: () => void;
}

export const AssignmentForm = ({ initial, submitLabel, loading, onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [brief, setBrief] = useState(initial?.brief ?? '');
  const [submissionType, setSubmissionType] = useState<SubmissionType>(initial?.submissionType ?? 'both');
  const [durationMinutes, setDurationMinutes] = useState(initial?.durationMinutes ?? 60);
  const [hideUntilStart, setHideUntilStart] = useState(initial?.hideUntilStart ?? false);
  const [mainTitle, setMainTitle] = useState(initial?.mainTitle ?? '');
  const [mainBrief, setMainBrief] = useState(initial?.mainBrief ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initial?.title ?? '');
    setBrief(initial?.brief ?? '');
    setSubmissionType(initial?.submissionType ?? 'both');
    setDurationMinutes(initial?.durationMinutes ?? 60);
    setHideUntilStart(initial?.hideUntilStart ?? false);
    setMainTitle(initial?.mainTitle ?? '');
    setMainBrief(initial?.mainBrief ?? '');
  }, [initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (hideUntilStart && (!mainTitle.trim() || !mainBrief.trim())) {
      setError('When hide-until-start is on, both the real title and the real brief are required.');
      return;
    }
    setError(null);
    await onSubmit({
      title,
      brief,
      submissionType,
      durationMinutes,
      hideUntilStart,
      mainTitle: hideUntilStart ? mainTitle.trim() : null,
      mainBrief: hideUntilStart ? mainBrief.trim() : null,
    });
  };

  const titleLabel = hideUntilStart ? 'Public title (what the candidate sees pre-start)' : 'Title';
  const briefLabel = hideUntilStart ? 'Public brief (hint, not the real test)' : 'Brief';
  const briefPlaceholder = hideUntilStart
    ? 'A short hint or prep note. The candidate sees this on their dashboard before they start. Example: "Come prepared with a Node + Postgres setup. The actual test will be revealed when you click Start."'
    : 'Describe what the candidate should build...';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={titleLabel}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        label={briefLabel}
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={hideUntilStart ? 4 : 8}
        required
        placeholder={briefPlaceholder}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Submission type"
          value={submissionType}
          onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
        >
          <option value="link">Link only (e.g. GitHub)</option>
          <option value="text">Free text only</option>
          <option value="both">Link and free text</option>
        </Select>
        <Input
          label="Duration (minutes)"
          type="number"
          min={1}
          max={720}
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          required
        />
      </div>

      {/* Hide-until-start toggle. When on, two extra fields appear and the
          labels above shift to indicate they're public-facing. */}
      <div className="ws-card p-4 bg-surface-subtle">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hideUntilStart}
            onChange={(e) => setHideUntilStart(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand-700"
          />
          <span>
            <span className="block text-sm font-medium text-ink inline-flex items-center gap-1.5">
              {hideUntilStart ? <EyeOff size={13} /> : <Eye size={13} />}
              Hide the real test until the candidate clicks Start
            </span>
            <span className="block text-xs text-ink-muted leading-relaxed mt-1">
              When on, the title + brief above become public-facing (a hint or prep note). The
              candidate sees the real test only after starting their session.
            </span>
          </span>
        </label>
      </div>

      {hideUntilStart && (
        <div className="space-y-4 ws-card p-4 border-brand-200 bg-brand-50/30">
          <p className="text-xs uppercase tracking-wider text-brand-700 font-medium">
            Real test (revealed only after Start)
          </p>
          <Input
            label="Real title"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            required={hideUntilStart}
            placeholder="The actual test title — what the candidate sees during the session."
          />
          <Textarea
            label="Real brief"
            value={mainBrief}
            onChange={(e) => setMainBrief(e.target.value)}
            rows={8}
            required={hideUntilStart}
            placeholder="The full test prompt — what the candidate is actually building or solving."
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
