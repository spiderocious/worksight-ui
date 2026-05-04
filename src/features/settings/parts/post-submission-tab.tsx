import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, Input, Textarea } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { type ReviewerSettings, useUpdateReviewerSettings } from '../api/use-settings-api';

export const PostSubmissionTab = ({ settings }: { settings: ReviewerSettings }) => {
  const update = useUpdateReviewerSettings();
  const { push } = useToast();
  const [title, setTitle] = useState(settings.postSubmissionTitle);
  const [description, setDescription] = useState(settings.postSubmissionDescription);

  useEffect(() => {
    setTitle(settings.postSubmissionTitle);
    setDescription(settings.postSubmissionDescription);
  }, [settings.postSubmissionTitle, settings.postSubmissionDescription]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await update.mutateAsync({
        postSubmissionTitle: title,
        postSubmissionDescription: description,
      });
      push('Saved', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save', 'error');
    }
  };

  return (
    <Card>
      <CardHeader
        title="After-submission screen"
        subtitle="Shown to the candidate once they submit. Keep it short and reassuring."
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea
          label="Description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="rounded-lg border border-line bg-surface-subtle px-5 py-6 text-center">
          <p className="text-xs uppercase tracking-wider text-ink-soft mb-3">Preview</p>
          <h3 className="font-display text-2xl tracking-tight text-ink">{title || 'Title goes here'}</h3>
          <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto leading-relaxed">
            {description || 'Description goes here.'}
          </p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={update.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
};
