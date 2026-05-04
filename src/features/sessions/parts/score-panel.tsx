import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, Input, Textarea } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useSessionScore, useUpsertScore } from '../api/use-sessions-api';

export const ScorePanel = ({ sessionId }: { sessionId: string }) => {
  const { data: existing } = useSessionScore(sessionId);
  const upsert = useUpsertScore(sessionId);
  const { push } = useToast();
  const [numericScore, setNumericScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (existing) {
      setNumericScore(existing.numericScore);
      setFeedback(existing.feedback);
    }
  }, [existing]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({ numericScore, feedback });
      push(existing ? 'Score updated' : 'Score saved', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save', 'error');
    }
  };

  return (
    <Card>
      <CardHeader title="Score" subtitle={existing ? 'Edit your existing evaluation.' : 'Evaluate this session.'} />
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Score (0–100)"
          type="number"
          min={0}
          max={100}
          step={1}
          value={numericScore}
          onChange={(e) => setNumericScore(Number(e.target.value))}
          required
        />
        <Textarea
          label="Feedback"
          rows={6}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          placeholder="What worked, what didn't, anything notable from the screenshots..."
        />
        <div className="flex justify-end">
          <Button type="submit" loading={upsert.isPending}>
            {existing ? 'Update score' : 'Save score'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
