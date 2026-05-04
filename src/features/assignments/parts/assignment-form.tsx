import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input, Select, Textarea } from '@shared/ui';
import type { Assignment, SubmissionType } from '@shared/types';

interface Props {
  initial?: Partial<Assignment>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (body: {
    title: string;
    brief: string;
    submissionType: SubmissionType;
    durationMinutes: number;
  }) => Promise<void> | void;
  onCancel?: () => void;
}

export const AssignmentForm = ({ initial, submitLabel, loading, onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [brief, setBrief] = useState(initial?.brief ?? '');
  const [submissionType, setSubmissionType] = useState<SubmissionType>(initial?.submissionType ?? 'both');
  const [durationMinutes, setDurationMinutes] = useState(initial?.durationMinutes ?? 60);

  useEffect(() => {
    setTitle(initial?.title ?? '');
    setBrief(initial?.brief ?? '');
    setSubmissionType(initial?.submissionType ?? 'both');
    setDurationMinutes(initial?.durationMinutes ?? 60);
  }, [initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, brief, submissionType, durationMinutes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea
        label="Brief"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={8}
        required
        placeholder="Describe what the candidate should build..."
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
